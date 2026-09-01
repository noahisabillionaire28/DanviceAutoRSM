import { Suspense } from 'react';
import { ButtonLink, Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Hero } from '@/components/home/Hero';
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles';
import { VehicleGridSkeleton } from '@/components/vehicles/VehicleCardSkeleton';
import { LeadFormModal } from '@/components/leads/LeadFormModal';

export const revalidate = 300;

/**
 * Four sections, ordered by conversion value rather than by narrative.
 *
 * For a used-car lot the inventory IS the product, so it sits directly under
 * the hero instead of fourth. Two sections were removed rather than shortened,
 * because both duplicated content that already lives elsewhere: the
 * how-it-works steps repeat /financing, and the address and hours block
 * repeats the footer, which is on every page.
 */

const PROOF = [
  {
    t: 'One price, plainly listed',
    b: 'The number on the listing is the number you pay, minus tax and fees.',
  },
  {
    t: 'Financing for thin credit',
    b: 'First job, first car, no credit history — we do these every week.',
  },
  {
    t: 'Inspected before listing',
    b: 'If it needs work we fix it, or we don’t sell it.',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* The product. Highest-intent action on the page, so it comes first. */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="On the lot"
            title={<>Cars we&rsquo;d put a friend in</>}
            action={
              <ButtonLink href="/inventory" variant="outline">
                See all 12 cars
              </ButtonLink>
            }
          />
          <div className="mt-12">
            <Suspense fallback={<VehicleGridSkeleton count={3} />}>
              <FeaturedVehicles />
            </Suspense>
          </div>
        </Container>
      </section>

      {/* Compressed to a single quiet band — supporting evidence, not a headline act. */}
      <section className="border-y border-maroon-100 bg-cream-100">
        <Container className="grid gap-8 py-14 md:grid-cols-3 md:gap-12">
          {PROOF.map((item) => (
            <div key={item.t}>
              <h2 className="font-display text-lg text-maroon-900">{item.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.b}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* The second conversion path, reduced to one claim and one action. */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="rounded-2xl bg-maroon-900 px-8 py-14 text-center text-cream-50 md:px-14 md:py-20">
            <p className="text-eyebrow uppercase text-cream-50/60">Financing</p>
            <div aria-hidden="true" className="mx-auto mt-4 h-px w-10 bg-brand-400" />

            <h2 className="mx-auto mt-8 max-w-2xl text-display-md text-cream-50">
              Turned down somewhere else?
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream-50/75">
              We work with lenders who look at your situation rather than just a
              number. Starting takes three minutes and won&rsquo;t affect your
              credit score.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LeadFormModal
                leadType="financing"
                sourcePage="/"
                trigger={
                  <Button variant="cream" size="lg">
                    Get pre-qualified
                  </Button>
                }
              />
              <ButtonLink
                href="/financing"
                variant="link"
                className="text-cream-50/70 decoration-cream-50/30 hover:text-cream-50"
              >
                How financing works
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
