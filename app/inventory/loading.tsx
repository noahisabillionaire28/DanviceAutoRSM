import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { VehicleGridSkeleton } from '@/components/vehicles/VehicleCardSkeleton';

export default function InventoryLoading() {
  return (
    <>
      <section className="border-b border-blue-100 bg-neutral-100">
        <Container className="py-14 md:py-20">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-6 h-12 w-[min(34rem,90%)]" />
          <Skeleton className="mt-5 h-6 w-[min(28rem,80%)]" />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="flex flex-col gap-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-3 h-24 w-full" />
                </div>
              ))}
            </div>
          </aside>
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between border-b border-blue-100 pb-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-44" />
            </div>
            <div className="mt-8">
              <VehicleGridSkeleton count={6} />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
