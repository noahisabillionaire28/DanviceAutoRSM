import { getVehicles } from '@/lib/vehicles';
import type { VehicleFilters } from '@/lib/types';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';
import { Pagination } from '@/components/inventory/Pagination';

export async function VehicleResults({ filters }: { filters: VehicleFilters }) {
  const { vehicles, page, pageCount } = await getVehicles(filters);

  return (
    <>
      <VehicleGrid vehicles={vehicles} />
      <Pagination filters={filters} page={page} pageCount={pageCount} />
    </>
  );
}
