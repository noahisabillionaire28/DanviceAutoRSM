'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/format';
import { SITE } from '@/lib/site';
import {
  APR_RANGE, DEFAULT_APR, DEFAULT_TERM, TERMS, estimateMonthlyPayment,
} from '@/lib/payment';

export interface PaymentCalculatorProps {
  price: number;
  variant?: 'card' | 'inline';
  ctaSlot?: ReactNode;
  className?: string;
}

export function PaymentCalculator({
  price,
  variant = 'card',
  ctaSlot,
  className,
}: PaymentCalculatorProps) {
  const [down, setDown] = useState(() => Math.round(price * 0.1));
  const [term, setTerm] = useState<number>(DEFAULT_TERM);
  const [apr, setApr] = useState(DEFAULT_APR);

  const estimate = useMemo(
    () => estimateMonthlyPayment({ price, downPayment: down, termMonths: term, apr }),
    [price, down, term, apr],
  );

  const maxDown = Math.round(price * 0.6);

  return (
    <div
      className={cn(
        variant === 'card' && 'rounded-xl bg-surface p-6 shadow-card ring-1 ring-maroon-100/70',
        className,
      )}
    >
      <h3 className="font-display text-lg text-maroon-900">Estimate your payment</h3>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="tnum font-display text-4xl text-maroon-900">
          ${estimate.monthly}
        </span>
        <span className="text-muted">/month est.</span>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="down" className="text-sm font-medium text-maroon-800">
              Down payment
            </label>
            <span className="tnum text-sm text-maroon-900">{formatPrice(down)}</span>
          </div>
          <input
            id="down"
            type="range"
            min={0}
            max={maxDown}
            step={100}
            value={down}
            onChange={(e) => setDown(Number(e.target.value))}
            className="range-brand mt-2"
          />
        </div>

        <div>
          <span className="text-sm font-medium text-maroon-800">Term</span>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                aria-pressed={term === t}
                className={cn(
                  'tnum h-11 rounded-md text-sm transition-colors duration-200',
                  term === t
                    ? 'bg-maroon-900 text-cream-50'
                    : 'bg-maroon-50 text-maroon-700 hover:bg-maroon-100',
                )}
              >
                {t} mo
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="apr" className="text-sm font-medium text-maroon-800">
              Estimated APR
            </label>
            <span className="tnum text-sm text-maroon-900">{apr.toFixed(1)}%</span>
          </div>
          <input
            id="apr"
            type="range"
            min={APR_RANGE[0]}
            max={APR_RANGE[1]}
            step={0.1}
            value={apr}
            onChange={(e) => setApr(Number(e.target.value))}
            className="range-brand mt-2"
          />
        </div>
      </div>

      <dl className="mt-6 space-y-2 border-t border-maroon-100 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Amount financed</dt>
          <dd className="tnum text-maroon-900">{formatPrice(estimate.amountFinanced)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Total interest</dt>
          <dd className="tnum text-maroon-900">{formatPrice(estimate.totalInterest)}</dd>
        </div>
      </dl>

      {ctaSlot && <div className="mt-6">{ctaSlot}</div>}

      <p className="mt-5 text-xs leading-relaxed text-muted">
        {SITE.legal.paymentDisclaimer} Includes estimated {(0.0775 * 100).toFixed(2)}% sales
        tax and an $85 doc fee.
      </p>
    </div>
  );
}
