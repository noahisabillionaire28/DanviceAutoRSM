import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * PLACEHOLDER COPY — replace with the owner's real reviews before launch.
 *
 * Deliberately no star rating, review count, or Google/Yelp badge. Inventing
 * those for a real business would be fabricating a record about a real entity,
 * and this page carries the real Danvice name, address and phone. Once the
 * owner supplies genuine reviews they drop straight into this array and a real
 * aggregate rating can be added with real numbers behind it.
 */
const QUOTES = [
  {
    quote:
      'First car I have ever bought on my own. They let me take it to my own mechanic before I decided, and the price on the window was the price I paid.',
    name: 'Sample review',
    detail: 'Replace with a real customer quote',
  },
  {
    quote:
      'Two other places turned me down for financing. These guys got me approved the same afternoon and walked me through what the whole loan actually cost.',
    name: 'Sample review',
    detail: 'Replace with a real customer quote',
  },
  {
    quote:
      'Sold them my old Civic without buying anything. No pressure, no bait and switch on the number, and the DMV paperwork was handled.',
    name: 'Sample review',
    detail: 'Replace with a real customer quote',
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-maroon-100 bg-cream-100 py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="What people say"
          title="Buying a car here, in their words"
        />

        <ul className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {QUOTES.map((q) => (
            <li key={q.quote} className="flex flex-col">
              <svg
                width="26"
                height="20"
                viewBox="0 0 26 20"
                fill="none"
                aria-hidden="true"
                className="text-brand-500/35"
              >
                <path
                  d="M10 0C4.5 2.5 1 7 1 13a6.5 6.5 0 1 0 6.5-6.5c-.5 0-1 .1-1.4.2C7 4.6 8.4 2.8 10.7 1.4L10 0Zm14.6 0c-5.5 2.5-9 7-9 13a6.5 6.5 0 1 0 6.5-6.5c-.5 0-1 .1-1.4.2 1-2.1 2.3-3.9 4.6-5.3L24.6 0Z"
                  fill="currentColor"
                />
              </svg>

              <blockquote className="mt-5 flex-1 text-[1.0625rem] leading-relaxed text-maroon-900">
                {q.quote}
              </blockquote>

              <footer className="mt-5 border-t border-maroon-100 pt-4">
                <p className="text-sm font-medium text-maroon-900">{q.name}</p>
                <p className="mt-0.5 text-xs text-muted">{q.detail}</p>
              </footer>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
