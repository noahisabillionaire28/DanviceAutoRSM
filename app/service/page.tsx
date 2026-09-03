import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CallButton } from '@/components/ui/CallButton';
import { breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb, withHome } from '@/components/ui/Breadcrumb';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Service and repair',
  description: `Auto repair and diagnostics at ${SITE.name} in ${SITE.address.city}. German and Japanese specialists — Mercedes-Benz, BMW, Audi, Lexus, Toyota and more. Call ${SITE.servicePhone.display}.`,
};

/**
 * Everything on this page comes from the owner's brief: the specialism, the
 * marques, and the service line. Nothing about turnaround times, warranties,
 * loaner cars or pricing is claimed, because none of that was supplied and
 * this is a real business — an invented service promise is one a customer can
 * hold them to.
 */
const POINTS = [
  {
    t: 'German and Japanese specialists',
    b: 'Mercedes-Benz, BMW and Audi have their own systems and their own service intervals. So do Lexus, Toyota, Honda, Acura, Infiniti and Nissan. These are the cars we work on every day.',
  },
  {
    t: 'Repair and diagnostics',
    b: 'Bring us the warning light nobody else could pin down, or the routine service that keeps it from coming on. Both are the same department.',
  },
  {
    t: 'The shop that sold you the car',
    b: 'Most lots hand you the keys and you never see them again. We sell cars and we keep them running afterwards, in the same building.',
  },
];

const TRAIL = [{ name: 'Service', href: '/service' }];

export default function ServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(withHome(TRAIL))} />
      <Breadcrumb trail={TRAIL} />

      <section className="border-b border-blue-100 bg-neutral-100">
        <Container className="py-14 text-center md:py-20">
          <p className="eyebrow eyebrow-rule [&::after]:mx-auto">Service</p>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-display-lg text-blue-900">
            The dealership that services what it sells
          </h1>
          <p className="mx-auto mt-4 max-w-prose text-lede text-muted">
            Repair and diagnostics on German and Japanese cars, at the same
            address as the lot. Service runs on its own line —{' '}
            {SITE.servicePhone.display}.
          </p>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="What we do" title="Where we are strongest" />
            <dl className="mt-10 space-y-8">
              {POINTS.map((p) => (
                <div key={p.t}>
                  <dt className="font-display text-card-title text-blue-900">{p.t}</dt>
                  <dd className="mt-2 leading-relaxed text-muted">{p.b}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-card bg-blue-900 p-8 text-neutral-50 md:p-14">
              <h2 className="font-display text-subhead">Book it in</h2>
              <p className="mt-4 max-w-md leading-relaxed text-neutral-50/75">
                Service is a phone call — tell us the car and what it is doing,
                and we will tell you what it needs and when we can take it.
              </p>

              {/* line="service" so a repair customer reaches the service desk
                  rather than sales. Still the one CTA component site-wide. */}
              <div className="mt-8">
                <CallButton showNumber line="service" variant="onDark" />
              </div>

              <dl className="mt-10 space-y-3 border-t border-neutral-50/15 pt-8 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-50/60">Service line</dt>
                  <dd className="tnum">{SITE.servicePhone.display}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-50/60">Sales line</dt>
                  <dd className="tnum">{SITE.phone.display}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-50/60">Where</dt>
                  <dd className="text-right">
                    {SITE.address.street} {SITE.address.unit}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Container>

      <section className="border-t border-blue-100 bg-neutral-100">
        <Container className="py-16 md:py-20">
          <h2 className="font-display text-card-title text-blue-900">
            Marques we sell and service
          </h2>
          <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
            {SITE.brands.map((b) => (
              <li
                key={b}
                className="rounded-full bg-surface px-3.5 py-1.5 text-sm text-blue-800 ring-1 ring-blue-100"
              >
                {b}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
