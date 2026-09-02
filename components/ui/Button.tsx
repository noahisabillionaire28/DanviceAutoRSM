import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'onDark' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 ease-brand disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const variants: Record<Variant, string> = {
  // The CTA inverts with its background rather than having one fixed look: a
  // white button on the white header or the cream page nearly vanishes, and the
  // 1px hairline it relied on was all that separated them.
  //
  // Light grounds get the badge red. White on it is 6.23:1, and the fill reads
  // 6.23:1 against the white bar and 5.79:1 against the cream page, so the fill
  // carries its own edge — a border here would only muddy it.
  primary:
    'rounded-md bg-brand-500 text-white shadow-xs hover:bg-brand-600 hover:shadow-card active:bg-brand-700',
  // Dark grounds keep the white button. Used in exactly two places — the hero,
  // and the header while it is transparent over the hero. The border IS still
  // load-bearing here: the footage behind it can go bright, and the border is
  // what guarantees the button an edge on a white frame (4.08:1).
  onDark:
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
