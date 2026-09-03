import { Suspense } from 'react';
import type { Metadata } from 'next';
import { parseFilters, serializeFilters, type RawSearchParams } from '@/lib/filters';
import { getFacets, getVehicles } from '@/lib/vehicles';
import { breadcrumbJsonLd } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb, withHome } from '@/components/ui/Breadcrumb';
import { FilterPanel } from '@/components/inventory/FilterPanel';
import { FilterToolbar } from '@/components/inventory/FilterToolbar';
import { ActiveFilterChips } from '@/components/inventory/ActiveFilterChips';
import { VehicleGridSkeleton } from '@/components/vehicles/VehicleCardSkeleton';
import { VehicleResults } from './vehicle-results';

export const metadata: Metadata = {
  title: 'Used cars in Rancho Santa Margarita',
  description:
    'Browse every car on the lot — all between $5,000 and $15,000, inspected, and priced up front. Filter by make, body style, price, and mileage.',
};

// One array drives both the visible breadcrumb and its structured data.
const TRAIL = [{ name: 'Inventory', href: '/inventory' }];

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);

  // Facets and the count are cheap and render immediately; only the grid streams.
  const [facets, { total }] = await Promise.all([
    getFacets(),
    getVehicles(filters),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(withHome(TRAIL))} />
      <Breadcrumb trail={TRAIL} />

      <section className="border-b border-blue-100 bg-neutral-100">
        <Container className="py-14 md:py-20">
          <p className="eyebrow eyebrow-rule">Inventory</p>
          <h1 className="mt-5 text-display-lg text-blue-900">
            Every car we have, with the price on it
          </h1>
          <p className="mt-4 max-w-prose text-lede text-muted">
            No hidden listings, no &ldquo;call for price&rdquo;. What you see here is
            what is sitting on the lot today.
          </p>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <h2 className="sr-only">Filters</h2>
            <div className="sticky top-28">
              <FilterPanel facets={facets} />
            </div>
          </aside>

          <div className="lg:col-span-9">
            <FilterToolbar facets={facets} resultCount={total} />
            <ActiveFilterChips />

            <div className="mt-8">
              {/* The key is load-bearing: changing it tears down and re-suspends
                  the subtree, so each filter change shows skeletons instead of
                  freezing on stale results. */}
              <Suspense
                key={serializeFilters(filters)}
                fallback={<VehicleGridSkeleton count={6} />}
              >
                <VehicleResults filters={filters} />
              </Suspense>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
