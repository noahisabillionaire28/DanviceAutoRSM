import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { VehicleCardData } from '@/lib/types';
import { VehicleCard } from './VehicleCard';

export function VehicleGrid({
  vehicles,
  className,
}: {
  vehicles: VehicleCardData[];
  className?: string;
}) {
  if (!vehicles.length) {
    return (
      <div className="rounded-lg border border-dashed border-blue-200 bg-surface/60 px-6 py-20 text-center">
        <h3 className="font-display text-xl text-blue-900">No matches on the lot</h3>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          Nothing fits those filters right now. Try widening your price range, or
          clear the filters to see everything we have.
        </p>
        <Link
          href="/inventory"
          className="mt-6 inline-block text-blue-900 underline decoration-blue-300 underline-offset-4 transition-colors hover:decoration-orange-500"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8', className)}>
      {vehicles.map((v, i) => (
        <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
      ))}
    </div>
  );
}
