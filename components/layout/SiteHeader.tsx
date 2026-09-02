'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { SITE } from '@/lib/site';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { MobileNavDrawer } from './MobileNavDrawer';

/**
 * Transparent over the homepage's video hero, solid everywhere else.
 *
 * It has to solidify on scroll rather than stay transparent: past the hero the
 * nav would sit over cream page background, where cream-on-cream links are
 * invisible. The switch happens well inside the hero's 92svh, so the two
 * states never disagree about what is behind them.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const overHero = pathname === '/';

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overHero]);

  const transparent = overHero && !scrolled;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-300 ease-brand',
        transparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-maroon-100/80 bg-cream-50/85 backdrop-blur-md',
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" aria-label={`${SITE.name} — home`} className="shrink-0">
          <Logo tone={transparent ? 'cream' : 'maroon'} />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex min-h-[44px] items-center rounded-md px-3.5 py-2.5 text-[0.9375rem] transition-colors duration-200',
                    transparent
                      ? 'text-cream-50/85 hover:bg-cream-50/10 hover:text-cream-50'
                      : 'text-maroon-700 hover:bg-maroon-50 hover:text-maroon-900',
                  )}
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
            className={cn(
              'tnum inline-flex min-h-[44px] items-center px-1 text-[0.9375rem] font-medium transition-colors',
              transparent
                ? 'text-cream-50 hover:text-cream-50/80'
                : 'text-maroon-900 hover:text-maroon-600',
            )}
          >
            {SITE.phone.display}
          </a>
          <ButtonLink
            href="/inventory"
            variant={transparent ? 'cream' : 'primary'}
            size="sm"
          >
            Browse inventory
          </ButtonLink>
        </div>

        <MobileNavDrawer tone={transparent ? 'cream' : 'maroon'} />
      </Container>
    </header>
  );
}
