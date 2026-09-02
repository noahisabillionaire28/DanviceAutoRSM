'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { label } from '@/lib/format';
import { formatPrice, formatMileage } from '@/lib/format';
import {
  EMPTY_FILTERS,
  countActiveFilters,
  parseFilters,
  serializeFilters,
} from '@/lib/filters';
import type { VehicleFilters } from '@/lib/types';

interface Chip {
  key: string;
  text: string;
  clear: (f: VehicleFilters) => VehicleFilters;
}

function buildChips(f: VehicleFilters): Chip[] {
  const chips: Chip[] = [];

  for (const make of f.make) {
    chips.push({
      key: `make:${make}`,
      text: make.charAt(0).toUpperCase() + make.slice(1),
      clear: (c) => ({ ...c, make: c.make.filter((m) => m !== make) }),
    });
  }
  for (const body of f.body) {
    chips.push({
      key: `body:${body}`,
      text: label(body),
      clear: (c) => ({ ...c, body: c.body.filter((b) => b !== body) }),
    });
  }
  for (const t of f.transmission) {
    chips.push({
      key: `trans:${t}`,
      text: label(t),
      clear: (c) => ({ ...c, transmission: c.transmission.filter((x) => x !== t) }),
    });
  }
  for (const d of f.drivetrain) {
    chips.push({
      key: `drive:${d}`,
      text: label(d),
      clear: (c) => ({ ...c, drivetrain: c.drivetrain.filter((x) => x !== d) }),
    });
  }
  for (const fu of f.fuel) {
    chips.push({
      key: `fuel:${fu}`,
      text: label(fu),
      clear: (c) => ({ ...c, fuel: c.fuel.filter((x) => x !== fu) }),
    });
  }
  if (f.minPrice !== undefined) {
    chips.push({
      key: 'minPrice',
      text: `From ${formatPrice(f.minPrice)}`,
      clear: (c) => ({ ...c, minPrice: undefined }),
    });
  }
  if (f.maxPrice !== undefined) {
    chips.push({
      key: 'maxPrice',
      text: `Up to ${formatPrice(f.maxPrice)}`,
      clear: (c) => ({ ...c, maxPrice: undefined }),
    });
  }
  if (f.maxMileage !== undefined) {
    chips.push({
      key: 'maxMileage',
      text: `Under ${formatMileage(f.maxMileage)}`,
      clear: (c) => ({ ...c, maxMileage: undefined }),
    });
  }
  if (f.minYear !== undefined) {
    chips.push({
      key: 'minYear',
      text: `${f.minYear} or newer`,
      clear: (c) => ({ ...c, minYear: undefined }),
    });
  }
  if (f.q) {
    chips.push({
      key: 'q',
      text: `“${f.q}”`,
      clear: (c) => ({ ...c, q: undefined }),
    });
  }
  return chips;
}

/**
 * Shows what is currently filtering the grid and gives one click out of it.
 * Without this the only way to reset on desktop was undoing each control by
 * hand, which reads as the filters being stuck.
 */
export function ActiveFilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = parseFilters(Object.fromEntries(searchParams.entries()));
  if (countActiveFilters(current) === 0) return null;

  const go = (next: VehicleFilters) => {
    const qs = serializeFilters({ ...next, page: 1 });
    startTransition(() => {
      router.push(qs ? `/inventory?${qs}` : '/inventory', { scroll: false });
    });
  };

  const chips = buildChips(current);

  return (
    <div
      className={`flex flex-wrap items-center gap-2 pt-4 ${isPending ? 'opacity-60' : ''}`}
    >
      <span className="sr-only" role="status">
        {chips.length} filters applied
      </span>

      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => go(chip.clear(current))}
          aria-label={`Remove filter ${chip.text}`}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-maroon-200 bg-surface px-3.5 text-sm text-maroon-900 transition-colors hover:border-maroon-300 hover:bg-cream-100"
        >
          {chip.text}
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2.25" />
          </svg>
        </button>
      ))}

      <button
        type="button"
        onClick={() => go({ ...EMPTY_FILTERS, sort: current.sort })}
        className="inline-flex h-11 items-center rounded-full px-3 text-sm font-medium text-brand-600 underline decoration-brand-600/30 underline-offset-4 transition-colors hover:decoration-brand-600"
      >
        Clear all
      </button>
    </div>
  );
}
