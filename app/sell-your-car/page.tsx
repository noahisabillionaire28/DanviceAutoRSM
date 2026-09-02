import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LeadForm } from '@/components/leads/LeadForm';
import { breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb, withHome } from '@/components/ui/Breadcrumb';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sell your car',
  description:
    'Sell your car to Danvice Auto of RSM. Tell us about your vehicle and we will come back with a real offer — no obligation, no trade-in required.',
};

const POINTS = [
  { t: 'You do not have to buy anything', b: 'Plenty of people sell us a car and walk. There is no trade-in requirement and no pressure to look at the lot.' },
  { t: 'We buy cars with miles on them', b: 'High mileage, cosmetic damage, or an outstanding loan are all normal. We buy the cars other places pass on.' },
  { t: 'A real number, not a range', b: 'We will not quote you a wide bracket and negotiate down when you arrive. The number we give you is the number.' },
  { t: 'Paid the same day', b: 'If we agree on a price, we handle the DMV paperwork and you leave with payment in hand.' },
];

// One array drives both the visible breadcrumb and its structured data.
const TRAIL = [{ name: 'Sell Your Car', href: '/sell-your-car' }];

export default function SellYourCarPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(withHome(TRAIL))} />
      <Breadcrumb trail={TRAIL} />

      <section className="border-b border-maroon-100 bg-cream-100">
        <Container className="py-14 text-center md:py-20">
          <p className="eyebrow eyebrow-rule [&::after]:mx-auto">Sell your car</p>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-display-lg text-maroon-900">
            We will make you an offer, even if you are not buying
          </h1>
          <p className="mx-auto mt-4 max-w-prose text-lede text-muted">
            Tell us what you have. We will look it up, check what it is actually
            worth in South County right now, and come back with a number.
          </p>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Why us" title="How this works" />
            <dl className="mt-10 space-y-8">
              {POINTS.map((p) => (
                <div key={p.t}>
                  <dt className="font-display text-lg text-maroon-900">{p.t}</dt>
                  <dd className="mt-2 leading-relaxed text-muted">{p.b}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl bg-surface p-6 shadow-card ring-1 ring-maroon-100/70 md:p-8">
              <h2 className="font-display text-2xl text-maroon-900">Tell us about your car</h2>
              <p className="mt-2 text-muted">
                The more you tell us, the closer our first number will be.
              </p>
              <div className="mt-8">
                <LeadForm
                  leadType="sell_your_car"
                  sourcePage="/sell-your-car"
                  submitLabel="Get my offer"
                  messagePlaceholder="Anything we should know? Service history, damage, or an outstanding loan."
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
