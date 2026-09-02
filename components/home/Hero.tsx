import { SITE } from '@/lib/site';
import { formatPrice } from '@/lib/format';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

/**
 * One headline, one sentence, one primary action.
 *
 * The previous hero paired the CTAs with a 2x2 statistics grid, which gave the
 * eye four competing focal points at the exact moment it should have had one.
 * The numbers now sit in a single quiet proof line *below* the buttons, where
 * they support the decision instead of competing with it.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-maroon-900 text-cream-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(212,38,48,0.28) 0%, transparent 65%), radial-gradient(ellipse 90% 60% at 50% 100%, rgba(158,43,43,0.30) 0%, transparent 70%)',
        }}
      />

      <Container className="relative py-24 text-center md:py-36">
        <p className="text-eyebrow uppercase text-cream-50/60">
          {SITE.address.city}
        </p>
        <div aria-hidden="true" className="mx-auto mt-4 h-px w-10 bg-brand-400" />

        <h1 className="mx-auto mt-8 max-w-3xl text-balance text-display-xl text-cream-50">
          Honest cars for real budgets.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream-50/75">
          Every car on our lot is inspected before it&rsquo;s listed and priced the
          same whether you haggle or not.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/inventory" variant="cream" size="lg">
            Browse the lot
          </ButtonLink>
          <ButtonLink
            href={`tel:${SITE.phone.tel}`}
            variant="outline"
            size="lg"
            className="border-cream-50/25 bg-transparent text-cream-50 hover:border-cream-50/45 hover:bg-cream-50/5"
          >
            Call {SITE.phone.display}
          </ButtonLink>
        </div>

        <p className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-cream-50/55">
          <span className="tnum">
            {formatPrice(SITE.priceRange.min)}&ndash;{formatPrice(SITE.priceRange.max)}, every car
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cream-50/30" />
          <span>150-point inspection</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cream-50/30" />
          <span>Open seven days</span>
        </p>
      </Container>
    </section>
  );
}
