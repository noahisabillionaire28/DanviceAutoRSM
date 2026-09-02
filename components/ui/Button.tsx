import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 ease-brand disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const variants: Record<Variant, string> = {
  // The site has exactly one button appearance: white fill, maroon label.
  //
  // The border is load-bearing, not decoration. White on the cream page ground
  // is 1.08:1 — the control would have no perceivable edge at all. maroon-400
  // is the lightest step clearing WCAG's 3:1 for a control boundary (3.79 on
  // cream-50, 3.52 on cream-100). The same white button reads 17.84:1 against
  // the deep-red sections, so one style serves light and dark alike, which is
  // what lets a single CTA be literally consistent. Asserted in scripts/checks.ts.
  primary:
    'rounded-md border border-maroon-400 bg-white text-maroon-900 shadow-xs hover:bg-cream-50 hover:shadow-card active:bg-cream-100',
  ghost: 'rounded-md text-maroon-700 hover:bg-maroon-50 hover:text-maroon-900',
  link: 'text-maroon-900 underline decoration-maroon-300 underline-offset-4 hover:decoration-brand-500',
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
