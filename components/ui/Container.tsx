import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1240px] px-5 md:px-8', className)}>
      {children}
    </div>
  );
}
