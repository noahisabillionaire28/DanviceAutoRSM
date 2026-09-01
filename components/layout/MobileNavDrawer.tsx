'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SITE, formattedAddress } from '@/lib/site';
import { Logo } from './Logo';

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation, otherwise the sheet stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-maroon-800 transition-colors hover:bg-maroon-50 md:hidden"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
            <path d="M0 1h20M0 7h20M0 13h14" stroke="currentColor" strokeWidth="1.75" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-overlay-in bg-maroon-950/40 backdrop-blur-sm md:hidden" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm animate-sheet-up flex-col bg-cream-50 shadow-modal md:hidden">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div className="flex h-16 items-center justify-between border-b border-maroon-100 px-5">
            <Logo />
            <Dialog.Close
              aria-label="Close menu"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-maroon-700 hover:bg-maroon-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="flex flex-col gap-1">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-3 font-display text-xl text-maroon-900 transition-colors hover:bg-maroon-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-maroon-100 px-5 py-6">
            <p className="text-sm text-muted">{formattedAddress()}</p>
            <a
              href={`tel:${SITE.phone.tel}`}
              className="tnum mt-2 inline-block font-display text-xl text-maroon-900"
            >
              {SITE.phone.display}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
