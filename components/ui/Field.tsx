'use client';

import { cn } from '@/lib/cn';
import { useId, type ReactNode } from 'react';

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
  }) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-blue-800">
        {label}
        {required && <span className="ml-0.5 text-muted">*</span>}
      </label>

      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}

      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

// text-base is load-bearing, not cosmetic: iOS Safari zooms the viewport on
// focus for any input under 16px, and the viewport meta sets no maximumScale.
// Asserted in scripts/checks.ts.
//
// The border deliberately does NOT use the `line` token that dividers use. A
// control boundary reads as one step stronger than a passive rule, so inputs
// rest at blue-200 and step to 300/400 on hover and focus. That is a state
// ramp, not palette drift — leave it alone.
export const controlClasses =
  'h-11 w-full rounded-md border border-blue-200 bg-surface px-3.5 text-base text-blue-900 placeholder:text-blue-300 transition-colors duration-200 hover:border-blue-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/20 read-only:bg-neutral-100';
