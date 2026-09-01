import { getFeatured } from '@/lib/vehicles';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';

export async function FeaturedVehicles() {
  const vehicles = await getFeatured(3);
  if (!vehicles.length) return null;
  return <VehicleGrid vehicles={vehicles} />;
}
