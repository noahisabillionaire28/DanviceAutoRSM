import { SITE } from '@/lib/site';
import { cn } from '@/lib/cn';
import { ButtonLink } from './Button';

/**
 * The site's only call to action.
 *
 * A convention drifts; a component cannot. Every CTA on every page renders this
 * one component, so the label, the phone glyph, the tel: href and the styling
 * have a single definition and cannot fall out of step with each other. That is
 * the whole point — "one consistent CTA" enforced structurally rather than by
 * remembering to type the same thing everywhere. scripts/checks.ts asserts no
 * hand-rolled tel: button exists alongside it.
 *
 * The number comes from lib/site.ts, the single source of truth for it.
 */
export function CallButton({
  full,
  showNumber,
  size = 'lg',
  className,
}: {
  /** Full-width — the mobile bar and the vehicle detail column. */
  full?: boolean;
  /** Spell the number out instead of "Call now", where there is room for it. */
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <ButtonLink
      href={`tel:${SITE.phone.tel}`}
      size={size}
      className={cn(full && 'w-full', showNumber && 'tnum', className)}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M5.5 1.5 7 4.5 5.5 6c.7 1.6 2.9 3.8 4.5 4.5L11.5 9l3 1.5v3c0 .6-.4 1-1 1C7 14.5 1.5 9 1.5 2.5c0-.6.4-1 1-1h3Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      {showNumber ? `Call ${SITE.phone.display}` : 'Call now'}
    </ButtonLink>
  );
}
