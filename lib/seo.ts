import { SITE, SITE_URL, formattedAddress } from './site';
import { formatPrice, vehicleTitle } from './format';
import { firstUsableImage } from './images';
import type { Vehicle } from './types';

const DEALER_ID = `${SITE_URL}/#dealer`;

const DAY_MAP: Record<string, string> = {
  Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday',
  Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday',
};

export function autoDealerJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': DEALER_ID,
    name: SITE.name,
    description: SITE.description,
    url: SITE_URL,
    telephone: SITE.phone.schema,
    priceRange: `${formatPrice(SITE.priceRange.min)} - ${formatPrice(SITE.priceRange.max)}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SITE.address.street} ${SITE.address.unit}`,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    // Closed days are omitted entirely rather than sent with empty times:
    // schema.org treats an absent day as closed, and Google reads a malformed
    // OpeningHoursSpecification as "hours unknown" for the whole business.
    openingHoursSpecification: SITE.hours
      .filter((h): h is Extract<typeof h, { open: string }> => !('closed' in h))
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${DAY_MAP[h.day]}`,
        opens: h.open,
        closes: h.close,
      })),
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'City', name })),
  };
}

const FUEL_LABELS: Record<string, string> = {
  gasoline: 'Gasoline', hybrid: 'Hybrid Electric', plug_in_hybrid: 'Plug-in Hybrid',
  electric: 'Electric', diesel: 'Diesel', flex_fuel: 'Flex Fuel',
};
const DRIVE_LABELS: Record<string, string> = {
  fwd: 'FrontWheelDriveConfiguration', rwd: 'RearWheelDriveConfiguration',
  awd: 'AllWheelDriveConfiguration', '4wd': 'FourWheelDriveConfiguration',
};
const TRANS_LABELS: Record<string, string> = {
  automatic: 'Automatic', manual: 'Manual', cvt: 'Continuously Variable (CVT)',
  dual_clutch: 'Dual-Clutch',
};

export function vehicleJsonLd(v: Vehicle) {
  const title = vehicleTitle(v, true);
  const image = firstUsableImage(v.images);

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: title,
    description: v.description ?? SITE.description,
    url: `${SITE_URL}/inventory/${v.slug}`,
    ...(image ? { image: image.startsWith('http') ? image : `${SITE_URL}${image}` } : {}),
    ...(v.vin ? { vehicleIdentificationNumber: v.vin } : {}),
    sku: v.stock_number,
    brand: { '@type': 'Brand', name: v.make },
    model: v.model,
    ...(v.trim_level ? { vehicleConfiguration: v.trim_level } : {}),
    vehicleModelDate: String(v.year),
    productionDate: String(v.year),
    itemCondition: 'https://schema.org/UsedCondition',
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: v.mileage,
      unitCode: 'SMI',
    },
    vehicleTransmission: TRANS_LABELS[v.transmission] ?? v.transmission,
    driveWheelConfiguration: `https://schema.org/${DRIVE_LABELS[v.drivetrain] ?? 'FrontWheelDriveConfiguration'}`,
    fuelType: FUEL_LABELS[v.fuel_type] ?? v.fuel_type,
    bodyType: v.body_type,
    ...(v.engine ? { vehicleEngine: { '@type': 'EngineSpecification', name: v.engine } } : {}),
    ...(v.doors ? { numberOfDoors: v.doors } : {}),
    ...(v.exterior_color ? { color: v.exterior_color } : {}),
    offers: {
      '@type': 'Offer',
      price: v.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      url: `${SITE_URL}/inventory/${v.slug}`,
      seller: { '@id': DEALER_ID },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export { formattedAddress };
