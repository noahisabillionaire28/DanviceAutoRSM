const priceFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numFmt = new Intl.NumberFormat('en-US');

/** Whole dollars — this inventory has no cents. */
export function formatPrice(dollars: number): string {
  return priceFmt.format(dollars);
}

export function formatMileage(miles: number): string {
  return `${numFmt.format(miles)} mi`;
}

/** Compact mileage for dense card rows: 118,400 -> "118K mi" */
export function formatMileageShort(miles: number): string {
  if (miles < 1000) return `${miles} mi`;
  return `${Math.round(miles / 1000)}K mi`;
}

export function formatNumber(n: number): string {
  return numFmt.format(n);
}

type TitleParts = {
  year: number;
  make: string;
  model: string;
  trim_level?: string | null;
};

export function vehicleTitle(v: TitleParts, includeTrim = false): string {
  const base = `${v.year} ${v.make} ${v.model}`;
  return includeTrim && v.trim_level ? `${base} ${v.trim_level}` : base;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Turns enum-ish db values into display text: 'plug_in_hybrid' -> 'Plug-in Hybrid' */
const LABELS: Record<string, string> = {
  fwd: 'FWD',
  rwd: 'RWD',
  awd: 'AWD',
  '4wd': '4WD',
  cvt: 'CVT',
  dual_clutch: 'Dual-Clutch',
  suv: 'SUV',
  plug_in_hybrid: 'Plug-in Hybrid',
  flex_fuel: 'Flex Fuel',
  mpg: 'MPG',
};

export function label(value: string | null | undefined): string {
  if (!value) return '—';
  if (LABELS[value]) return LABELS[value];
  return value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatPhoneDigits(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
