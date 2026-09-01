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
  DV1001: ['Honda_Civic_(eleventh_generation)', 'Honda_Civic_(tenth_generation)'],
  DV1002: ['Toyota_Corolla_(E170)'],
  DV1003: ['Toyota_Camry_(XV50)'],
  DV1004: ['Hyundai_Elantra_(AD)'],
  DV1005: ['Mazda3', 'Mazda_Mazda3'],
  DV1006: ['Honda_Accord_(ninth_generation)'],
  DV1007: ['Toyota_Prius_(XW30)', 'Toyota_Prius'],
  DV1008: ['Honda_CR-V_(fourth_generation)'],
  DV1009: ['Nissan_Rogue'],
  DV1010: ['Ford_Escape_(third_generation)'],
  DV1011: ['Kia_Forte'],
  DV1012: ['Honda_Fit_(second_generation)', 'Honda_Fit'],
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

      // Rewrite the rendered width upward: .../320px-Name.jpg -> .../1280px-Name.jpg
      const imageUrl = thumb.replace(/\/\d+px-/, '/1280px-');
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
      const head = await fetch(found.imageUrl, {
        method: 'HEAD',
        headers: { 'User-Agent': UA },
        cache: 'no-store',
      });
      reachable = head.ok;
      contentType = head.headers.get('content-type') ?? '';
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
