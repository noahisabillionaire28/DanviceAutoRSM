import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'cream' | 'maroon' | 'outline' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 ease-brand disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const variants: Record<Variant, string> = {
  // brand red is reserved for CTAs — see CLAUDE.md.
  primary:
    'rounded-md bg-brand-500 text-brand-ink shadow-xs hover:bg-brand-400 hover:shadow-card active:bg-brand-600',
  // For a CTA sitting ON a deep red section. Red-on-red only reaches 2.86:1
  // against maroon-900, so dark sections invert to cream — the same
  // relationship the badge itself uses. Enforced by scripts/checks.ts.
  cream:
    'rounded-md bg-cream-50 text-maroon-900 shadow-xs hover:bg-cream-100 hover:shadow-card active:bg-cream-200',
  maroon:
    'rounded-md bg-maroon-900 text-cream-50 shadow-xs hover:bg-maroon-800 hover:shadow-card active:bg-maroon-950',
  outline:
    'rounded-md border border-maroon-200 bg-surface text-maroon-900 hover:border-maroon-300 hover:bg-cream-100',
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
