import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { CallButton } from '@/components/ui/CallButton';
import { breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb, withHome } from '@/components/ui/Breadcrumb';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Danvice Auto of RSM is a family-run used car lot and service centre in Rancho Santa Margarita, specialising in German and Japanese vehicles.',
};

const VALUES = [
  { t: 'One price, on the listing', b: 'We price cars where we think they should sell and leave them there. You are not penalized for being bad at haggling, and nobody who walks in gets a different number than the person before them.' },
  { t: 'We say no to cars', b: 'Most of what comes through auction does not make it onto this lot. If a car needs work we cannot stand behind, we pass rather than list it cheap and hope.' },
  { t: 'Inspections are welcome', b: 'Take any car to your own mechanic before you buy it. We have never refused, and if a shop finds something we missed we want to know.' },
];

// One array drives both the visible breadcrumb and its structured data.
const TRAIL = [{ name: 'About', href: '/about' }];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(withHome(TRAIL))} />
      <Breadcrumb trail={TRAIL} />

      <section className="border-b border-blue-100 bg-neutral-100">
        <Container className="py-14 text-center md:py-20">
          <p className="eyebrow eyebrow-rule [&::after]:mx-auto">About</p>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-display-lg text-blue-900">
            A small lot that sells cars it would put its own family in
          </h1>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="max-w-prose space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Danvice Auto sits on Santa Margarita Parkway, and most of the people
                who buy from us live within about fifteen minutes of it. That shapes
                how we do things more than any policy would.
              </p>
              <p>
                We specialize deliberately. Most of what we sell and almost all of
                what we service is German or Japanese — Mercedes-Benz, BMW and Audi
                on one side, Lexus, Toyota, Honda, Acura, Infiniti and Nissan on the
                other. Concentrating there means we know what a good one looks like
                and what a tired one is hiding.
              </p>
              <p>
                {SITE.owner} started Danvice in {SITE.founded}, and the aim has not
                changed since: {SITE.mission.charAt(0).toLowerCase() + SITE.mission.slice(1)}
              </p>
              <p>
                We are open six days a week, and the same people who sell you the
                car are the ones who service it afterwards.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card bg-blue-900 p-8 text-neutral-50">
              <h2 className="font-display text-card-title">Where we are</h2>
              <address className="mt-4 not-italic leading-relaxed text-neutral-50/75">
                {SITE.address.street}{SITE.address.unit ? <>&nbsp;{SITE.address.unit}</> : null}
                <br />
                {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
              </address>
              <a
                href={`tel:${SITE.phone.tel}`}
                className="tnum mt-5 inline-block font-display text-2xl transition-colors hover:text-orange-400"
              >
                {SITE.phone.display}
              </a>
              <p className="mt-6 text-sm leading-relaxed text-neutral-50/60">
                Serving {SITE.areaServed.join(', ')}.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-20 border-t border-blue-100 pt-16">
          <SectionHeading eyebrow="How we work" title="Three things we actually hold to" />
          <dl className="mt-12 grid gap-10 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.t}>
                <dt className="font-display text-card-title text-blue-900">{v.t}</dt>
                <dd className="mt-3 leading-relaxed text-muted">{v.b}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 flex flex-col gap-3 sm:flex-row">
            <CallButton showNumber />
            <ButtonLink href="/inventory" variant="link">See what we have</ButtonLink>
            <ButtonLink href="/contact" variant="link">Come visit</ButtonLink>
          </div>
        </section>
      </Container>
    </>
  );
}
