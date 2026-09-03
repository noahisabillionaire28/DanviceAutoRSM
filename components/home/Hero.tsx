'use client';

import { useEffect, useRef } from 'react';
import { SITE } from '@/lib/site';
import { CallButton } from '@/components/ui/CallButton';
import { Container } from '@/components/ui/Container';

/**
 * Full-bleed looping video behind the hero: the footage runs from the very top
 * of the page, up behind a transparent header, with centred copy and a single
 * CTA over it.
 *
 * The scrim is doing real work, not decoration. Text sits over moving footage
 * whose brightness we do not control, so the worst case is a blank-white
 * frame. At 80% blue-900 the composite floor is 10.18:1 against white text
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
    // lvh, and specifically NOT svh. svh is by definition the *smallest*
    // viewport — the height with browser chrome at its largest. Any state where
    // the chrome is smaller than that, or floats over the page instead of
    // insetting it (iOS Safari's toolbar does exactly this), leaves the visible
    // area taller than 100svh, and the hero stops short. What shows in the
    // shortfall is the next section, which paints no background of its own, so
    // the page ground reads as a white band across the bottom of the phone.
    //
    // lvh is the largest viewport, so the navy covers the screen in every
    // chrome state. Not dvh: that tracks the current viewport, which would
    // resize this in-flow section as the chrome collapses mid-scroll. The
    // MobileNavDrawer can use dvh because it is fixed; a hero cannot.
    //
    // On desktop there is no dynamic chrome, so lvh == svh == dvh and this is
    // a no-op. Asserted in scripts/checks.ts.
    <section className="relative isolate -mt-16 flex min-h-lvh items-center overflow-hidden bg-blue-900 text-white md:-mt-20">
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
          It is blue-900 rather than blue-950: the near-black 950 desaturated
          the footage to grey-brown, which is what stopped it matching the brand
          red above it. 900 tints the video red instead, and at 80% the worst
          case — a blank white frame — still gives white copy 10.18:1. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blue-900/80" />

      {/* Supplies the colour behind the now-transparent header and fades it into
          the footage, so the bar and the video are one field with no seam. */}
      <div aria-hidden="true" className="hero-veil absolute inset-x-0 top-0 -z-10 h-full" />
      <div aria-hidden="true" className="hero-foot absolute inset-0 -z-10" />

      {/* The bottom padding carries a correction as well as spacing. The box is
          now lvh tall while the visible area at the top of the page is only
          svh, so centred copy would sit half the chrome height too low — on top
          of the 64px it is already biased down by pt-40 vs pb-24 to clear the
          header. 100lvh - 100svh IS the chrome height, so adding it back as
          bottom padding recentres the copy in the part you can actually see,
          while the navy still spans the full lvh. Resolves to 6rem + 0 on
          desktop, where the two units are equal. */}
      <Container className="relative pb-[calc(6rem+100lvh-100svh)] pt-40 text-center md:pb-28 md:pt-48">
        <div className="mx-auto max-w-3xl">
          {/* No eyebrow and no rule above the headline: the city now lives in
              the line below, where it still does its job for local search
              without stacking two small elements over the headline. */}
          <h1 className="text-balance text-display-xl text-white">
            {SITE.heroHeadline}
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/85">
            Sold and serviced in {SITE.address.city}.
          </p>

          {/* One action, not two competing ones. Sized md on phones — still a
              44px touch target, but the lg button was visually heavy at that
              width — and lg from md: up, where there is room for it. */}
          <div className="mt-10 flex justify-center">
            <CallButton showNumber size="md" variant="onDark" className="md:h-13 md:px-7 md:text-base" />
          </div>
        </div>
      </Container>
    </section>
  );
}
