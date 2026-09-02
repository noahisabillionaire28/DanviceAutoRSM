'use client';

import { CallButton } from '@/components/ui/CallButton';

/**
 * Fixed bottom bar, mobile only. SiteFooter — the last element in flow —
 * carries matching bottom padding so this never covers it, and the inline
 * env(safe-area-inset-bottom) keeps the buttons clear of the home indicator.
 * Change this bar's height and the footer's bottom padding must follow.
 */
export function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-maroon-100 bg-cream-50/95 shadow-sticky-bar backdrop-blur-md md:hidden">
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <CallButton full showNumber size="md" className="h-12" />
      </div>
    </div>
  );
}
