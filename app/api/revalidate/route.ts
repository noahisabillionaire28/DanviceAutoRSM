import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Purges the 'vehicles' cache tag, so an edit in Supabase shows up on the site
 * within seconds instead of waiting out the revalidate window.
 *
 * Wire this to a Supabase Database Webhook on the vehicles table
 * (INSERT/UPDATE/DELETE) to make inventory edits publish themselves.
 */
export async function POST(request: Request) {
  const secret =
    request.headers.get('x-revalidate-secret') ??
    new URL(request.url).searchParams.get('secret');

  const expected = process.env.REVALIDATE_SECRET ?? 'dv-revalidate-8c31f0a2';
  if (secret !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  revalidateTag('vehicles');
  return NextResponse.json(
    { revalidated: true, tag: 'vehicles', at: new Date().toISOString() },
    { headers: { 'cache-control': 'no-store' } },
  );
}

export async function GET(request: Request) {
  return POST(request);
}
