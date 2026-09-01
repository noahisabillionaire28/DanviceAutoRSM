import type { MetadataRoute } from 'next';
import { ALLOW_INDEXING, SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Gated: this demo carries the real business name but fabricated inventory,
  // so it must not be indexed under that name until the owner signs off.
  // Flip NEXT_PUBLIC_ALLOW_INDEXING=true to publish.
  if (!ALLOW_INDEXING) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
