import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/vehicles';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/inventory', '/service', '/financing', '/sell-your-car', '/about', '/contact'];

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/inventory' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : path === '/inventory' ? 0.9 : 0.6,
  }));

  const vehicles = await getAllSlugs();
  const vehicleEntries: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${SITE_URL}/inventory/${v.slug}`,
    lastModified: new Date(v.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...vehicleEntries];
}
