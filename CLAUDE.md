# Danvice Auto of RSM — demo site

Stack: Next.js 15 (App Router) · TypeScript (strict) · Tailwind · Supabase (@supabase/ssr) · Vercel
Dev: `npm run dev` → http://localhost:3000 · Build: `npm run build` · Logic checks: `npm run check`
Live: https://danvice-auto-rsm-lucrosai.vercel.app · Supabase project `danvice-auto-rsm` (us-west-1)

## Design rules
- Palette: deep navy (`navy-*`), warm off-white (`bone-*`), ONE gold accent (`gold-*`).
- Gold is for CTAs only: primary buttons, sticky-bar Call, focus rings, eyebrow hairlines. Never badges, chips, or body text.
- Fonts: Fraunces (display) + Inter (body) via next/font. Prices and specs use `tabular-nums`.
- Shadows are navy-tinted, never black. Whitespace: `py-20 md:py-28` per section.
- Mobile-first. Skeletons must be box-model-identical to real content (zero CLS).
- No dealer clichés: no red/yellow, no starbursts, no checkered flags, no clip art.

## Rules
- Never chain `.select()` on the anon `leads` insert — no SELECT policy exists, so it fails. See supabase/migrations.
- All vehicle images go through `<VehicleImage>`; it must never render a broken image.
- `lib/site.ts` is the single source of truth for name/address/phone/hours.
- Service-role key is server-only; `lib/supabase/server.ts` starts with `import 'server-only'`.
- Reads use a cookie-less supabase-js client: `cookies()` cannot appear inside `unstable_cache`.
- After changing vehicle rows, POST `/api/revalidate` or the site serves stale cached data.
- Indexing is gated behind `NEXT_PUBLIC_ALLOW_INDEXING` (default off). Flip to `true` only when the owner approves.
