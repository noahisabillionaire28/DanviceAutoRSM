'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SORT_LABELS, countActiveFilters, parseFilters, serializeFilters } from '@/lib/filters';
import type { InventoryFacets, SortKey } from '@/lib/types';
import { FilterPanel } from './FilterPanel';

export function FilterToolbar({
  facets,
  resultCount,
}: {
  facets: InventoryFacets;
  resultCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const current = parseFilters(Object.fromEntries(searchParams.entries()));
  const activeCount = countActiveFilters(current);

  function setSort(sort: SortKey) {
    const qs = serializeFilters({ ...current, sort, page: 1 });
    startTransition(() => {
      router.push(qs ? `/inventory?${qs}` : '/inventory', { scroll: false });
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-maroon-100 pb-4">
      <p className="tnum text-sm text-muted">
        <span className="font-medium text-maroon-900">{resultCount}</span>{' '}
        {resultCount === 1 ? 'vehicle' : 'vehicles'}
      </p>

      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="sort">Sort by</label>
        <select
          id="sort"
          value={current.sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-11 rounded-md border border-maroon-200 bg-surface px-3 text-sm text-maroon-900 focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
        >
          {Object.entries(SORT_LABELS).map(([value, text]) => (
            <option key={value} value={value}>{text}</option>
          ))}
        </select>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-maroon-200 bg-surface px-3.5 text-sm font-medium text-maroon-900 transition-colors hover:bg-cream-100 lg:hidden"
            >
              Filters
              {activeCount > 0 && (
                <span className="tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-maroon-900 px-1.5 text-xs text-cream-50">
                  {activeCount}
                </span>
              )}
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 animate-overlay-in bg-maroon-950/50 backdrop-blur-sm lg:hidden" />
            <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] animate-sheet-up flex-col rounded-t-2xl bg-cream-50 shadow-modal lg:hidden">
              <div className="flex items-center justify-between border-b border-maroon-100 px-5 py-4">
                <Dialog.Title className="font-display text-lg text-maroon-900">Filters</Dialog.Title>
                <Dialog.Close
                  aria-label="Close filters"
                  className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-maroon-600 hover:bg-maroon-50"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                </Dialog.Close>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <FilterPanel facets={facets} />
              </div>

              {/* The sheet covers the results it is filtering, so it needs a way
                  out that also reports what the filters did. Filters apply live;
                  this is the deliberate dismiss, and the only one besides the ✕. */}
              <div
                className="border-t border-maroon-100 px-5 pt-4"
                style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
              >
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-brand-500 text-base font-medium text-brand-ink transition-colors active:bg-brand-600"
                  >
                    Show {resultCount} {resultCount === 1 ? 'result' : 'results'}
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
