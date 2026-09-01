import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-prose', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <p className={cn('eyebrow eyebrow-rule', align === 'center' && '[&::after]:mx-auto')}>
            {eyebrow}
          </p>
        )}
        <h2 className="mt-5 text-display-md text-maroon-900">{title}</h2>
        {lede && <p className="mt-4 text-lede text-muted">{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
