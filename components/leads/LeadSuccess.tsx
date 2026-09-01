import { SITE } from '@/lib/site';
import { ButtonLink } from '@/components/ui/Button';

export function LeadSuccess({ firstName }: { firstName: string }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15">
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

      <h3 className="mt-5 font-display text-2xl text-maroon-900">
        Thanks, {firstName}.
      </h3>
      <p className="mt-2 max-w-sm text-muted">
        We&rsquo;ve got your message and someone from our team will reach out within
        one business hour. If you&rsquo;d rather talk now, give us a call.
      </p>

      <ButtonLink href={`tel:${SITE.phone.tel}`} className="mt-6" size="lg">
        Call {SITE.phone.display}
      </ButtonLink>
    </div>
  );
}
