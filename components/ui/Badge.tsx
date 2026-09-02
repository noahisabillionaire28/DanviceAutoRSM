import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

// Navy, never gold: gold is reserved for CTAs.
const tones = {
  navy: 'bg-blue-900/90 text-neutral-50 backdrop-blur',
  soft: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100',
  success: 'bg-success/10 text-success ring-1 ring-inset ring-success/20',
};

export function Badge({
  tone = 'soft',
  className,
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium tracking-tight',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
