import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'onDark' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 ease-brand disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const variants: Record<Variant, string> = {
  // The CTA inverts with its background rather than having one fixed look: a
  // white button on the white header or the light page nearly vanishes, and the
  // 1px hairline it relied on was all that separated them.
  //
  // Light grounds get the logo orange with a near-black label. White on
  // orange-500 is only 2.74:1 — the label has to be dark, which is what the
  // logo itself does. The border is load-bearing here and must not be removed:
  // the fill is 2.58:1 against the page, under the 3:1 a control edge needs, so
  // orange-600 at 3.60:1 is the only thing giving the button a boundary.
  //
  // It brightens on hover instead of darkening, which is backwards on purpose.
  // Darkening drops the label to 4.07:1 on orange-600 and 2.78:1 on orange-700,
  // both failing AA. Going lighter keeps it legible: 6.53 at rest, 7.88 on
  // hover, 4.68 on the brief active state. Do not "fix" this to darken.
  primary:
    'rounded-md border border-orange-600 bg-orange-500 text-orange-ink shadow-xs hover:bg-orange-400 hover:shadow-card active:bg-orange-600',
  // Dark grounds keep the white button. Used in exactly two places — the hero,
  // and the header while it is transparent over the hero. The border IS still
  // load-bearing here too: the footage behind it can go bright, and the border
  // is what guarantees the button an edge on a white frame.
  onDark:
    'rounded-md border border-blue-400 bg-white text-blue-900 shadow-xs hover:bg-neutral-50 hover:shadow-card active:bg-neutral-100',
  ghost: 'rounded-md text-blue-700 hover:bg-blue-50 hover:text-blue-900',
  link: 'text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-orange-500',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-7 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: CommonProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      className={cn(base, variants[variant], variant !== 'link' && sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  href,
  ...props
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  const classes = cn(base, variants[variant], variant !== 'link' && sizes[size], className);
  const external = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');

  if (external) return <a href={href} className={classes} {...props} />;
  return <Link href={href} className={classes} {...props} />;
}
