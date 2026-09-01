import { unstable_cache } from 'next/cache';
import { createClient } from './supabase/server';
import { CARD_COLUMNS } from './types';
import { PAGE_SIZE } from './filters';
import type { InventoryFacets, Vehicle, VehicleCardData, VehicleFilters } from './types';

const TAG = 'vehicles';

export interface VehiclePage {
  vehicles: VehicleCardData[];
  total: number;
  page: number;
  pageCount: number;
}

async function queryVehicles(filters: VehicleFilters): Promise<VehiclePage> {
  const supabase = await createClient();

  let q = supabase
    .from('vehicles')
    .select(CARD_COLUMNS, { count: 'exact' })
    .eq('status', 'available');

  if (filters.make.length) {
    // Stored capitalised ("Honda"), filtered lowercase from the URL.
    q = q.or(filters.make.map((m) => `make.ilike.${m}`).join(','));
  }
  if (filters.body.length) q = q.in('body_type', filters.body);
  if (filters.transmission.length) q = q.in('transmission', filters.transmission);
  if (filters.drivetrain.length) q = q.in('drivetrain', filters.drivetrain);
  if (filters.fuel.length) q = q.in('fuel_type', filters.fuel);
  if (filters.minPrice !== undefined) q = q.gte('price', filters.minPrice);
  if (filters.maxPrice !== undefined) q = q.lte('price', filters.maxPrice);
  if (filters.maxMileage !== undefined) q = q.lte('mileage', filters.maxMileage);
  if (filters.minYear !== undefined) q = q.gte('year', filters.minYear);
  if (filters.q) q = q.textSearch('search_vector', filters.q, { type: 'websearch' });

  switch (filters.sort) {
    case 'price_asc': q = q.order('price', { ascending: true }); break;
    case 'price_desc': q = q.order('price', { ascending: false }); break;
    case 'year_desc': q = q.order('year', { ascending: false }); break;
    case 'mileage_asc': q = q.order('mileage', { ascending: true }); break;
    default: q = q.order('created_at', { ascending: false });
  }
  q = q.order('id', { ascending: true }); // stable tiebreak so pagination can't repeat rows

  const page = Math.max(1, filters.page);
  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await q.range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error('[vehicles] query failed:', error.message);
    return { vehicles: [], total: 0, page, pageCount: 0 };
  }

  const total = count ?? 0;
  return {
    vehicles: (data ?? []) as unknown as VehicleCardData[],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getVehicles(filters: VehicleFilters): Promise<VehiclePage> {
  const key = JSON.stringify(filters);
  return unstable_cache(() => queryVehicles(filters), ['vehicles:list', key], {
    tags: [TAG],
    revalidate: 60,
  })();
}

export const getFeatured = unstable_cache(
  async (limit = 3): Promise<VehicleCardData[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('vehicles')
      .select(CARD_COLUMNS)
      .eq('status', 'available')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[vehicles] featured failed:', error.message);
      return [];
    }
    return (data ?? []) as unknown as VehicleCardData[];
  },
  ['vehicles:featured'],
  { tags: [TAG], revalidate: 300 },
);

export const getVehicleBySlug = unstable_cache(
  async (slug: string): Promise<Vehicle | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'available')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('[vehicles] detail failed:', error.message);
      return null;
    }
    return (data as Vehicle | null) ?? null;
  },
  ['vehicles:detail'],
  { tags: [TAG], revalidate: 300 },
);

export const getAllSlugs = unstable_cache(
  async (): Promise<{ slug: string; updated_at: string }[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('vehicles')
      .select('slug, updated_at')
      .eq('status', 'available');

    if (error) {
      console.error('[vehicles] slugs failed:', error.message);
      return [];
    }
    return (data ?? []) as { slug: string; updated_at: string }[];
  },
  ['vehicles:slugs'],
  { tags: [TAG], revalidate: 3600 },
);

/** Similar vehicles for the detail page rail: same body type, nearby price. */
export const getSimilar = unstable_cache(
  async (id: string, bodyType: string, price: number, limit = 3): Promise<VehicleCardData[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('vehicles')
      .select(CARD_COLUMNS)
      .eq('status', 'available')
      .eq('body_type', bodyType)
      .neq('id', id)
      .gte('price', Math.round(price * 0.6))
      .lte('price', Math.round(price * 1.4))
      .limit(limit);

    if (error || !data?.length) {
      // Fall back to any other available vehicles rather than an empty rail.
      const { data: fallback } = await supabase
        .from('vehicles')
        .select(CARD_COLUMNS)
        .eq('status', 'available')
        .neq('id', id)
        .limit(limit);
      return (fallback ?? []) as unknown as VehicleCardData[];
    }
    return data as unknown as VehicleCardData[];
  },
  ['vehicles:similar'],
  { tags: [TAG], revalidate: 300 },
);

const FALLBACK_FACETS: InventoryFacets = {
  makes: [], bodyTypes: [], priceMin: 0, priceMax: 20000,
  yearMin: 2000, yearMax: new Date().getFullYear(), mileageMax: 200000, total: 0,
};

export const getFacets = unstable_cache(
  async (): Promise<InventoryFacets> => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('inventory_facets');

    if (error || !data) {
      console.error('[vehicles] facets failed:', error?.message);
      return FALLBACK_FACETS;
    }
    const f = data as unknown as Partial<InventoryFacets>;
    return { ...FALLBACK_FACETS, ...f };
  },
  ['vehicles:facets'],
  { tags: [TAG], revalidate: 300 },
);
