'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SITE, formattedAddress, mapsUrl } from '@/lib/site';
import { CallButton } from '@/components/ui/CallButton';
import { Logo } from './Logo';

/**
 * Full-screen menu, mobile only.
 *
 * It takes the whole viewport rather than sliding in as a side sheet: with the
 * fixed bottom bar gone, this is where the phone number lives on every page
 * except the homepage, so it needs room to give Call the weight of a real
 * destination instead of a footnote squeezed into a 86%-wide panel.
 *
 * dvh, not svh: the menu is fixed and must cover the screen as the mobile
 * browser chrome collapses on scroll, where svh would leave a strip uncovered.
 */
export function MobileNavDrawer({ tone = 'maroon' }: { tone?: 'maroon' | 'cream' | 'brand' }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation, otherwise the menu stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors md:hidden ${tone === 'cream' ? 'text-white hover:bg-white/10' : tone === 'brand' ? 'text-brand-600 hover:bg-brand-500/10' : 'text-maroon-800 hover:bg-maroon-50'}`}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
            <path d="M0 1h20M0 7h20M0 13h14" stroke="currentColor" strokeWidth="1.75" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content className="fixed inset-0 z-50 flex h-[100dvh] w-screen animate-sheet-up flex-col bg-cream-50 md:hidden">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div className="flex h-16 shrink-0 items-center justify-between border-b border-maroon-100 px-5">
            <Link href="/" aria-label={`${SITE.name} — home`}>
              <Logo />
            </Link>
            <Dialog.Close
              aria-label="Close menu"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-maroon-700 hover:bg-maroon-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </Dialog.Close>
          </div>

          {/* The links get the space a full screen affords: larger type, generous
              rows, and room to breathe rather than a cramped list. */}
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-8">
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/"
                  className="flex min-h-[56px] items-center rounded-md px-3 font-display text-[1.75rem] leading-tight text-maroon-900 transition-colors hover:bg-maroon-50"
                >
                  Home
                </Link>
              </li>
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-[56px] items-center rounded-md px-3 font-display text-[1.75rem] leading-tight text-maroon-900 transition-colors hover:bg-maroon-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Call is the site's one CTA, and on inner pages this menu is now the
              only place a phone can reach it. It gets a real button, not a link. */}
          <div
            className="shrink-0 border-t border-maroon-100 px-5 pt-6"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <CallButton full showNumber />
            <p className="mt-5 text-sm leading-relaxed text-muted">{formattedAddress()}</p>
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm text-maroon-900 underline decoration-maroon-300 underline-offset-4 hover:decoration-brand-500"
            >
              Get directions
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
