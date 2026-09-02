'use client';

import { useEffect, useRef } from 'react';

/**
 * Looping ambient video of the lot.
 *
 * Structure mirrors the treatment used on mikesplazacleaners.com: a rounded,
 * ring-bordered card with a fixed aspect box, the video absolutely positioned
 * and object-cover inside it, a brand-coloured background showing through
 * until the first frame paints (which is why there is no poster image), and a
 * gradient wash from the brand colour along the bottom edge.
 *
 * autoPlay + muted + playsInline together are what actually make a video
 * autoplay on iOS; drop any one of them and it silently refuses. The source
 * has no audio track at all, so muted costs nothing.
 */
export function LotVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  // The rest of the site honours prefers-reduced-motion, so this should too —
  // CSS cannot stop a video, it takes a real pause() call.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (query.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {
          /* autoplay blocked by the browser; the first frame still shows */
        });
      }
    };

    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return (
    <div className="group relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-maroon-900 shadow-raised ring-1 ring-maroon-900/10 transition-[transform,box-shadow] duration-500 ease-brand hover:-translate-y-1 hover:shadow-modal motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Danvice Auto of RSM — a look around the lot"
      >
        <source src="/video/danvice-lot.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-900/45 via-transparent to-transparent"
      />
    </div>
  );
}
