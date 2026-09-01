import { Suspense } from 'react';
import Link from 'next/link';
import { SITE, formattedAddress, mapsUrl } from '@/lib/site';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Hero } from '@/components/home/Hero';
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles';
import { VehicleGridSkeleton } from '@/components/vehicles/VehicleCardSkeleton';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { Button } from '@/components/ui/Button';

export const revalidate = 300;

const STEPS = [
  {
    n: '01',
    title: 'Find something you like',
    body: 'Browse the whole lot online with real prices. No “call for price”, no bait listings that sold three weeks ago.',
  },
  {
    n: '02',
    title: 'Come drive it',
    body: 'Take it out on the 241, park it, sit in it. Bring a mechanic if you want — we have never said no to an inspection.',
  },
  {
    n: '03',
    title: 'Sort the paperwork',
    body: 'We handle financing applications in-house, including first-time buyers and thin credit files. Most approvals come back same day.',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Trust strip — typographic, no stock photography. */}
      <section className="border-b border-navy-100 bg-bone-100">
        <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4 md:py-14">
          {[
            { t: 'One price, plainly listed', b: 'The number on the listing is the number you pay, minus tax and fees.' },
            { t: 'Inspected before listing', b: 'If it needs work we fix it or we don’t sell it.' },
            { t: 'Financing for thin credit', b: 'First job, first car, no credit history — we do these every week.' },
            { t: 'Family run, local', b: 'We live here too. You will see us at the same Trader Joe’s.' },
          ].map((item) => (
            <div key={item.t}>
              <h3 className="font-display text-lg text-navy-900">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.b}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="On the lot"
            title="A few we think are worth a look"
            lede="Hand-picked from current inventory — the ones we would put a friend in."
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

      <section className="border-y border-navy-100 bg-bone-100 py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Buying a car should be boring"
            lede="Three steps, no theatre, no four-hour Saturday."
          />
          <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="tnum font-display text-4xl text-gold-600/40">{s.n}</span>
                <h3 className="mt-4 font-display text-xl text-navy-900">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-12 rounded-2xl bg-navy-900 p-8 text-bone-50 md:grid-cols-2 md:gap-16 md:p-14">
            <div>
              <p className="text-eyebrow uppercase text-gold-400">Financing</p>
              <div aria-hidden="true" className="mt-3 h-px w-10 bg-gold-500" />
              <h2 className="mt-6 text-display-md text-bone-50">
                Turned down somewhere else?
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-bone-50/70">
                We work with lenders who actually look at your situation rather than
                just a number. First-time buyers, students on part-time income, and
                rebuilt credit are all normal here.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LeadFormModal
                  leadType="financing"
                  sourcePage="/"
                  trigger={<Button size="lg">Get pre-qualified</Button>}
                />
                <ButtonLink
                  href="/financing"
                  variant="outline"
                  size="lg"
                  className="border-bone-50/25 bg-transparent text-bone-50 hover:border-bone-50/40 hover:bg-bone-50/5"
                >
                  How financing works
                </ButtonLink>
              </div>
            </div>

            <ul className="space-y-5">
              {[
                'Soft credit check to start — no impact on your score',
                'Most decisions come back the same day',
                'Co-signers welcome, and often not required',
                'We explain the whole payment, not just the monthly',
              ].map((point) => (
                <li key={point} className="flex gap-3.5 text-bone-50/85">
                  <svg
                    className="mt-1 h-4 w-4 shrink-0 text-gold-400"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2 8.5 6 12.5 14 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-navy-100 bg-bone-100 py-20 md:py-28">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <SectionHeading eyebrow="Find us" title="Come by the lot" />
              <address className="mt-8 not-italic text-lg leading-relaxed text-navy-800">
                {SITE.address.street} {SITE.address.unit}
                <br />
                {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
              </address>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={mapsUrl()} variant="navy">
                  Get directions
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Contact us
                </ButtonLink>
              </div>
              <p className="mt-8 text-sm text-muted">
                Serving {SITE.areaServed.slice(0, 4).join(', ')}, and the rest of
                South Orange County.
              </p>
            </div>

            <div className="rounded-xl bg-surface p-8 shadow-card ring-1 ring-navy-100/70">
              <h3 className="font-display text-xl text-navy-900">Opening hours</h3>
              <dl className="mt-6 divide-y divide-navy-100">
                {SITE.hours.map((h) => (
                  <div key={h.day} className="flex items-center justify-between py-3">
                    <dt className="text-navy-700">{h.day}</dt>
                    <dd className="tnum text-navy-900">
                      {h.open} – {h.close}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm text-muted">
                Prefer to talk?{' '}
                <Link
                  href={`tel:${SITE.phone.tel}`}
                  className="text-navy-900 underline decoration-navy-300 underline-offset-4 hover:decoration-gold-500"
                >
                  {SITE.phone.display}
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
