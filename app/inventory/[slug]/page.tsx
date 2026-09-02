import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSimilar, getVehicleBySlug } from '@/lib/vehicles';
import { formatPrice, label, vehicleTitle } from '@/lib/format';
import { breadcrumbJsonLd, vehicleJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { JsonLd } from '@/components/seo/JsonLd';
import { VehicleGallery } from '@/components/vehicles/VehicleGallery';
import { VehicleSpecs } from '@/components/vehicles/VehicleSpecs';
import { PaymentCalculator } from '@/components/vehicles/PaymentCalculator';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';
import { LeadFormModal } from '@/components/leads/LeadFormModal';

/**
 * force-dynamic so an unknown slug returns a real HTTP 404.
 *
 * Under ISR, notFound() for an on-demand slug gets stored in the cache and
 * replayed as 200 with the 404 body — a soft 404, which would let search
 * engines index vehicles that do not exist once indexing is enabled. Removing
 * the route-level revalidate alone did not fix it.
 *
 * This costs little: getVehicleBySlug is wrapped in unstable_cache with the
 * 'vehicles' tag, so repeat views still serve from the data cache rather than
 * hitting Postgres, and /api/revalidate purges it on inventory changes.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: 'Vehicle not found' };

  const title = `${vehicleTitle(vehicle, true)} — ${formatPrice(vehicle.price)}`;
  const description =
    vehicle.description?.slice(0, 155) ??
    `${vehicleTitle(vehicle)} for sale at ${SITE.name} in ${SITE.address.city}.`;

  return {
    title,
    description,
    alternates: { canonical: `/inventory/${vehicle.slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const title = vehicleTitle(vehicle);
  const fullTitle = vehicleTitle(vehicle, true);
  const similar = await getSimilar(vehicle.id, vehicle.body_type, vehicle.price);
  const hasDrop = vehicle.previous_price != null && vehicle.previous_price > vehicle.price;

  return (
    <>
      <JsonLd data={vehicleJsonLd(vehicle)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', href: '/' },
          { name: 'Inventory', href: '/inventory' },
          { name: fullTitle, href: `/inventory/${vehicle.slug}` },
        ])}
      />

      <Container className="py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-muted">
            <li><Link href="/" className="hover:text-maroon-900">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/inventory" className="hover:text-maroon-900">Inventory</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-maroon-900">{fullTitle}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <VehicleGallery
              images={vehicle.images}
              alt={fullTitle}
              placeholderLabel={title}
            />
          </div>

          <div className="lg:col-span-5">
            {hasDrop && (
              <Badge tone="soft" className="mb-4">
                Reduced from {formatPrice(vehicle.previous_price!)}
              </Badge>
            )}

            <h1 className="font-display text-display-md text-maroon-900">{title}</h1>
            {vehicle.trim_level && (
              <p className="mt-1 text-lg text-muted">{vehicle.trim_level}</p>
            )}

            <p className="tnum mt-6 font-display text-4xl text-maroon-900">
              {formatPrice(vehicle.price)}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                label(vehicle.body_type),
                label(vehicle.transmission),
                label(vehicle.drivetrain),
                label(vehicle.fuel_type),
              ].map((chip) => (
                <li key={chip}>
                  <Badge tone="soft">{chip}</Badge>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <LeadFormModal
                leadType="vehicle_inquiry"
                sourcePage={`/inventory/${vehicle.slug}`}
                vehicleId={vehicle.id}
                vehicleTitle={fullTitle}
                submitLabel="Send inquiry"
                trigger={<Button size="lg" className="w-full">Ask about this car</Button>}
              />
              <ButtonLink
                href={`tel:${SITE.phone.tel}`}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Call {SITE.phone.display}
              </ButtonLink>
            </div>

            {vehicle.description && (
              <p className="mt-8 leading-relaxed text-muted">{vehicle.description}</p>
            )}
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl text-maroon-900">Specifications</h2>
            <div className="mt-6">
              <VehicleSpecs vehicle={vehicle} />
            </div>

            {vehicle.features.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-2xl text-maroon-900">Features</h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {vehicle.features.map((f) => (
                    <li key={f}>
                      <Badge tone="soft">{f}</Badge>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-10 text-xs leading-relaxed text-muted">
              {SITE.legal.inventoryDisclaimer}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <PaymentCalculator
                price={vehicle.price}
                ctaSlot={
                  <LeadFormModal
                    leadType="financing"
                    sourcePage={`/inventory/${vehicle.slug}`}
                    vehicleId={vehicle.id}
                    trigger={<Button className="w-full">Get pre-qualified</Button>}
                  />
                }
              />
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-20 border-t border-maroon-100 pt-16">
            <h2 className="font-display text-2xl text-maroon-900">Similar cars on the lot</h2>
            <div className="mt-8">
              <VehicleGrid vehicles={similar} />
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
