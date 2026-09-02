import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button, ButtonLink } from '@/components/ui/Button';
import { PaymentCalculator } from '@/components/vehicles/PaymentCalculator';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb, withHome } from '@/components/ui/Breadcrumb';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Financing for first-time buyers',
  description:
    'Auto financing in Rancho Santa Margarita for first-time buyers, students, and rebuilt credit. Soft credit check to start, most decisions same day.',
};

const STEPS = [
  { n: '01', t: 'Tell us where you stand', b: 'Income, rough credit picture, and what you can put down. It takes about three minutes and starts with a soft pull that does not affect your score.' },
  { n: '02', t: 'We shop it to our lenders', b: 'We work with several lenders rather than one, including a few who specialize in thin or rebuilt credit files. Most decisions come back the same day.' },
  { n: '03', t: 'You see the whole number', b: 'Not just the monthly payment — the rate, the term, the total, and what it costs if you pay it off early. Then you decide.' },
];

const FAQS = [
  { q: 'I have never had a car loan. Can I get approved?', a: 'Often yes. First-time buyer programs exist specifically for this, and steady income matters more than length of credit history. A co-signer helps but is not always required.' },
  { q: 'Does applying hurt my credit score?', a: 'Starting does not. We begin with a soft credit check, which is invisible to other lenders and does not affect your score. A hard pull only happens if you decide to move forward.' },
  { q: 'How much do I need to put down?', a: 'It varies by lender and by the car, but for vehicles in our price range a common range is $1,000 to $2,500. More down means a lower payment and usually a better rate.' },
  { q: 'What if I have been turned down before?', a: 'Come talk to us anyway. A decline from one lender is one lender’s policy, not a verdict. We regularly place people who were turned away somewhere else.' },
  { q: 'Can I pay it off early?', a: 'Yes, and we will tell you before you sign whether your specific loan has any prepayment penalty. Most of the loans we write do not.' },
];

// One array drives both the visible breadcrumb and its structured data.
const TRAIL = [{ name: 'Financing', href: '/financing' }];

export default function FinancingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(withHome(TRAIL))} />
      <Breadcrumb trail={TRAIL} />

      <section className="bg-maroon-900 text-cream-50">
        <Container className="py-20 text-center md:py-28">
          <div className="mx-auto max-w-2xl">
            <p className="text-eyebrow uppercase text-brand-400">Financing</p>
            <div aria-hidden="true" className="mt-3 h-px w-10 bg-brand-500" />
            <h1 className="mt-7 text-balance text-display-lg text-cream-50">
              Credit is a starting point, not a verdict
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cream-50/70">
              A lot of people walk in here having been told no somewhere else. First
              car, first job, a rough couple of years — none of that is unusual, and
              none of it is disqualifying on its own.
            </p>
            <div className="mt-9 flex justify-center">
              <LeadFormModal
                leadType="financing"
                sourcePage="/financing"
                submitLabel="Start my application"
                trigger={<Button variant="cream" size="lg">Get pre-qualified</Button>}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="The process" title="Three steps, no surprises" />
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="tnum font-display text-4xl text-brand-600/40">{s.n}</span>
                <h3 className="mt-4 font-display text-xl text-maroon-900">{s.t}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.b}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-y border-maroon-100 bg-cream-100 py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Run the numbers"
                title="See what a payment actually looks like"
                lede="Move the sliders to match your situation. This is an estimate to plan with, not an offer — the real number comes from the lender."
              />
              <p className="mt-8 text-muted">
                Prefer to talk it through?{' '}
                <a
                  href={`tel:${SITE.phone.tel}`}
                  className="tnum text-maroon-900 underline decoration-maroon-300 underline-offset-4 hover:decoration-brand-500"
                >
                  {SITE.phone.display}
                </a>
              </p>
            </div>
            <PaymentCalculator price={11000} />
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Questions" title="The things people actually ask" />
          <div className="mt-12 max-w-prose">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-maroon-100 py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg text-maroon-900 marker:content-['']">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-3 sm:flex-row">
            <LeadFormModal
              leadType="financing"
              sourcePage="/financing"
              trigger={<Button size="lg">Get pre-qualified</Button>}
            />
            <ButtonLink href="/inventory" variant="outline" size="lg">
              Browse the lot first
            </ButtonLink>
          </div>

          <p className="mt-10 max-w-prose text-xs leading-relaxed text-muted">
            {SITE.legal.paymentDisclaimer} We do not make credit decisions on this
            site and we never ask for a Social Security number through this form.
          </p>
        </Container>
      </section>
    </>
  );
}
