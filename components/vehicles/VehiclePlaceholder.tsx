import { cn } from '@/lib/cn';

/**
 * Rendered whenever a vehicle has no usable photo. Deliberately designed
 * rather than an error state — the demo must never look broken.
 */
export function VehiclePlaceholder({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-navy-900',
        className,
      )}
      role="img"
      aria-label={label ? `${label} — photo coming soon` : 'Photo coming soon'}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, #E8B563 0%, transparent 45%), radial-gradient(circle at 78% 82%, #3A5688 0%, transparent 55%)',
        }}
      />

      <svg
        viewBox="0 0 120 44"
        className="relative w-[46%] max-w-[180px] text-bone-50/25"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 32h8m92 0h8M14 32a8 8 0 1 0 16 0 8 8 0 1 0-16 0Zm76 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0Zm-60 0h60M4 32V22c0-2 1-4 4-5l14-4 10-7c2-1 4-2 6-2h30c3 0 5 1 7 3l9 10 14 3c3 1 4 3 4 6v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M38 10v10M62 8v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {label && (
        <p className="relative mt-4 max-w-[85%] text-center font-display text-sm text-bone-50/70">
          {label}
        </p>
      )}
      <p className="relative mt-1 text-[0.6875rem] uppercase tracking-[0.16em] text-bone-50/35">
        Photo coming soon
      </p>
    </div>
  );
}
