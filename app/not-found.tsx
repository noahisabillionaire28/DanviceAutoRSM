import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { CallButton } from '@/components/ui/CallButton';

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-28 text-center md:py-36">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 max-w-lg text-display-md text-maroon-900">
        That page has moved on
      </h1>
      <p className="mt-4 max-w-md text-lede text-muted">
        The link may be old, or the car may have sold. Either way, here is what we
        have on the lot right now.
      </p>
      <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
        <CallButton showNumber />
        <ButtonLink href="/inventory" variant="link">Browse inventory</ButtonLink>
      </div>
    </Container>
  );
}
