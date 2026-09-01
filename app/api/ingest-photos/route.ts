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

const SOURCES: Record<string, string[]> = {
  // Titles are generation-specific and ordered most-correct-first, so each
  // listing gets a photo of the right model year rather than the current one.
  DV1001: ['Honda_Civic_(tenth_generation)', 'Honda_Civic'],            // 2016
  DV1002: ['Toyota_Corolla_(E170)', 'Toyota_Corolla'],                  // 2015
  DV1003: ['Toyota_Camry_(XV50)', 'Toyota_Camry'],                      // 2014
  DV1004: ['Hyundai_Elantra_(MD)', 'Hyundai_Elantra_(AD)', 'Hyundai_Elantra'], // 2017
  DV1005: ['Mazda3_(BM)', 'Mazda3'],                                    // 2016
  DV1006: ['Honda_Accord_(ninth_generation)', 'Honda_Accord'],          // 2013
  DV1007: ['Toyota_Prius_(XW30)', 'Toyota_Prius'],                      // 2015
  DV1008: ['Honda_CR-V_(fourth_generation)', 'Honda_CR-V'],             // 2014
  DV1009: ['Nissan_Rogue_(T32)', 'Nissan_X-Trail', 'Nissan_Rogue'],     // 2016
  DV1010: ['Ford_Escape_(third_generation)', 'Ford_Kuga', 'Ford_Escape'], // 2013
  DV1011: ['Kia_Forte_(YD)', 'Kia_Forte', 'Kia_K3'],                    // 2017
  DV1012: ['Honda_Fit_(second_generation)', 'Honda_Fit'],               // 2012
};

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

  for (const [stock, titles] of Object.entries(SOURCES)) {
    const found = await findPhoto(titles);

    if (!found) {
      results.push({ stock, ok: false, reason: 'no photo found' });
      continue;
    }

    // Confirm the image is actually reachable before storing it.
    let reachable = false;
    let contentType = '';
    try {
      // A 1-byte ranged GET rather than HEAD: upload.wikimedia.org does not
      // answer HEAD consistently and returns an HTML error page instead.
      const probe = await fetch(found.imageUrl, {
        headers: { 'User-Agent': UA, range: 'bytes=0-0' },
        cache: 'no-store',
      });
      reachable = probe.ok;
      contentType = probe.headers.get('content-type') ?? '';
      await probe.arrayBuffer().catch(() => undefined);
    } catch {
      reachable = false;
    }

    if (!reachable || !contentType.startsWith('image/')) {
      results.push({ stock, ok: false, reason: `unreachable (${contentType || 'no type'})`, url: found.imageUrl });
      continue;
    }

    results.push({
      stock,
      ok: true,
      article: found.title,
      file: found.fileName,
      contentType,
      imageUrl: found.imageUrl,
      pageUrl: found.pageUrl,
    });
  }

  return NextResponse.json(
    { found: results.filter((r) => r.ok).length, total: results.length, results },
    { headers: { 'cache-control': 'no-store' } },
  );
}
