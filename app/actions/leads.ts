'use server';

import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { LeadSchema } from '@/lib/schemas/lead';
import { checkRateLimit } from '@/lib/rate-limit';
import { insertLead } from '@/lib/leads';
import { SITE } from '@/lib/site';
import type { LeadFormState } from '@/lib/types';
import type { Json } from '@/lib/supabase/database.types';

const MIN_FILL_MS = 2_500;
const MAX_FILL_MS = 2 * 60 * 60 * 1000;

function hashIp(ip: string): string {
  return createHash('sha256')
    .update(ip + (process.env.LEAD_SALT ?? 'dev-salt'))
    .digest('hex');
}

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    return {
      status: 'error',
      message: 'Please check the highlighted fields and try again.',
      fieldErrors,
    };
  }

  const data = parsed.data;
  const firstName = data.name.split(' ')[0] || data.name;

  // Honeypot + timing trap. A caught bot gets a fake success and nothing is
  // written — never tell it that it was caught.
  const tooFast = data.ts !== undefined && Date.now() - data.ts < MIN_FILL_MS;
  const tooSlow = data.ts !== undefined && Date.now() - data.ts > MAX_FILL_MS;
  if (data.company || tooFast || tooSlow) {
    return { status: 'success', firstName };
  }

  const h = await headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown';
  const ipHash = hashIp(ip);

  if (!checkRateLimit(ipHash).ok) {
    return {
      status: 'error',
      message: `That's a few messages in a short time. Please call us at ${SITE.phone.display} and we'll help right away.`,
    };
  }

  const details: Record<string, unknown> = {};
  if (data.lead_type === 'financing') {
    if (data.credit_band) details.credit_band = data.credit_band;
    if (data.down_payment !== undefined) details.down_payment = data.down_payment;
  } else if (data.lead_type === 'sell_your_car') {
    details.year = data.v_year;
    details.make = data.v_make;
    details.model = data.v_model;
    details.mileage = data.v_mileage;
    if (data.v_condition) details.condition = data.v_condition;
  }

  const { ok } = await insertLead({
    name: data.name,
    email: data.email ?? null,
    phone: data.phone ?? null,
    message: data.message ?? null,
    lead_type: data.lead_type,
    vehicle_id: data.lead_type === 'vehicle_inquiry' ? data.vehicle_id : null,
    source_page: data.source_page,
    consent: true,
    details: details as Json,
    user_agent: h.get('user-agent')?.slice(0, 400) ?? null,
    referrer: h.get('referer')?.slice(0, 400) ?? null,
  });

  if (!ok) {
    // Never surface the Postgres error text to the browser.
    return {
      status: 'error',
      message: `Something went wrong on our end. Please call us at ${SITE.phone.display} and we'll take care of you.`,
    };
  }

  return { status: 'success', firstName };
}
