'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
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
 *   at the top of the homepage : no background at all + white labels
 *   scrolled / every other page: white bar + red text
 *
 * The top state paints nothing. An opaque bar can only ever approximate the
 * scrimmed video beneath it, and the mismatch showed as a seam across the
 * fold; the hero's own .hero-veil supplies the red instead and runs on past
 * the bar, so there is no edge for two colours to disagree at. The switch
 * fires at 80px, well inside the hero's full viewport height, so the two
 * states never disagree about what is behind them. Both pairings are
 * contrast-checked in scripts/checks.ts.
 */
export function SiteHeader() {
  // useSelectedLayoutSegment, NOT usePathname. usePathname reads the ambient
  // request URL, and an ISR regeneration triggered by revalidateTag re-renders
  // this page inside the *triggering* request — so a POST to /api/revalidate
  // (the Supabase webhook the owner's inventory edits fire) baked a header
  // that thought it was on /api/revalidate and cached the wrong state onto the
  // homepage. The selected segment comes from the layout tree of the route
  // actually being rendered, so it is null on / no matter what asked for it.
  const segment = useSelectedLayoutSegment();
  const [scrolled, setScrolled] = useState(false);

  const overHero = segment === null;

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
          <CallButton showNumber size="sm" variant={transparent ? 'onDark' : 'primary'} />
        </div>

        <MobileNavDrawer tone={transparent ? 'cream' : 'brand'} />
      </Container>
    </header>
  );
}
