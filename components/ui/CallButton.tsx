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
 * The numbers come from lib/site.ts, the single source of truth for them.
 */
export function CallButton({
  full,
  showNumber,
  size = 'lg',
  variant = 'primary',
  line = 'sales',
  className,
}: {
  /** Full-width — the mobile bar and the vehicle detail column. */
  full?: boolean;
  /** Spell the number out instead of "Call now", where there is room for it. */
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** 'onDark' for the two places the CTA sits on a dark ground: the hero, and
   *  the header while it is transparent over the hero. Everywhere else the CTA
   *  is orange, so it contrasts the light page rather than blending into it. */
  variant?: 'primary' | 'onDark';
  /**
   * Which department the call reaches. Sales everywhere except the service
   * page, where sending a repair customer to the sales desk wastes two
   * people's time — Danvice runs the two on separate lines.
   *
   * This does not break the one-CTA rule: that rule is about one *component*,
   * so the label, glyph and tel: href still have a single definition and
   * cannot drift. It is the destination that varies, not the button.
   */
  line?: 'sales' | 'service';
  className?: string;
}) {
  const number = line === 'service' ? SITE.servicePhone : SITE.phone;

  return (
    <ButtonLink
      href={`tel:${number.tel}`}
      size={size}
      variant={variant}
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
      {showNumber ? `Call ${number.display}` : 'Call now'}
    </ButtonLink>
  );
}
