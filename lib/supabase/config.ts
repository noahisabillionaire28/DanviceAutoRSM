/**
 * Public Supabase connection values.
 *
 * These are committed deliberately. The anon key is a *publishable* credential —
 * it is embedded in the client bundle of every Supabase web app and is designed
 * to be seen. The security boundary is Row Level Security, not key secrecy:
 * anon can read only vehicles with status='available' and can do nothing to
 * `leads` except insert. That was verified against the live database with
 * `set role anon` before any UI existed.
 *
 * Environment variables still win when present, so local dev and any future
 * environment can point at a different project without a code change.
 *
 * The service-role key is NOT here and must never be. It bypasses RLS entirely
 * and is read from the environment only (see createAdminClient).
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://spanropvanyhskbrcwab.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYW5yb3B2YW55aHNrYnJjd2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMTQ4NDksImV4cCI6MjEwMzc5MDg0OX0.BOQn0wZ5CST-PfdyjS5ZsqUGdXPcf4cGpseJMJ7294Q';
