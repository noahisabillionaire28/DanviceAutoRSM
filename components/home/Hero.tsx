'use client';

import { useEffect, useRef } from 'react';
import { SITE } from '@/lib/site';
import { formatPrice } from '@/lib/format';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

/**
 * Full-bleed looping video behind the hero, in the style of lucrosai.com:
 * video fills the section, a dark scrim sits over it, and the copy is
 * left-aligned on top with a single primary CTA.
 *
 * The scrim is doing real work, not decoration. Text sits over moving footage
 * whose brightness we do not control, so the worst case is a blank-white
 * frame. At 75% maroon-950 the composite floor is ~8.6:1 against cream text
 * even then — asserted in scripts/checks.ts so lowering the opacity fails the
 * build rather than quietly making the headline unreadable.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // CSS cannot pause a video; the rest of the site honours reduced motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (query.matches) video.pause();
      else void video.play().catch(() => {});
    };

    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-maroon-900 text-cream-50">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Danvice Auto of RSM — a look around the lot"
      >
        <source src="/video/danvice-lot.mp4" type="video/mp4" />
      </video>

      {/* Flat scrim guarantees the contrast floor (asserted in scripts/checks.ts).
          The vertical gradient is symmetric rather than left-weighted, so it
          sits evenly behind centred copy, and deepens the top edge behind the
          transparent header and the bottom edge into the next section. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-maroon-950/75" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-maroon-950/70 via-transparent to-maroon-950/65"
      />

      <Container className="relative py-24 text-center md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-eyebrow uppercase text-cream-50/70">
            {SITE.address.city}
          </p>
          <div aria-hidden="true" className="mx-auto mt-4 h-px w-10 bg-brand-400" />

          <h1 className="mt-8 text-balance text-display-xl text-cream-50">
            Honest cars for real budgets.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream-50/85">
            Every car on our lot is inspected before it&rsquo;s listed and priced the
            same whether you haggle or not.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/inventory" variant="cream" size="lg">
              Browse the lot
            </ButtonLink>
            <ButtonLink
              href={`tel:${SITE.phone.tel}`}
              variant="outline"
              size="lg"
              className="border-cream-50/30 bg-transparent text-cream-50 hover:border-cream-50/50 hover:bg-cream-50/10"
            >
              Call {SITE.phone.display}
            </ButtonLink>
          </div>

          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-cream-50/70">
            <span className="tnum">
              {formatPrice(SITE.priceRange.min)}&ndash;{formatPrice(SITE.priceRange.max)}, every car
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cream-50/40" />
            <span>150-point inspection</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cream-50/40" />
            <span>Open seven days</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
