import { SITE } from '@/lib/site';
import { CallButton } from '@/components/ui/CallButton';
import type { LeadType } from '@/lib/supabase/database.types';

/** Each path gets its own promise — a seller and a buyer are owed different things. */
const COPY: Record<LeadType, string> = {
  general:
    'We’ve got your message and someone from our team will reach out within one business hour.',
  financing:
    'We’ll start shopping it to our lenders and come back with what you’re approved for, usually the same day.',
  sell_your_car:
    'We’ll look up what your car is worth in South County right now and get you a real number shortly.',
  vehicle_inquiry:
    'We’ll confirm the car is still available and get straight back to you, usually within the hour.',
};

export function LeadSuccess({
  firstName,
  leadType = 'general',
}: {
  firstName: string;
  leadType?: LeadType;
}) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/15">
        <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true">
          <path
            d="M2 10.5 9 17.5 24 2.5"
            stroke="#A50E18"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h3 className="mt-5 font-display text-2xl text-blue-900">
        Thanks, {firstName}.
      </h3>
      <p className="mt-2 max-w-sm text-muted">
        {COPY[leadType]} If you&rsquo;d rather talk now, give us a call.
      </p>

      <CallButton showNumber className="mt-6" />
    </div>
  );
}
