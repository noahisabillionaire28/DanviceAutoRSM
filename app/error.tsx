'use client';

import { useEffect } from 'react';
import { SITE } from '@/lib/site';
import { Button } from '@/components/ui/Button';
import { CallButton } from '@/components/ui/CallButton';
import { Container } from '@/components/ui/Container';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app] unhandled error:', error);
  }, [error]);

  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-28 text-center md:py-36">
      <p className="eyebrow">Something broke</p>
      <h1 className="mt-5 max-w-lg text-display-md text-maroon-900">
        Sorry — that did not load
      </h1>
      <p className="mt-4 max-w-md text-lede text-muted">
        Try again in a moment. If it keeps happening, call us and we will help you
        directly.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>Try again</Button>
        <CallButton showNumber />
      </div>
    </Container>
  );
}
