'use client';

import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { submitLead } from '@/app/actions/leads';
import { CONDITIONS, CREDIT_BANDS } from '@/lib/schemas/lead';
import type { LeadFormState } from '@/lib/types';
import type { LeadType } from '@/lib/supabase/database.types';
import { Field, controlClasses } from '@/components/ui/Field';
import { SubmitButton } from './SubmitButton';
import { LeadSuccess } from './LeadSuccess';

const INITIAL: LeadFormState = { status: 'idle' };

export interface LeadFormProps {
  leadType: LeadType;
  sourcePage: string;
  vehicleId?: string;
  submitLabel?: string;
  messagePlaceholder?: string;
  onSuccess?: () => void;
}

export function LeadForm({
  leadType,
  sourcePage,
  vehicleId,
  submitLabel,
  messagePlaceholder,
  onSuccess,
}: LeadFormProps) {
  const [state, formAction] = useActionState(submitLead, INITIAL);
  const errorRef = useRef<HTMLParagraphElement>(null);
  // Set once on mount: the timing trap measures how long the form was open.
  const [renderedAt] = useState(() => Date.now());

  // Errors returned by the action are the starting point, but a field's error
  // must disappear the moment the user fixes it — otherwise "Please enter your
  // name" stays on screen next to a filled-in name.
  const serverErrors = state.status === 'error' ? state.fieldErrors : undefined;
  const [cleared, setCleared] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCleared(new Set());
  }, [state]);

  const clearField = useCallback((name: string) => {
    setCleared((prev) => {
      if (prev.has(name)) return prev;
      const next = new Set(prev);
      next.add(name);
      return next;
    });
  }, []);

  const errorFor = (name: string): string | undefined =>
    cleared.has(name) ? undefined : serverErrors?.[name]?.[0];

  const errors = serverErrors;

  useEffect(() => {
    if (state.status === 'error') errorRef.current?.focus();
    if (state.status === 'success') onSuccess?.();
  }, [state, onSuccess]);

  if (state.status === 'success') {
    return <LeadSuccess firstName={state.firstName} leadType={leadType} />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="lead_type" value={leadType} />
      <input type="hidden" name="source_page" value={sourcePage} />
      <input type="hidden" name="ts" value={renderedAt} />
      {vehicleId && <input type="hidden" name="vehicle_id" value={vehicleId} />}

      {/* Honeypot. Off-screen rather than display:none — many bots skip hidden
          fields but happily fill positioned ones. Named like a real field. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-field">Company</label>
        <input
          id="company-field"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === 'error' && state.message && (
        <p
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="rounded-md bg-danger/8 px-4 py-3 text-sm text-danger ring-1 ring-inset ring-danger/20 focus:outline-none"
        >
          {state.message}
        </p>
      )}

      <Field label="Your name" required error={errorFor('name')}>
        {(p) => (
          <input {...p} name="name" onInput={() => clearField('name')} type="text" autoComplete="name" className={controlClasses} />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errorFor('email')}>
          {(p) => (
            <input {...p} name="email" onInput={() => clearField('email')} type="email" autoComplete="email" className={controlClasses} />
          )}
        </Field>
        <Field label="Phone" error={errorFor('phone')}>
          {(p) => (
            <input {...p} name="phone" onInput={() => clearField('phone')} type="tel" autoComplete="tel" className={controlClasses} />
          )}
        </Field>
      </div>

      {leadType === 'financing' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Credit situation" error={errorFor('credit_band')}>
            {(p) => (
              <select {...p} name="credit_band" onChange={() => clearField('credit_band')} className={controlClasses} defaultValue="">
                <option value="">Prefer not to say</option>
                {CREDIT_BANDS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Down payment" hint="Roughly, in dollars" error={errorFor('down_payment')}>
            {(p) => (
              <input {...p} name="down_payment" onInput={() => clearField('down_payment')} type="number" min={0} step={100} className={controlClasses} />
            )}
          </Field>
        </div>
      )}

      {leadType === 'sell_your_car' && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Year" required error={errorFor('v_year')}>
              {(p) => <input {...p} name="v_year" onInput={() => clearField('v_year')} type="number" min={1980} max={2100} className={controlClasses} />}
            </Field>
            <Field label="Make" required error={errorFor('v_make')}>
              {(p) => <input {...p} name="v_make" onInput={() => clearField('v_make')} type="text" className={controlClasses} />}
            </Field>
            <Field label="Model" required error={errorFor('v_model')}>
              {(p) => <input {...p} name="v_model" onInput={() => clearField('v_model')} type="text" className={controlClasses} />}
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mileage" required error={errorFor('v_mileage')}>
              {(p) => <input {...p} name="v_mileage" onInput={() => clearField('v_mileage')} type="number" min={0} className={controlClasses} />}
            </Field>
            <Field label="Condition" error={errorFor('v_condition')}>
              {(p) => (
                <select {...p} name="v_condition" onChange={() => clearField('v_condition')} className={controlClasses} defaultValue="good">
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </>
      )}

      <Field label="Message" error={errorFor('message')}>
        {(p) => (
          <textarea
            {...p}
            name="message"
            onInput={() => clearField('message')}
            rows={4}
            placeholder={messagePlaceholder}
            className={`${controlClasses} h-auto py-3 leading-relaxed`}
          />
        )}
      </Field>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          name="consent"
          required
          defaultChecked
          className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-blue-300 text-blue-900 focus:ring-orange-400"
        />
        <span>
          It&rsquo;s OK to contact me about this inquiry by phone, text, or email.
        </span>
      </label>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
