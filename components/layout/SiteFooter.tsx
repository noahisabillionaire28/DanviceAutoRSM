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
    <footer className="mt-auto bg-blue-900 text-neutral-50">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Link href="/" aria-label={`${SITE.name} — home`} className="inline-block">
              <Logo tone="light" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-50/65">
              {SITE.tagline}
            </p>
            <a
              href={`tel:${SITE.phone.tel}`}
              className="tnum mt-6 inline-block font-display text-2xl text-neutral-50 transition-colors hover:text-orange-400"
            >
              {SITE.phone.display}
            </a>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-50/45">
              Visit us
            </h2>
            <address className="mt-4 not-italic text-sm leading-relaxed text-neutral-50/75">
              {SITE.address.street}{SITE.address.unit ? <>&nbsp;{SITE.address.unit}</> : null}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-neutral-50/75 underline decoration-neutral-50/25 underline-offset-4 transition-colors hover:text-neutral-50 hover:decoration-orange-400"
            >
              Get directions
            </a>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-50/45">
              Hours
            </h2>
            <dl className="mt-4 space-y-1.5 text-sm text-neutral-50/75">
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
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-50/45">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-neutral-50/75 transition-colors hover:text-neutral-50"
                >
                  Home
                </Link>
              </li>
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-50/75 transition-colors hover:text-neutral-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-neutral-50/10 pt-8 text-[0.8125rem] leading-relaxed text-neutral-50/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="max-w-xl md:text-right">{SITE.legal.photoCredit}</p>
        </div>
      </Container>
    </footer>
  );
}
