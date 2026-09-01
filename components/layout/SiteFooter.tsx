import Link from 'next/link';
import { SITE, formattedAddress, mapsUrl } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';

function formatHour(t: string) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, '0')}${period}`;
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-900 text-bone-50">
      {/* pb-bar clears the fixed mobile Call/Browse bar so it never covers the footer. */}
      <Container className="py-16 pb-[calc(4.5rem+2rem)] md:py-20 md:pb-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Logo tone="bone" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-50/65">
              {SITE.tagline}
            </p>
            <a
              href={`tel:${SITE.phone.tel}`}
              className="tnum mt-6 inline-block font-display text-2xl text-bone-50 transition-colors hover:text-gold-400"
            >
              {SITE.phone.display}
            </a>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-bone-50/45">
              Visit us
            </h2>
            <address className="mt-4 not-italic text-sm leading-relaxed text-bone-50/75">
              {SITE.address.street} {SITE.address.unit}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-bone-50/75 underline decoration-bone-50/25 underline-offset-4 transition-colors hover:text-bone-50 hover:decoration-gold-400"
            >
              Get directions
            </a>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-bone-50/45">
              Hours
            </h2>
            <dl className="mt-4 space-y-1.5 text-sm text-bone-50/75">
              {SITE.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <dt>{h.day.slice(0, 3)}</dt>
                  <dd className="tnum">
                    {formatHour(h.open)} – {formatHour(h.close)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-bone-50/45">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-bone-50/75 transition-colors hover:text-bone-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-bone-50/10 pt-8 text-xs leading-relaxed text-bone-50/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="max-w-xl md:text-right">{SITE.legal.photoCredit}</p>
        </div>
      </Container>
    </footer>
  );
}
