import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

// The Container padding must track app/inventory/[slug]/page.tsx exactly, or
// the detail page jumps as the skeleton is replaced. Asserted in
// scripts/checks.ts, because the two drifted apart once already.
export default function VehicleLoading() {
  return (
    <Container className="pb-8 pt-2 md:pb-12 md:pt-4">
      <Skeleton className="mb-8 h-5 w-64" />
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Skeleton className="aspect-[3/2] w-full rounded-card" />
          <div className="mt-3 grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/2] rounded-md" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="mt-2 h-7 w-1/3" />
          <Skeleton className="mt-6 h-11 w-40" />
          <Skeleton className="mt-6 h-7 w-full" />
          <Skeleton className="mt-8 h-13 w-full rounded-md" />
          <Skeleton className="mt-3 h-13 w-full rounded-md" />
        </div>
      </div>
    </Container>
  );
}
