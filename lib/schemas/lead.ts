import { z } from 'zod';

const phoneDigits = (v: string) => v.replace(/\D/g, '');

const name = z
  .string()
  .trim()
  .min(2, 'Please enter your name.')
  .max(80, 'That name is too long.');

const email = z
  .string()
  .trim()
  .max(160)
  .email('Please enter a valid email address.')
  .optional()
  .or(z.literal('').transform(() => undefined));

const phone = z
  .string()
  .trim()
  .max(32)
  .refine((v) => phoneDigits(v).length >= 10 && phoneDigits(v).length <= 15, {
    message: 'Please enter a 10-digit phone number.',
  })
  .optional()
  .or(z.literal('').transform(() => undefined));

const message = z
  .string()
  .trim()
  .max(2000, 'Please keep your message under 2000 characters.')
  .optional()
  .or(z.literal('').transform(() => undefined));

const consent = z
  .union([z.literal('on'), z.literal('true'), z.literal('1'), z.boolean()])
  .transform(() => true);

const base = {
  name,
  email,
  phone,
  message,
  consent,
  source_page: z.string().trim().max(200).default('/'),
  // Anti-spam. Both are validated server-side only; a client check is trivially bypassed.
  company: z.string().max(200).optional(),   // honeypot
  ts: z.coerce.number().optional(),          // render timestamp
};

export const LeadSchema = z
  .discriminatedUnion('lead_type', [
    z.object({ ...base, lead_type: z.literal('general') }),
    z.object({
      ...base,
      lead_type: z.literal('financing'),
      // '' is what an untouched <select> posts. .optional() only permits
      // undefined, so without the .or() below Zod leaked its raw enum message
      // ("Invalid enum value. Expected 'excellent' | ...") straight to the user.
      credit_band: z
        .enum(['excellent', 'good', 'fair', 'rebuilding', 'first_time'], {
          message: 'Please choose a credit situation.',
        })
        .optional()
        .or(z.literal('').transform(() => undefined)),
      down_payment: z.coerce.number().min(0).max(100000).optional(),
    }),
    z.object({
      ...base,
      lead_type: z.literal('sell_your_car'),
      v_year: z.coerce
        .number({ message: 'Enter the year.' })
        .int('Enter the year.')
        .min(1980, 'Enter a year from 1980 or later.')
        .max(2100, 'Check the year.'),
      v_make: z.string().trim().min(1, 'Enter the make, e.g. Toyota.').max(40),
      v_model: z.string().trim().min(1, 'Enter the model, e.g. Camry.').max(40),
      v_mileage: z.coerce
        .number({ message: 'Enter the mileage.' })
        .int('Enter the mileage.')
        .min(0, 'Mileage cannot be negative.')
        .max(999999, 'Check the mileage.'),
      v_condition: z
        .enum(['excellent', 'good', 'fair', 'rough'], {
          message: 'Please choose a condition.',
        })
        .optional()
        .or(z.literal('').transform(() => undefined)),
    }),
    z.object({
      ...base,
      lead_type: z.literal('vehicle_inquiry'),
      vehicle_id: z.string().uuid(),
    }),
  ])
  .refine((d) => Boolean(d.email || d.phone), {
    message: 'Please give us either an email or a phone number.',
    path: ['email'],
  });

export type LeadInput = z.infer<typeof LeadSchema>;

export const CREDIT_BANDS = [
  { value: 'excellent', label: 'Excellent (720+)' },
  { value: 'good', label: 'Good (660–719)' },
  { value: 'fair', label: 'Fair (600–659)' },
  { value: 'rebuilding', label: 'Rebuilding (under 600)' },
  { value: 'first_time', label: 'No credit history yet' },
] as const;

export const CONDITIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'rough', label: 'Needs work' },
] as const;
