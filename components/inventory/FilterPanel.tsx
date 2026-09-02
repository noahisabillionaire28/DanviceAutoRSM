'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { cn } from '@/lib/cn';
import { formatPrice, label } from '@/lib/format';
import { parseFilters, serializeFilters } from '@/lib/filters';
import type { InventoryFacets, VehicleFilters } from '@/lib/types';

const TRANSMISSIONS = ['automatic', 'cvt', 'manual'] as const;
const DRIVETRAINS = ['fwd', 'awd', '4wd'] as const;
const FUELS = ['gasoline', 'hybrid'] as const;

/**
 * The URL is the state. This component reads useSearchParams() and commits with
 * router.push — deliberately no value/onChange props, so a shared or reloaded
 * filtered URL always reproduces the same result set.
 */
export function FilterPanel({
  facets,
  className,
}: {
  facets: InventoryFacets;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const fromUrl = parseFilters(Object.fromEntries(searchParams.entries()));

  // The URL is still the source of truth, but it lags: commit() runs inside a
  // transition, so searchParams does not change until the server round-trip
  // lands. Deriving `checked` straight from it made a click look like it did
  // nothing for a beat. This local mirror paints the new state immediately and
  // reconciles whenever the URL actually changes.
  const [current, setCurrent] = useState<VehicleFilters>(fromUrl);
  const urlKey = serializeFilters(fromUrl);
  const lastUrlKey = useRef(urlKey);

  useEffect(() => {
    if (lastUrlKey.current !== urlKey) {
      lastUrlKey.current = urlKey;
      setCurrent(fromUrl);
    }
  }, [urlKey, fromUrl]);

  // Filters commit live, but committing is NOT the same as dismissing. This
  // used to call onApply() here, which closed the mobile sheet on every single
  // checkbox — picking a second filter meant reopening it. Closing is now the
  // deliberate act of the "Show N results" button in FilterToolbar.
  const commit = useCallback(
    (next: VehicleFilters) => {
      setCurrent(next);
      const qs = serializeFilters({ ...next, page: 1 });
      lastUrlKey.current = qs;
      startTransition(() => {
        router.push(qs ? `/inventory?${qs}` : '/inventory', { scroll: false });
      });
    },
    [router],
  );

  function toggle<K extends 'make' | 'body' | 'transmission' | 'drivetrain' | 'fuel'>(
    key: K,
    value: string,
  ) {
    const list = current[key] as string[];
    const next = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
    commit({ ...current, [key]: next } as VehicleFilters);
  }

  return (
    <div className={cn('flex flex-col gap-8', isPending && 'opacity-60', className)}>
      <Group title="Price">
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            aria-label="Minimum price"
            placeholder={formatPrice(facets.priceMin)}
            defaultValue={current.minPrice}
            onCommit={(v) => commit({ ...current, minPrice: v })}
          />
          <NumberInput
            aria-label="Maximum price"
            placeholder={formatPrice(facets.priceMax)}
            defaultValue={current.maxPrice}
            onCommit={(v) => commit({ ...current, maxPrice: v })}
          />
        </div>
      </Group>

      {facets.makes.length > 0 && (
        <Group title="Make">
          <div className="flex flex-col gap-1">
            {facets.makes.map((m) => (
              <Check
                key={m.value}
                label={m.value}
                count={m.count}
                checked={current.make.includes(m.value.toLowerCase())}
                onChange={() => toggle('make', m.value.toLowerCase())}
              />
            ))}
          </div>
        </Group>
      )}

      {facets.bodyTypes.length > 0 && (
        <Group title="Body style">
          <div className="flex flex-col gap-1">
            {facets.bodyTypes.map((b) => (
              <Check
                key={b.value}
                label={label(b.value)}
                count={b.count}
                checked={current.body.includes(b.value)}
                onChange={() => toggle('body', b.value)}
              />
            ))}
          </div>
        </Group>
      )}

      <Group title="Max mileage">
        <NumberInput
          aria-label="Maximum mileage"
          placeholder="Any"
          defaultValue={current.maxMileage}
          onCommit={(v) => commit({ ...current, maxMileage: v })}
        />
      </Group>

      <Group title="Transmission">
        <div className="flex flex-col gap-1">
          {TRANSMISSIONS.map((t) => (
            <Check
              key={t}
              label={label(t)}
              checked={current.transmission.includes(t)}
              onChange={() => toggle('transmission', t)}
            />
          ))}
        </div>
      </Group>

      <Group title="Drivetrain">
        <div className="flex flex-col gap-1">
          {DRIVETRAINS.map((d) => (
            <Check
              key={d}
              label={label(d)}
              checked={current.drivetrain.includes(d)}
              onChange={() => toggle('drivetrain', d)}
            />
          ))}
        </div>
      </Group>

      <Group title="Fuel">
        <div className="flex flex-col gap-1">
          {FUELS.map((f) => (
            <Check
              key={f}
              label={label(f)}
              checked={current.fuel.includes(f)}
              onChange={() => toggle('fuel', f)}
            />
          ))}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-blue-900">{title}</legend>
      {children}
    </fieldset>
  );
}

function Check({
  label: text,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md py-2.5 text-[0.9375rem] text-blue-700 transition-colors hover:text-blue-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded-sm border-blue-300 text-blue-900 focus:ring-orange-400"
      />
      <span className="flex-1 capitalize">{text}</span>
      {count !== undefined && <span className="tnum text-xs text-muted">{count}</span>}
    </label>
  );
}

function NumberInput({
  defaultValue,
  onCommit,
  ...props
}: {
  defaultValue?: number;
  onCommit: (v: number | undefined) => void;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'defaultValue' | 'onChange'>) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <input
      {...props}
      type="number"
      defaultValue={defaultValue ?? ''}
      onChange={(e) => {
        // Apply as the user types (debounced) rather than only on Enter —
        // typing a price and tabbing away used to look like nothing happened.
        const raw = e.target.value.trim();
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          onCommit(raw === '' ? undefined : Number(raw));
        }, 400);
      }}
      onBlur={(e) => {
        if (timer.current) clearTimeout(timer.current);
        const raw = e.target.value.trim();
        onCommit(raw === '' ? undefined : Number(raw));
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className="h-11 w-full rounded-md border border-blue-200 bg-surface px-3 text-base text-blue-900 placeholder:text-blue-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
    />
  );
}
