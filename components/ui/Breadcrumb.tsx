import Link from 'next/link';
import { Container } from './Container';

export type Crumb = { name: string; href: string };

/**
 * Prepends the Home crumb. Exported because breadcrumbJsonLd needs the full
 * trail including Home, while callers pass it without — routing both through
 * one function is what stops the visible trail and the structured data from
 * disagreeing about their first crumb.
 */
export function withHome(trail: Crumb[]): Crumb[] {
  return [{ name: 'Home', href: '/' }, ...trail];
}

/**
 * Breadcrumb strip: the site's way back to the homepage from any inner page.
 *
 * It renders its own full-width band rather than sitting inside a page's hero,
 * because the heroes disagree about alignment — /about and /financing centre
 * their copy, /inventory left-aligns it — and a breadcrumb inherits whatever it
 * lands in. Its own band keeps the trail left-aligned everywhere, and sits on
 * the base light ground as a lighter ledge above the darker hero below it.
 *
 * `trail` deliberately EXCLUDES Home; it is always prepended. A page therefore
 * cannot render a breadcrumb that does not lead home. The { name, href } shape
 * matches breadcrumbJsonLd in lib/seo.ts, so one array feeds both the visible
 * trail and the structured data, and the two cannot drift apart.
 */
export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  const crumbs = withHome(trail);

  return (
    <div className="bg-background">
      <Container>
        <nav aria-label="Breadcrumb" className="py-4 text-sm md:py-5">
          <ol className="flex flex-wrap items-center gap-2 text-muted">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {last ? (
                    <span aria-current="page" className="text-blue-900">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-blue-900"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </div>
  );
}
