import { cn } from '@/lib/cn';

export function Logo({
  className,
  tone = 'navy',
}: {
  className?: string;
  tone?: 'navy' | 'bone';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-2 font-display text-lg leading-none tracking-tight',
        tone === 'navy' ? 'text-navy-900' : 'text-bone-50',
        className,
      )}
    >
      <span className="font-semibold">Danvice Auto</span>
      <span
        className={cn(
          'text-[0.6875rem] font-medium uppercase tracking-[0.18em]',
          tone === 'navy' ? 'text-muted' : 'text-bone-50/60',
        )}
      >
        of RSM
      </span>
    </span>
  );
}
