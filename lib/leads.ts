import 'server-only';

import { createClient } from './supabase/server';
import type { LeadInsert } from './supabase/database.types';

/**
 * The only write path to `leads`.
 *
 * IMPORTANT: never chain .select() here. Doing so sets
 * `Prefer: return=representation`, which makes PostgREST run
 * INSERT ... RETURNING. RETURNING is a read, and `leads` has no SELECT policy
 * by design, so the whole statement fails with 42501. Verified against the live
 * database. Success is `error === null`.
 */
export async function insertLead(payload: LeadInsert): Promise<{ ok: boolean }> {
  const supabase = await createClient();

  const { error } = await supabase.from('leads').insert(payload);

  if (error) {
    console.error('[leads] insert failed:', error.code, error.message);
    return { ok: false };
  }
  return { ok: true };
}
