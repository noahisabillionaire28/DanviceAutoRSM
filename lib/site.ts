/**
 * Single source of truth for business identity.
 * Nothing else in the app should hardcode name, address, phone, or hours.
 */

export const SITE = {
  name: 'Danvice Auto of RSM',
  shortName: 'Danvice Auto',
  tagline: 'Honest cars for real budgets in South Orange County.',
  description:
    'Quality used cars from $5,000 to $15,000 in Rancho Santa Margarita. Straightforward pricing, financing for first-time buyers, and every vehicle inspected before it hits the lot.',

  phone: {
    display: '(949) 304-6442',
    tel: '+19493046442',
    schema: '+1-949-304-6442',
  },

  address: {
    street: '29901 Santa Margarita Pkwy',
    unit: 'STE C',
    city: 'Rancho Santa Margarita',
    state: 'CA',
    zip: '92688',
    country: 'US',
  },

  geo: { latitude: 33.6403, longitude: -117.6031 },

  /** Demo hours — confirm with the owner before launch. */
  hours: [
    { day: 'Monday', open: '09:00', close: '19:00' },
    { day: 'Tuesday', open: '09:00', close: '19:00' },
    { day: 'Wednesday', open: '09:00', close: '19:00' },
    { day: 'Thursday', open: '09:00', close: '19:00' },
    { day: 'Friday', open: '09:00', close: '19:00' },
    { day: 'Saturday', open: '09:00', close: '18:00' },
    { day: 'Sunday', open: '10:00', close: '17:00' },
  ] as const,

  priceRange: { min: 5000, max: 15000 },

  areaServed: [
    'Rancho Santa Margarita',
    'Mission Viejo',
    'Lake Forest',
    'Ladera Ranch',
    'Coto de Caza',
    'Trabuco Canyon',
    'Foothill Ranch',
    'Aliso Viejo',
  ],

  nav: [
    { href: '/inventory', label: 'Inventory' },
    { href: '/financing', label: 'Financing' },
    { href: '/sell-your-car', label: 'Sell Your Car' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],

  legal: {
    paymentDisclaimer:
      'Estimated payment only. Not an offer of credit or a financing commitment. Actual terms depend on approved credit, term, and down payment.',
    inventoryDisclaimer:
      'Vehicle details are believed accurate but are not guaranteed. Please confirm equipment and condition before purchase.',
    photoCredit:
      'Vehicle photography: Wikimedia Commons contributors, licensed CC BY-SA.',
  },
} as const;

/**
 * Absolute origin used for canonical URLs, JSON-LD @id, OG tags, and sitemap
 * entries — all of which must be absolute and must not leak "localhost" into
 * production markup. Falls back to the known production origin rather than
 * localhost, because Vercel env vars are not set for this project.
 */
const PRODUCTION_URL = 'https://danvice-auto-rsm-lucrosai.vercel.app';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  // Deliberately NOT VERCEL_PROJECT_PRODUCTION_URL: on a team project that
  // resolves to danvice-auto-rsm.vercel.app, which is not the alias this
  // deployment actually serves on, so canonicals and sitemap URLs would point
  // at a hostname that does not resolve.
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : PRODUCTION_URL)
).replace(/\/$/, '');

export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

export function formattedAddress(): string {
  const a = SITE.address;
  return `${a.street} ${a.unit}, ${a.city}, ${a.state} ${a.zip}`;
}

export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SITE.name}, ${formattedAddress()}`,
  )}`;
}
