import Link from 'next/link';
import { cn } from '@/lib/cn';
import { serializeFilters } from '@/lib/filters';
import type { VehicleFilters } from '@/lib/types';

export function Pagination({
  filters,
  page,
  pageCount,
}: {
  filters: VehicleFilters;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const qs = serializeFilters({ ...filters, page: p });
    return qs ? `/inventory?${qs}` : '/inventory';
  };

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={href(page - 1)}
          rel="prev"
          className="inline-flex h-11 items-center rounded-md border border-blue-200 px-4 text-sm text-blue-900 transition-colors hover:bg-neutral-100"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'tnum inline-flex h-11 w-11 items-center justify-center rounded-md text-sm transition-colors',
            p === page
              ? 'bg-blue-900 text-neutral-50'
              : 'border border-blue-200 text-blue-900 hover:bg-neutral-100',
          )}
        >
          {p}
        </Link>
      ))}

      {page < pageCount && (
        <Link
          href={href(page + 1)}
          rel="next"
          className="inline-flex h-11 items-center rounded-md border border-blue-200 px-4 text-sm text-blue-900 transition-colors hover:bg-neutral-100"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
