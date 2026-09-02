'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { SITE } from '@/lib/site';
import { CallButton } from '@/components/ui/CallButton';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { MobileNavDrawer } from './MobileNavDrawer';

/**
 * Scroll-aware header with two inverted states.
 *
 *   at the top of the homepage : maroon-900 bar (the hero's own red) + white
 *   scrolled / every other page: white bar + red text
 *
 * The top state uses the hero's exact background colour so the bar and the
 * hero read as one continuous field rather than a stripe laid over it. The
 * switch fires at 80px, well inside the hero's 92svh, so the two states never
 * disagree about what is behind them. Both pairings are contrast-checked in
 * scripts/checks.ts.
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
        // Over the hero the bar has no background of its own: the hero's veil
        // supplies the red and runs on past it, so there is no edge where two
        // slightly different reds can meet. The border goes too — it was
        // drawing a literal line across the seam.
        transparent
          ? 'bg-transparent'
          : 'border-b border-maroon-100/80 bg-white',
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
                      ? 'text-white/85 hover:bg-white/10 hover:text-white'
                      : 'text-brand-600 hover:bg-brand-500/10 hover:text-brand-700',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* One CTA, and it carries the number — a separate bare phone link beside
            a Call button would be two affordances for the same action. */}
        <div className="hidden items-center md:flex">
          <CallButton showNumber size="sm" />
        </div>

        <MobileNavDrawer tone={transparent ? 'cream' : 'brand'} />
      </Container>
    </header>
  );
}
