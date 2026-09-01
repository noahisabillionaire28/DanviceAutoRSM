import { SITE } from '@/lib/site';
import { formatPrice } from '@/lib/format';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-bone-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 60% at 78% 10%, rgba(232,181,99,0.16) 0%, transparent 60%), radial-gradient(ellipse 80% 70% at 10% 90%, rgba(58,86,136,0.35) 0%, transparent 65%)',
        }}
      />

      <Container className="relative py-20 md:py-28 lg:py-32">
        {/* Asymmetric 7/5 split — a centred hero is the template tell. */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-eyebrow uppercase text-gold-400">
              Rancho Santa Margarita
            </p>
            <div aria-hidden="true" className="mt-3 h-px w-10 bg-gold-500" />

            <h1 className="mt-7 text-display-xl text-bone-50">
              Honest cars for
              <br />
              real budgets.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-bone-50/70">
              Every car on our lot sits between{' '}
              <span className="tnum">{formatPrice(SITE.priceRange.min)}</span> and{' '}
              <span className="tnum">{formatPrice(SITE.priceRange.max)}</span>, is
              inspected before it&rsquo;s listed, and is priced the same whether you
              haggle or not. We help a lot of first-time buyers, students, and
              families in South County.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/inventory" size="lg">
                Browse the lot
              </ButtonLink>
              <ButtonLink
                href={`tel:${SITE.phone.tel}`}
                variant="outline"
                size="lg"
                className="border-bone-50/25 bg-transparent text-bone-50 hover:border-bone-50/40 hover:bg-bone-50/5"
              >
                Call {SITE.phone.display}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-bone-50/10 ring-1 ring-bone-50/10">
              {[
                { k: '12', v: 'Cars on the lot right now' },
                { k: '$5–15k', v: 'Every vehicle, no exceptions' },
                { k: '150+', v: 'Point inspection before listing' },
                { k: '7 days', v: 'Open every day of the week' },
              ].map((stat) => (
                <div key={stat.v} className="bg-navy-900 p-6">
                  <dt className="tnum font-display text-3xl text-bone-50">{stat.k}</dt>
                  <dd className="mt-1.5 text-sm leading-snug text-bone-50/55">{stat.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
