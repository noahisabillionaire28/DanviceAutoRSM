import type { Metadata } from 'next';
import { SITE, formattedAddress, mapsUrl } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { LeadForm } from '@/components/leads/LeadForm';
import { breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb, withHome } from '@/components/ui/Breadcrumb';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Visit ${SITE.name} at ${formattedAddress()} or call ${SITE.phone.display}. Open seven days a week.`,
};

function formatHour(t: string) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, '0')}${period}`;
}

// One array drives both the visible breadcrumb and its structured data.
const TRAIL = [{ name: 'Contact', href: '/contact' }];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(withHome(TRAIL))} />
      <Breadcrumb trail={TRAIL} />

      <section className="border-b border-maroon-100 bg-cream-100">
        <Container className="py-14 text-center md:py-20">
          <p className="eyebrow eyebrow-rule [&::after]:mx-auto">Contact</p>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-display-lg text-maroon-900">Come by, or just call</h1>
          <p className="mx-auto mt-4 max-w-prose text-lede text-muted">
            We are on Santa Margarita Parkway, open seven days a week. No appointment
            needed to look at anything on the lot.
          </p>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl text-maroon-900">Visit the lot</h2>
            <address className="mt-5 not-italic text-lg leading-relaxed text-maroon-800">
              {SITE.address.street}{SITE.address.unit ? <>&nbsp;{SITE.address.unit}</> : null}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>

            <a
              href={`tel:${SITE.phone.tel}`}
              className="tnum mt-6 inline-block font-display text-3xl text-maroon-900 transition-colors hover:text-maroon-600"
            >
              {SITE.phone.display}
            </a>

            <div className="mt-6">
              <ButtonLink href={mapsUrl()} variant="maroon">Get directions</ButtonLink>
            </div>

            {/* A walk-in lot needs a map, not just an address. Uses the
                keyless Maps embed so there is no API key to leak or expire. */}
            <div className="mt-8 overflow-hidden rounded-xl shadow-card ring-1 ring-maroon-100/70">
              <iframe
                title={`Map to ${SITE.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${SITE.address.street} ${SITE.address.unit}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`,
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[300px] w-full border-0"
              />
            </div>

            <h2 className="mt-12 font-display text-2xl text-maroon-900">Hours</h2>
            <dl className="mt-5 divide-y divide-maroon-100 border-y border-maroon-100">
              {SITE.hours.map((h) => (
                <div key={h.day} className="flex items-center justify-between py-3">
                  <dt className="text-maroon-700">{h.day}</dt>
                  <dd className="tnum text-maroon-900">
                    {formatHour(h.open)} – {formatHour(h.close)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl bg-surface p-6 shadow-card ring-1 ring-maroon-100/70 md:p-8">
              <h2 className="font-display text-2xl text-maroon-900">Send us a message</h2>
              <p className="mt-2 text-muted">
                We answer these ourselves, usually within a business hour.
              </p>
              <div className="mt-8">
                <LeadForm
                  leadType="general"
                  sourcePage="/contact"
                  submitLabel="Send message"
                  messagePlaceholder="What can we help you with?"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
