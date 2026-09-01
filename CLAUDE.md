# Danvice Auto of RSM — demo site

Stack: Next.js 15 (App Router) · TypeScript (strict) · Tailwind · Supabase (@supabase/ssr) · Vercel
Dev: `npm run dev` → http://localhost:3000 · Build: `npm run build` · Logic checks: `npm run check`
Live: https://danvice-auto-rsm-lucrosai.vercel.app · Supabase project `danvice-auto-rsm` (us-west-1)

## Design rules
- Palette from the Danvice badge: deep red (`maroon-*`), warm cream (`cream-*`), signature red (`brand-*`).
- `brand-*` red is for CTAs only. On deep-red sections invert to the `cream` button variant: red-on-red is 2.86:1 and fails AA.
- Fonts: Fraunces (display) + Inter (body) via next/font. Prices and specs use `tabular-nums`.
- Shadows are maroon-tinted, never black. Whitespace: `py-20 md:py-28` per section.
- Mobile-first. Skeletons must be box-model-identical to real content (zero CLS).
- Red is the brand, not a cliché: no starbursts, no checkered flags, no clip art, no second accent colour.
- `npm run check` asserts WCAG AA on every real text/background pair. Re-run it after any palette edit.

## Rules
- Never chain `.select()` on the anon `leads` insert — no SELECT policy exists, so it fails. See supabase/migrations.
- All vehicle images go through `<VehicleImage>`; it must never render a broken image.
- `lib/site.ts` is the single source of truth for name/address/phone/hours.
- Service-role key is server-only; `lib/supabase/server.ts` starts with `import 'server-only'`.
- Reads use a cookie-less supabase-js client: `cookies()` cannot appear inside `unstable_cache`.
- After changing vehicle rows, POST `/api/revalidate` or the site serves stale cached data.
- Indexing is gated behind `NEXT_PUBLIC_ALLOW_INDEXING` (default off). Flip to `true` only when the owner approves.
- After every deployed change, end the reply with the live link: https://danvice-auto-rsm-lucrosai.vercel.app
