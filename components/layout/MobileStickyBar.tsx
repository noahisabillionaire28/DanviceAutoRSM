'use client';

import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * Fixed bottom bar, mobile only. SiteFooter — the last element in flow —
 * carries matching bottom padding so this never covers it, and the inline
 * env(safe-area-inset-bottom) keeps the buttons clear of the home indicator.
 * Change this bar's height and the footer's pb-[calc(...)] must follow.
 */
export function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-maroon-100 bg-cream-50/95 shadow-sticky-bar backdrop-blur-md md:hidden">
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <a
          href={`tel:${SITE.phone.tel}`}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-brand-500 text-[0.9375rem] font-medium text-brand-ink transition-colors active:bg-brand-600"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M5.5 1.5 7 4.5 5.5 6c.7 1.6 2.9 3.8 4.5 4.5L11.5 9l3 1.5v3c0 .6-.4 1-1 1C7 14.5 1.5 9 1.5 2.5c0-.6.4-1 1-1h3Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          Call now
        </a>
        <Link
          href="/inventory"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-maroon-200 bg-surface text-[0.9375rem] font-medium text-maroon-900 transition-colors active:bg-cream-100"
        >
          Browse cars
        </Link>
      </div>
    </div>
  );
}
