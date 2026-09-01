import type {
  BodyType, Drivetrain, FuelType, Transmission,
} from './supabase/database.types';
import type { SortKey, VehicleFilters } from './types';

export const PAGE_SIZE = 12;

const BODY_TYPES: BodyType[] = ['sedan','suv','truck','coupe','hatchback','minivan','wagon','convertible'];
const TRANSMISSIONS: Transmission[] = ['automatic','manual','cvt','dual_clutch'];
const DRIVETRAINS: Drivetrain[] = ['fwd','rwd','awd','4wd'];
const FUEL_TYPES: FuelType[] = ['gasoline','hybrid','plug_in_hybrid','electric','diesel','flex_fuel'];
const SORTS: SortKey[] = ['newest','price_asc','price_desc','year_desc','mileage_asc'];

export const SORT_LABELS: Record<SortKey, string> = {
  newest: 'Newest arrivals',
  price_asc: 'Price: low to high',
  price_desc: 'Price: high to low',
  year_desc: 'Year: newest first',
  mileage_asc: 'Mileage: lowest first',
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

/** Comma-joined multi-value param, filtered to a known allowlist. */
function multi<T extends string>(v: string | string[] | undefined, allowed: T[]): T[] {
  const raw = one(v);
  if (!raw) return [];
  const seen = new Set<string>();
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => {
      if (!s || seen.has(s)) return false;
      seen.add(s);
      return (allowed as string[]).includes(s);
    }) as T[];
}

/**
 * Coerce and clamp rather than throw. A hand-edited or bot-crawled URL like
 * ?maxPrice=banana must render the page, never a 500.
 */
function int(v: string | string[] | undefined, min: number, max: number): number | undefined {
  const raw = one(v);
  if (raw === undefined || raw === '') return undefined;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(max, Math.max(min, n));
}

/** Makes are free-form DB values, so they get sanitised rather than allowlisted. */
function freeText(v: string | string[] | undefined): string[] {
  const raw = one(v);
  if (!raw) return [];
  const seen = new Set<string>();
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => {
      if (!s || s.length > 40 || seen.has(s)) return false;
      seen.add(s);
      return true;
    })
    .slice(0, 20);
}

export function parseFilters(params: RawSearchParams): VehicleFilters {
  const minPrice = int(params.minPrice, 0, 1_000_000);
  const maxPrice = int(params.maxPrice, 0, 1_000_000);

  // A reversed range would silently return nothing; swap instead.
  const [lo, hi] =
    minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice
      ? [maxPrice, minPrice]
      : [minPrice, maxPrice];

  const sortRaw = one(params.sort) as SortKey | undefined;
  const q = one(params.q)?.trim().slice(0, 80) || undefined;

  return {
    make: freeText(params.make),
    body: multi(params.body, BODY_TYPES),
    transmission: multi(params.trans, TRANSMISSIONS),
    drivetrain: multi(params.drive, DRIVETRAINS),
    fuel: multi(params.fuel, FUEL_TYPES),
    minPrice: lo,
    maxPrice: hi,
    maxMileage: int(params.maxMileage, 0, 1_000_000),
    minYear: int(params.minYear, 1980, 2100),
    q,
    sort: sortRaw && SORTS.includes(sortRaw) ? sortRaw : 'newest',
    page: int(params.page, 1, 500) ?? 1,
  };
}

/** Drops defaults so /inventory stays clean and canonical. */
export function serializeFilters(f: VehicleFilters): string {
  const p = new URLSearchParams();
  if (f.make.length) p.set('make', f.make.join(','));
  if (f.body.length) p.set('body', f.body.join(','));
  if (f.transmission.length) p.set('trans', f.transmission.join(','));
  if (f.drivetrain.length) p.set('drive', f.drivetrain.join(','));
  if (f.fuel.length) p.set('fuel', f.fuel.join(','));
  if (f.minPrice !== undefined) p.set('minPrice', String(f.minPrice));
  if (f.maxPrice !== undefined) p.set('maxPrice', String(f.maxPrice));
  if (f.maxMileage !== undefined) p.set('maxMileage', String(f.maxMileage));
  if (f.minYear !== undefined) p.set('minYear', String(f.minYear));
  if (f.q) p.set('q', f.q);
  if (f.sort !== 'newest') p.set('sort', f.sort);
  if (f.page > 1) p.set('page', String(f.page));
  return p.toString();
}

export function filterHref(f: VehicleFilters): string {
  const qs = serializeFilters(f);
  return qs ? `/inventory?${qs}` : '/inventory';
}

export function countActiveFilters(f: VehicleFilters): number {
  return (
    f.make.length + f.body.length + f.transmission.length +
    f.drivetrain.length + f.fuel.length +
    (f.minPrice !== undefined ? 1 : 0) +
    (f.maxPrice !== undefined ? 1 : 0) +
    (f.maxMileage !== undefined ? 1 : 0) +
    (f.minYear !== undefined ? 1 : 0) +
    (f.q ? 1 : 0)
  );
}

export const EMPTY_FILTERS: VehicleFilters = {
  make: [], body: [], transmission: [], drivetrain: [], fuel: [],
  sort: 'newest', page: 1,
};
