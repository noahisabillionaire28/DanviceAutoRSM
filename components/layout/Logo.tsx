import Image from 'next/image';
import { cn } from '@/lib/cn';
import { SITE } from '@/lib/site';

/**
 * The Danvice Auto logo: the two swooshes over the DANVICE AUTO wordmark.
 *
 * It is a complete lockup — mark and wordmark in one file — so there is no
 * separate HTML wordmark beside it any more, and no light/dark variant: the
 * blue and orange both hold up on white and on the navy hero, so the same
 * artwork is used everywhere rather than a recoloured copy that would drift.
 *
 * Served unoptimized: it is a single SVG, so the image optimizer would cost a
 * round trip and gain nothing, and optimizing SVG needs dangerouslyAllowSVG.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/danvice-logo.svg"
      alt={SITE.name}
      width={1830}
      height={600}
      unoptimized
      priority
      // The lockup is ~3:1, so height drives the size. h-12/h-16 keeps the
      // wordmark legible inside the h-16/h-20 header without crowding it.
      className={cn('h-12 w-auto md:h-16', className)}
    />
  );
}
