import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { ALLOW_INDEXING, SITE, SITE_URL } from '@/lib/site';
import { autoDealerJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
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
  // Two audiences, two strings. <title> feeds Google, where keywords earn
  // their place up to ~60 chars; og:title feeds a message bubble, where
  // anything past ~30 wraps onto a third line. They were the same 57-char
  // string, which served neither. The default now follows the same
  // "thing | name" shape as every other page rather than being the odd one out.
  title: {
    default: `Used Cars & Auto Service | ${SITE.name}`,
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
    // Just the name: one line in a text message. The share image above it
    // already carries the headline, and the description sits below it.
    title: SITE.name,
    description: SITE.description,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#12253A',
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
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-900 focus:px-4 focus:py-2 focus:text-neutral-50"
        >
          Skip to content
        </a>

        <SiteHeader />

        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
