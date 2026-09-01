'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, type ReactNode } from 'react';
import type { LeadType } from '@/lib/supabase/database.types';
import { LeadForm } from './LeadForm';

const TITLES: Record<LeadType, { title: string; description: string }> = {
  general: {
    title: 'Get in touch',
    description: 'Tell us what you need and we’ll get back to you quickly.',
  },
  financing: {
    title: 'Get pre-qualified',
    description: 'A few details and we’ll find out what you can be approved for. No obligation.',
  },
  sell_your_car: {
    title: 'Get an offer on your car',
    description: 'Tell us about your vehicle and we’ll come back with a real number.',
  },
  vehicle_inquiry: {
    title: 'Ask about this vehicle',
    description: 'Questions, a test drive, or hold it for the day — just ask.',
  },
};

export interface LeadFormModalProps {
  leadType: LeadType;
  sourcePage: string;
  trigger: ReactNode;
  vehicleId?: string;
  vehicleTitle?: string;
  submitLabel?: string;
}

export function LeadFormModal({
  leadType,
  sourcePage,
  trigger,
  vehicleId,
  vehicleTitle,
  submitLabel,
}: LeadFormModalProps) {
  const [open, setOpen] = useState(false);
  const copy = TITLES[leadType];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-overlay-in bg-navy-950/50 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] animate-sheet-up overflow-y-auto rounded-t-2xl bg-bone-50 p-6 shadow-modal sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(34rem,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:animate-dialog-in sm:rounded-xl sm:p-8"
        >
          <div className="mb-6 pr-8">
            <Dialog.Title className="font-display text-2xl text-navy-900">
              {copy.title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-muted">
              {vehicleTitle ? `About the ${vehicleTitle}.` : copy.description}
            </Dialog.Description>
          </div>

          <Dialog.Close
            aria-label="Close"
            className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-md text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </Dialog.Close>

          {/* Deliberately does NOT auto-close on success — an abrupt dismissal
              reads as a failure. The success state replaces the form in place. */}
          <LeadForm
            leadType={leadType}
            sourcePage={sourcePage}
            vehicleId={vehicleId}
            submitLabel={submitLabel}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
