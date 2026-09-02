'use client';

import { useEffect, useRef } from 'react';
import { SITE } from '@/lib/site';
import { formatPrice } from '@/lib/format';
import { CallButton } from '@/components/ui/CallButton';
import { Container } from '@/components/ui/Container';

/**
 * Full-bleed looping video behind the hero: the footage runs from the very top
 * of the page, up behind a transparent header, with centred copy and a single
 * CTA over it.
 *
 * The scrim is doing real work, not decoration. Text sits over moving footage
 * whose brightness we do not control, so the worst case is a blank-white
 * frame. At 80% maroon-900 the composite floor is 10.18:1 against white text
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
    // The negative top margin pulls the hero up under the transparent header —
    // h-16 mobile, md:h-20 desktop — so the footage runs behind the nav rather
    // than starting beneath it. The Container adds the same amount back as top
    // padding so the copy stays optically centred.
    //
    // min-h-svh, not a fraction of it: because the hero starts at the very top
    // of the viewport, anything less leaves the next section's cream ground
    // showing as a band across the fold. svh measures against mobile browser
    // chrome at its largest, so it still fills the screen with the URL bar up.
    <section className="relative isolate -mt-16 flex min-h-svh items-center overflow-hidden bg-maroon-900 text-white md:-mt-20">
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
          It is maroon-900 rather than maroon-950: the near-black 950 desaturated
          the footage to grey-brown, which is what stopped it matching the brand
          red above it. 900 tints the video red instead, and at 80% the worst
          case — a blank white frame — still gives white copy 10.18:1. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-maroon-900/80" />

      {/* Supplies the colour behind the now-transparent header and fades it into
          the footage, so the bar and the video are one field with no seam. */}
      <div aria-hidden="true" className="hero-veil absolute inset-x-0 top-0 -z-10 h-full" />
      <div aria-hidden="true" className="hero-foot absolute inset-0 -z-10" />

      <Container className="relative pb-24 pt-40 text-center md:pb-28 md:pt-48">
        <div className="mx-auto max-w-3xl">
          <p className="text-eyebrow uppercase text-white/70">
            {SITE.address.city}
          </p>
          <div aria-hidden="true" className="mx-auto mt-4 h-px w-10 bg-brand-400" />

          <h1 className="mt-8 text-balance text-display-xl text-white">
            Honest cars for real budgets.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Every car on our lot is inspected before it&rsquo;s listed and priced the
            same whether you haggle or not.
          </p>

          {/* One action, not two competing ones. */}
          <div className="mt-10 flex justify-center">
            <CallButton showNumber />
          </div>

          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white/70">
            <span className="tnum">
              {formatPrice(SITE.priceRange.min)}&ndash;{formatPrice(SITE.priceRange.max)}, every car
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/40" />
            <span>150-point inspection</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/40" />
            <span>Open seven days</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
