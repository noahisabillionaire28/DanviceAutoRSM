/**
 * Single source of truth for business identity.
 * Nothing else in the app should hardcode name, address, phone, or hours.
 */

export const SITE = {
  name: 'Danvice Auto of RSM',
  shortName: 'Danvice Auto',
  tagline: 'Affordable pre-owned vehicles with flexible financing options for all buyers.',
  mission: 'To provide a fair, respectful, and efficient service to all customers, every time.',
  /** The hero H1. Lives here because app/opengraph-image.tsx renders it too,
   *  and the share image shipped a retired headline once already. */
  heroHeadline: 'Affordable pre\u2011owned. Flexible financing.',
  description:
    'Used car sales and full auto service in Rancho Santa Margarita. German and Japanese specialists — Mercedes-Benz, BMW, Audi, Lexus, Toyota and more. Financing for first-time and no-credit buyers.',

  /**
   * Sales is the site-wide CTA number. The demo previously carried
   * (949) 304-6442, which matches no public listing for this business; the
   * sales line below is the number Yelp, the Chamber of Commerce and the
   * owner's own brief all agree on.
   */
  phone: {
    display: '(949) 326-6194',
    tel: '+19493266194',
    schema: '+1-949-326-6194',
  },

  /** Service department — a different line, and a different department. */
  servicePhone: {
    display: '(949) 556-3607',
    tel: '+19495563607',
    schema: '+1-949-556-3607',
  },

  email: {
    general: 'info@danvice.com',
    finance: 'finance@danvice.com',
  },

  founded: '2020',
  owner: 'Brindan Jayaraj',

  /** Sold and serviced. The German marques are the service specialism. */
  brands: [
    'Mercedes-Benz',
    'BMW',
    'Audi',
    'Lexus',
    'Infiniti',
    'Toyota',
    'Honda',
    'Acura',
    'Nissan',
  ],

  address: {
    street: '29901 Santa Margarita Pkwy',
    unit: 'STE C',
    city: 'Rancho Santa Margarita',
    state: 'CA',
    zip: '92688',
    country: 'US',
  },

  geo: { latitude: 33.6403, longitude: -117.6031 },

  /**
   * Sales hours, per the owner. The demo previously ran Mon–Fri to 7pm and
   * opened on Sunday, and three pages said "open seven days a week" — the lot
   * is closed Sunday, so that claim sent people to a shut door.
   */
  hours: [
    { day: 'Monday', open: '09:00', close: '18:00' },
    { day: 'Tuesday', open: '09:00', close: '18:00' },
    { day: 'Wednesday', open: '09:00', close: '18:00' },
    { day: 'Thursday', open: '09:00', close: '18:00' },
    { day: 'Friday', open: '09:00', close: '18:00' },
    { day: 'Saturday', open: '09:00', close: '18:00' },
    { day: 'Sunday', closed: true },
  ] as const,

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
    { href: '/service', label: 'Service' },
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

/**
 * One formatter for opening hours, because two pages render them and a closed
 * day has to read as "Closed" rather than "NaNam – NaNam". The footer and the
 * contact page each had their own copy of the time formatter before this.
 */
export type OpeningHours = (typeof SITE.hours)[number];

export function hoursLabel(entry: OpeningHours): string {
  if ('closed' in entry) return 'Closed';
  const time = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, '0')}${period}`;
  };
  return `${time(entry.open)} – ${time(entry.close)}`;
}

export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SITE.name}, ${formattedAddress()}`,
  )}`;
}
