import { ALLOWED_IMAGE_HOSTS } from './lib/image-hosts.mjs';

/**
 * Every page route, listed explicitly. A regex broad enough to catch all HTML
 * would also have to exclude /_next/static — fingerprinted and served immutable
 * for a year — and /api/revalidate; a subtly wrong negative lookahead would
 * either kill asset caching or make the purge endpoint cacheable. Literal paths
 * cannot do either. scripts/checks.ts asserts this stays in step with app/.
 */
const PAGE_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/financing',
  '/inventory',
  '/inventory/:slug',
  '/sell-your-car',
];

/**
 * The browser must revalidate HTML on every load; the edge caches as before.
 *
 * max-age=0, must-revalidate is not "re-download every time" — the browser
 * sends a conditional request and gets a bodyless 304 when nothing changed. It
 * costs one round trip and buys the guarantee that a phone cannot render a page
 * from before the current deploy, which is the failure mode that matters when
 * the site is being shown to someone on their own device.
 *
 * s-maxage matches app/page.tsx's revalidate = 300, so edge behaviour is
 * unchanged; stale-while-revalidate keeps the edge serving instantly while it
 * refreshes in the background.
 */
const HTML_CACHE_CONTROL =
  'public, max-age=0, must-revalidate, s-maxage=300, stale-while-revalidate=86400';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: ALLOWED_IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
    formats: ['image/webp'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return PAGE_ROUTES.map((source) => ({
      source,
      headers: [{ key: 'Cache-Control', value: HTML_CACHE_CONTROL }],
    }));
  },
};

export default nextConfig;
