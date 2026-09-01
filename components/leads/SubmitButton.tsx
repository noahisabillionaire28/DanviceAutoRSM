'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button';

export function SubmitButton({ label = 'Send message' }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
            <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Sending…
        </>
      ) : (
        label
      )}
    </Button>
  );
}
