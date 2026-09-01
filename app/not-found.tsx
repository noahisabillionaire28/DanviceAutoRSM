import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { SITE } from '@/lib/site';

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-28 text-center md:py-36">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 max-w-lg text-display-md text-navy-900">
        That page has moved on
      </h1>
      <p className="mt-4 max-w-md text-lede text-muted">
        The link may be old, or the car may have sold. Either way, here is what we
        have on the lot right now.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/inventory" size="lg">Browse inventory</ButtonLink>
        <ButtonLink href={`tel:${SITE.phone.tel}`} variant="outline" size="lg">
          Call {SITE.phone.display}
        </ButtonLink>
      </div>
    </Container>
  );
}
