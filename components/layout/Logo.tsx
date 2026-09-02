import { cn } from '@/lib/cn';

/**
 * The Danvice Auto mark and wordmark.
 *
 * The mark is inlined rather than served from /brand as a file, for one reason
 * that matters: the D has to invert with its ground. It is the logo blue on the
 * white header and white over the hero video, and an <img> cannot inherit a
 * colour from its parent. Inlining also drops a request for ~500 bytes.
 *
 * The orange sweep is fixed in both tones — it is the accent, and it reads
 * against white and against navy alike, so it does not need to change.
 */
export function Logo({
  className,
  tone = 'dark',
  showWordmark = true,
}: {
  className?: string;
  /** 'dark' = dark label on a light ground; 'light' = light label on a dark one. */
  tone?: 'dark' | 'light';
  showWordmark?: boolean;
}) {
  const light = tone === 'light';

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <svg
        viewBox="0 0 120 96"
        role="img"
        aria-label="Danvice Auto"
        className="h-11 w-auto shrink-0 md:h-12"
      >
        {/* The D, drawn as an outline with an even-odd counter so it stays a
            solid shape at 16px instead of collapsing into a blob. */}
        <path
          d="M20 12 H58 C 86 12 105 30 105 47 C 105 64 86 82 58 82 H20 Z
             M41 31 V63 H57 C 70 63 79 56 79 47 C 79 38 70 31 57 31 Z"
          fillRule="evenodd"
          className={light ? 'fill-white' : 'fill-blue-500'}
        />
        {/* Motion sweep, running past the D on both sides. */}
        <path
          d="M4 74 C 34 89 78 85 115 61"
          fill="none"
          strokeWidth="9.5"
          strokeLinecap="round"
          className="stroke-orange-500"
        />
      </svg>

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-[1.0625rem] font-semibold tracking-tight',
              light ? 'text-neutral-50' : 'text-blue-900',
            )}
          >
            Danvice Auto
          </span>
          <span
            className={cn(
              'mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em]',
              light ? 'text-neutral-50/70' : 'text-muted',
            )}
          >
            of RSM
          </span>
        </span>
      )}
    </span>
  );
}
