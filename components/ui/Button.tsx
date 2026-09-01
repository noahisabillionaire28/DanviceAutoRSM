import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'navy' | 'outline' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 ease-brand disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const variants: Record<Variant, string> = {
  // Gold is reserved for primary CTAs — see CLAUDE.md.
  primary:
    'rounded-md bg-gold-500 text-gold-ink shadow-xs hover:bg-gold-400 hover:shadow-card active:bg-gold-600',
  navy:
    'rounded-md bg-navy-900 text-bone-50 shadow-xs hover:bg-navy-800 hover:shadow-card active:bg-navy-950',
  outline:
    'rounded-md border border-navy-200 bg-surface text-navy-900 hover:border-navy-300 hover:bg-bone-100',
  ghost: 'rounded-md text-navy-700 hover:bg-navy-50 hover:text-navy-900',
  link: 'text-navy-900 underline decoration-navy-300 underline-offset-4 hover:decoration-gold-500',
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
