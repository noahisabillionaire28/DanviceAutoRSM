import type { PaymentEstimate } from './types';

/** Rancho Santa Margarita combined sales tax. */
export const SALES_TAX_RATE = 0.0775;
export const DOC_FEE = 85;
export const DEFAULT_APR = 8.9;
export const DEFAULT_TERM = 60;
export const TERMS = [36, 48, 60, 72] as const;
export const APR_RANGE: [number, number] = [4.9, 21.9];

export interface EstimateInput {
  price: number;
  downPayment: number;
  termMonths: number;
  apr: number;
  includeTaxAndFees?: boolean;
  salesTaxRate?: number;
  docFee?: number;
}

export function estimateMonthlyPayment({
  price,
  downPayment,
  termMonths,
  apr,
  includeTaxAndFees = true,
  salesTaxRate = SALES_TAX_RATE,
  docFee = DOC_FEE,
}: EstimateInput): PaymentEstimate {
  const taxes = includeTaxAndFees ? price * salesTaxRate : 0;
  const fees = includeTaxAndFees ? docFee : 0;

  const amountFinanced = Math.max(0, price + taxes + fees - downPayment);
  const n = Math.max(1, Math.round(termMonths));
  const r = apr / 100 / 12;

  const monthly =
    r === 0 ? amountFinanced / n : (amountFinanced * r) / (1 - Math.pow(1 + r, -n));

  const safeMonthly = Number.isFinite(monthly) ? monthly : 0;

  return {
    monthly: Math.round(safeMonthly),
    amountFinanced: Math.round(amountFinanced),
    totalInterest: Math.round(safeMonthly * n - amountFinanced),
    termMonths: n,
    apr,
    downPayment: Math.round(downPayment),
  };
}

/** The one-line "$X/mo est." shown on cards. */
export function quickMonthly(price: number): number {
  return estimateMonthlyPayment({
    price,
    downPayment: Math.round(price * 0.1),
    termMonths: DEFAULT_TERM,
    apr: DEFAULT_APR,
  }).monthly;
}
