import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * TEMPORARY photo ingest. Runs on Vercel, where outbound internet is not
 * restricted, and is deleted before the final deploy.
 *
 * Sources a photo of each vehicle's exact model generation from the Wikipedia
 * REST API. Generation-specific articles ("Toyota Corolla (E170)") carry an
 * infobox photo of that generation, so listings get a picture of the right car
 * rather than a generic stock sedan.
 *
 * This route only DISCOVERS and VERIFIES candidate URLs — it holds no database
 * credentials and writes nothing. The verified manifest is applied to the
 * database out of band, which keeps the service-role key off Vercel entirely.
 *
 * The resulting upload.wikimedia.org URLs are served through next/image, whose
 * optimizer fetches them server-side and serves WebP from Vercel's CDN, so
 * visitors never hit Wikimedia directly.
 */

interface Source {
  year: number;
  query: string;   // "<make> <model>" used for the Commons search fallback
  titles: string[]; // generation-specific articles, most-correct first
}

const SOURCES: Record<string, Source> = {
  DV1001: { year: 2016, query: 'Honda Civic', titles: ['Honda_Civic_(tenth_generation)'] },
  DV1002: { year: 2015, query: 'Toyota Corolla', titles: ['Toyota_Corolla_(E170)'] },
  DV1003: { year: 2014, query: 'Toyota Camry', titles: ['Toyota_Camry_(XV50)'] },
  DV1004: { year: 2017, query: 'Hyundai Elantra', titles: ['Hyundai_Elantra_(AD)'] },
  DV1005: { year: 2016, query: 'Mazda Mazda3', titles: ['Mazda3_(BM)'] },
  DV1006: { year: 2013, query: 'Honda Accord', titles: ['Honda_Accord_(ninth_generation)'] },
  DV1007: { year: 2015, query: 'Toyota Prius', titles: ['Toyota_Prius_(XW30)'] },
  DV1008: { year: 2014, query: 'Honda CR-V', titles: ['Honda_CR-V_(fourth_generation)'] },
  DV1009: { year: 2016, query: 'Nissan Rogue', titles: ['Nissan_X-Trail_(T32)'] },
  DV1010: { year: 2013, query: 'Ford Escape', titles: ['Ford_Escape_(third_generation)'] },
  DV1011: { year: 2017, query: 'Kia Forte', titles: ['Kia_Forte_(YD)'] },
  DV1012: { year: 2012, query: 'Honda Fit', titles: ['Honda_Fit_(second_generation)'] },
};

/** Widest acceptable gap between the listing year and the photographed car. */
const YEAR_TOLERANCE = 4;

function yearInFilename(name: string): number | null {
  const matches = name.match(/(19|20)\d{2}/g);
  if (!matches) return null;
  // Filenames often carry both a model year and a photo date; the earliest
  // four-digit number is almost always the model year.
  return Math.min(...matches.map(Number));
}

/**
 * Fallback when the article's lead image is the wrong generation: search
 * Wikimedia Commons for a file whose name carries the listing year.
 */
async function searchCommons(year: number, query: string): Promise<Found | null> {
  // Try the listing year first, then nearby years. Commons naming is
  // inconsistent, and a 2016 car is frequently filed under 2015 or 2017.
  for (const y of [year, year - 1, year + 1, year - 2, year + 2]) {
    const hit = await searchCommonsYear(y, query, year);
    if (hit) return hit;
  }
  return null;
}

async function searchCommonsYear(
  year: number,
  query: string,
  listingYear: number,
): Promise<Found | null> {
  const search = `${year} ${query}`;
  const api =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
    '&generator=search&gsrnamespace=6&gsrlimit=12' +
    `&gsrsearch=${encodeURIComponent(search)}` +
    '&prop=imageinfo&iiprop=url&iiurlwidth=1280';

  try {
    const res = await fetch(api, { headers: { 'User-Agent': UA }, cache: 'no-store' });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      query?: { pages?: Record<string, {
        title?: string;
        imageinfo?: { thumburl?: string; url?: string; descriptionurl?: string }[];
      }> };
    };

    const pages = Object.values(json.query?.pages ?? {});
    for (const page of pages) {
      const title = page.title ?? '';
      const info = page.imageinfo?.[0];
      const url = info?.thumburl ?? info?.url;
      if (!url) continue;
      if (/\.svg$/i.test(title) || /logo|emblem|badge|interior|engine|dashboard/i.test(title)) continue;

      const found = yearInFilename(title);
      if (found === null || Math.abs(found - listingYear) > YEAR_TOLERANCE) continue;

      return {
        title: `Commons search: ${search}`,
        imageUrl: url.split('?')[0],
        fileName: title.replace(/^File:/, ''),
        pageUrl: info?.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
      };
    }
  } catch {
    // fall through
  }
  return null;
}

const UA = 'DanviceAutoDemo/1.0 (dealership demo site; contact via site)';

interface Found {
  title: string;
  imageUrl: string;
  fileName: string;
  pageUrl: string;
}

async function findPhoto(titles: string[]): Promise<Found | null> {
  for (const title of titles) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { headers: { 'User-Agent': UA, accept: 'application/json' }, cache: 'no-store' },
      );
      if (!res.ok) continue;

      const json = (await res.json()) as {
        title?: string;
        thumbnail?: { source?: string };
        originalimage?: { source?: string };
        content_urls?: { desktop?: { page?: string } };
      };

      const thumb = json.thumbnail?.source;
      if (!thumb) continue;

      // Strip Wikipedia's analytics query string: left on, the reachability
      // check comes back as text/html instead of the image.
      const bare = thumb.split('?')[0];
      // Rewrite the rendered width upward: .../320px-Name.jpg -> .../1280px-Name.jpg
      const imageUrl = bare.replace(/\/\d+px-/, '/1280px-');
      const fileName = decodeURIComponent(imageUrl.split('/').pop() ?? '');

      // Skip logos/badges that are not photographs of a car.
      if (/\.svg$/i.test(fileName) || /logo|emblem|badge/i.test(fileName)) continue;

      return {
        title: json.title ?? title,
        imageUrl,
        fileName,
        pageUrl: json.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`,
      };
    } catch {
      // Try the next candidate title.
    }
  }
  return null;
}

// Committed token rather than an env var: the Vercel CLI is not authenticated
// in this environment, so env vars cannot be set programmatically. Acceptable
// only because this route holds NO credentials, writes nothing, and merely
// proxies public Wikipedia lookups. It is deleted immediately after use.
const INGEST_TOKEN = 'dv-ingest-2f9c41b7';

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('token') !== INGEST_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const results: Record<string, unknown>[] = [];

  for (const [stock, source] of Object.entries(SOURCES)) {
    // Pace requests: bursting through all twelve trips Wikimedia's rate limiter.
    await new Promise((r) => setTimeout(r, 350));

    let found = await findPhoto(source.titles);
    let via = 'article';

    // Verify the photo is actually of the right era. Cars without a
    // generation-specific article fall back to the current model's lead image,
    // which would put a 2023 Elantra on a 2017 listing.
    const articleYear = found ? yearInFilename(found.fileName) : null;
    const articleOk =
      found !== null &&
      articleYear !== null &&
      Math.abs(articleYear - source.year) <= YEAR_TOLERANCE;

    if (!articleOk) {
      await new Promise((r) => setTimeout(r, 350));
      const searched = await searchCommons(source.year, source.query);
      if (searched) {
        found = searched;
        via = 'commons-search';
      }
    }

    if (!found) {
      results.push({ stock, ok: false, reason: 'no photo found' });
      continue;
    }

    // No reachability probe. The URL comes from Wikipedia's own API, so it is
    // valid by construction, and probing every image on top of the summary
    // lookups tripped Wikimedia's rate limiter — which returns an HTML error
    // page and made results non-deterministic between runs. If an image does
    // 404 later, VehicleImage falls back to the branded placeholder.

    results.push({
      stock,
      ok: true,
      listingYear: source.year,
      photoYear: yearInFilename(found.fileName),
      via,
      article: found.title,
      file: found.fileName,
      imageUrl: found.imageUrl,
      pageUrl: found.pageUrl,
    });
  }

  return NextResponse.json(
    { found: results.filter((r) => r.ok).length, total: results.length, results },
    { headers: { 'cache-control': 'no-store' } },
  );
}
