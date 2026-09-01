import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Box-model-identical to VehicleCard: same aspect ratio, same padding, same
 * row heights. Any drift here shows up directly as CLS.
 */
export function VehicleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-surface shadow-card ring-1 ring-navy-100/70">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="h-[1.75rem] w-4/5" />
        <Skeleton className="mt-[0.125rem] h-5 w-1/3" />
        <Skeleton className="mt-4 h-5 w-full" />
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="mb-1 h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

export function VehicleGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
