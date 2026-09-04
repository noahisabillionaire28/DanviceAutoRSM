import type { MetadataRoute } from 'next';
import { ALLOW_INDEXING, SITE_URL } from '@/lib/site';

/**
 * Crawling and indexing are separate levers, and this file only controls the
 * first one. Do not conflate them.
 *
 * This demo carries the real business name over fabricated inventory, so it
 * must not appear in search under that name until the owner signs off. That job
 * belongs entirely to the `noindex` meta tag in app/layout.tsx, which is gated
 * on the same ALLOW_INDEXING flag.
 *
 * robots.txt used to answer `Disallow: /` while the flag was off, which was
 * wrong twice over:
 *
 *   1. It blocked link unfurlers. Texting the site produced a bare URL with no
 *      title, description or image, because a compliant fetcher would not read
 *      the page at all. That is the demo's whole delivery mechanism.
 *   2. It made the indexing goal LESS reliable, not more. A crawler that is
 *      refused the page never reads the `noindex` tag on it, so the URL can
 *      still surface in results as a bare link. Allowing the crawl is what lets
 *      `noindex` actually do its job.
 *
 * So the crawl is allowed in both states, and `noindex` carries the gate.
 * scripts/checks.ts asserts the pair stays consistent, because either half
 * alone is wrong.
 */
export default function robots(): MetadataRoute.Robots {
  const rules = { userAgent: '*', allow: '/', disallow: ['/api/'] };

  // The sitemap is advertised only once the site is meant to be found. Serving
  // it while every page says noindex just invites pointless crawling.
  return ALLOW_INDEXING
    ? { rules, sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules };
}
