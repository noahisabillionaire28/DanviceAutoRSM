import Link from 'next/link';
import { SITE } from '@/lib/site';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { MobileNavDrawer } from './MobileNavDrawer';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-maroon-100/80 bg-cream-50/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" aria-label={`${SITE.name} — home`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center rounded-md px-3.5 py-2.5 text-[0.9375rem] text-maroon-700 transition-colors duration-200 hover:bg-maroon-50 hover:text-maroon-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${SITE.phone.tel}`}
            className="tnum inline-flex min-h-[44px] items-center px-1 text-[0.9375rem] font-medium text-maroon-900 transition-colors hover:text-maroon-600"
          >
            {SITE.phone.display}
          </a>
          <ButtonLink href="/inventory" size="sm">
            Browse inventory
          </ButtonLink>
        </div>

        <MobileNavDrawer />
      </Container>
    </header>
  );
}
