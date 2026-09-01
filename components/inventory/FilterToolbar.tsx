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
    <div className="flex items-center justify-between gap-4 border-b border-navy-100 pb-4">
      <p className="tnum text-sm text-muted">
        <span className="font-medium text-navy-900">{resultCount}</span>{' '}
        {resultCount === 1 ? 'vehicle' : 'vehicles'}
      </p>

      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="sort">Sort by</label>
        <select
          id="sort"
          value={current.sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-10 rounded-md border border-navy-200 bg-surface px-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        >
          {Object.entries(SORT_LABELS).map(([value, text]) => (
            <option key={value} value={value}>{text}</option>
          ))}
        </select>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-navy-200 bg-surface px-3.5 text-sm font-medium text-navy-900 transition-colors hover:bg-bone-100 lg:hidden"
            >
              Filters
              {activeCount > 0 && (
                <span className="tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-navy-900 px-1.5 text-xs text-bone-50">
                  {activeCount}
                </span>
              )}
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 animate-overlay-in bg-navy-950/50 backdrop-blur-sm lg:hidden" />
            <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] animate-sheet-up flex-col rounded-t-2xl bg-bone-50 shadow-modal lg:hidden">
              <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
                <Dialog.Title className="font-display text-lg text-navy-900">Filters</Dialog.Title>
                <Dialog.Close
                  aria-label="Close filters"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-navy-600 hover:bg-navy-50"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                </Dialog.Close>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <FilterPanel facets={facets} onApply={() => setOpen(false)} />
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
