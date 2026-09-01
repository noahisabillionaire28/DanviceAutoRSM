import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Anon-key client for server-side reads and lead inserts.
 *
 * Deliberately cookie-less. This site has no auth session, and a cookie-reading
 * client cannot run inside unstable_cache() — Next treats cookies() as a dynamic
 * data source and refuses to cache around it. Since every query here is either
 * public data or an anonymous insert, there is nothing to read cookies for.
 *
 * The security boundary is RLS, not key secrecy: the anon key is public by design.
 */
function anonClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function createClient() {
  return anonClient();
}

/**
 * Service-role client. Bypasses RLS entirely — never expose to the browser.
 * Used only by the photo ingest route and admin tooling.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
