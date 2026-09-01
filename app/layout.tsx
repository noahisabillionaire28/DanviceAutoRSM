import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { ALLOW_INDEXING, SITE, SITE_URL } from '@/lib/site';
import { autoDealerJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MobileStickyBar } from '@/components/layout/MobileStickyBar';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  // Variable font: weight is fluid, so axes and an explicit weight list are
  // mutually exclusive. SOFT/WONK/opsz give Fraunces its editorial character.
  axes: ['SOFT', 'WONK', 'opsz'],
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — Used Cars in Rancho Santa Margarita`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  // Gated until the owner signs off: an unapproved demo carrying the real
  // business name must not be indexed under it.
  robots: ALLOW_INDEXING
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — Used Cars in Rancho Santa Margarita`,
    description: SITE.description,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#0A1428',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={autoDealerJsonLd()} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-bone-50"
        >
          Skip to content
        </a>

        <SiteHeader />

        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>

        <SiteFooter />
        <MobileStickyBar />
      </body>
    </html>
  );
}
