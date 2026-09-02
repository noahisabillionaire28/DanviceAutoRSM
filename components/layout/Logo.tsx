import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * The Danvice badge as the mark, with the wordmark beside it.
 *
 * The badge is served unoptimized: it is a 3KB SVG, so running it through the
 * image optimizer would cost a round trip and gain nothing, and optimizing SVG
 * would require enabling dangerouslyAllowSVG.
 */
export function Logo({
  className,
  tone = 'maroon',
  showWordmark = true,
}: {
  className?: string;
  tone?: 'maroon' | 'cream';
  showWordmark?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src="/brand/danvice-badge.svg"
        alt="Danvice"
        width={400}
        height={320}
        unoptimized
        priority
        className="h-11 w-auto md:h-12"
      />

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-[1.0625rem] font-semibold tracking-tight',
              tone === 'maroon' ? 'text-maroon-900' : 'text-cream-50',
            )}
          >
            Danvice Auto
          </span>
          <span
            className={cn(
              'mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em]',
              tone === 'maroon' ? 'text-muted' : 'text-cream-50/60',
            )}
          >
            of RSM
          </span>
        </span>
      )}
    </span>
  );
}
