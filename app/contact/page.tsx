import type { Metadata } from 'next';
import { SITE, formattedAddress, mapsUrl } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { LeadForm } from '@/components/leads/LeadForm';

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

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-navy-100 bg-bone-100">
        <Container className="py-14 md:py-20">
          <p className="eyebrow eyebrow-rule">Contact</p>
          <h1 className="mt-5 text-display-lg text-navy-900">Come by, or just call</h1>
          <p className="mt-4 max-w-prose text-lede text-muted">
            We are on Santa Margarita Parkway, open seven days a week. No appointment
            needed to look at anything on the lot.
          </p>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl text-navy-900">Visit the lot</h2>
            <address className="mt-5 not-italic text-lg leading-relaxed text-navy-800">
              {SITE.address.street} {SITE.address.unit}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>

            <a
              href={`tel:${SITE.phone.tel}`}
              className="tnum mt-6 inline-block font-display text-3xl text-navy-900 transition-colors hover:text-navy-600"
            >
              {SITE.phone.display}
            </a>

            <div className="mt-6">
              <ButtonLink href={mapsUrl()} variant="navy">Get directions</ButtonLink>
            </div>

            <h2 className="mt-12 font-display text-2xl text-navy-900">Hours</h2>
            <dl className="mt-5 divide-y divide-navy-100 border-y border-navy-100">
              {SITE.hours.map((h) => (
                <div key={h.day} className="flex items-center justify-between py-3">
                  <dt className="text-navy-700">{h.day}</dt>
                  <dd className="tnum text-navy-900">
                    {formatHour(h.open)} – {formatHour(h.close)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl bg-surface p-6 shadow-card ring-1 ring-navy-100/70 md:p-8">
              <h2 className="font-display text-2xl text-navy-900">Send us a message</h2>
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
