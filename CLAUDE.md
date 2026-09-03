# Danvice Auto of RSM — demo site

Stack: Next.js 15 (App Router) · TypeScript (strict) · Tailwind · Supabase (@supabase/ssr) · Vercel
Dev: `npm run dev` → http://localhost:3000 · Build: `npm run build` · Logic checks: `npm run check`
Live: https://danvice-auto-rsm-lucrosai.vercel.app · Supabase project `danvice-auto-rsm` (us-west-1)

## Design rules
- Palette from the Danvice Auto logo: logo blue `#3F7BC0` (`blue-500`), logo orange `#F07D22` (`orange-500`), cool light ground (`neutral-*`). `blue-900` `#12253A` is the dark field — the logo blue is a mid-tone (white text on it is 4.37:1, under AA) so it can never be the dark ground itself.
- Blue carries structure (dark sections, body text, links, the mark). Orange is the CTA and nothing else. There is no third colour.
- One CTA site-wide: the `CallButton`. Every call to action is Call now — never a second competing button.
- The CTA inverts with its ground, and has exactly two appearances. `primary` (default): `orange-700` `#B35309` fill, **white** label, no border — 5.05:1, and at that depth the fill carries its own edge. `onDark`: white fill, `blue-900` label, `blue-400` border, which IS load-bearing (a bright video frame would otherwise leave it no edge).
- **The CTA is not the logo orange, and this is deliberate.** White on `orange-500` is 2.74:1 and on `orange-600` still 3.82:1 — white does not clear AA until `orange-700`. The logo orange stays the brand accent everywhere else. `npm run check` fails if the CTA is set back to `orange-400/500/600`.
- The CTA darkens on hover (`orange-800`, then `orange-900` active) because its label is white. Note this is the opposite of what a dark-labelled orange button would need.
- `onDark` belongs to exactly two places: the hero, and the header while it is transparent over the hero. Anywhere else it is a white button on a light page, which is the thing this rule exists to prevent.
- Orange is never text on a light ground. `orange-600` on white is 3.82:1, under AA — nav links are `blue-700` (8.37:1). Orange text is allowed only on the dark field (`orange-400` on `blue-900` is 6.84:1).
- Secondary actions are the `link` variant, never a button. `Button` has only `primary | onDark | ghost | link`.
- The logo is `public/brand/danvice-logo.svg` — the real Danvice Auto lockup (two swooshes over the DANVICE AUTO wordmark), rendered by `components/layout/Logo.tsx`. One file serves every ground: blue and orange both hold up on white and on `blue-900`, so there is no recoloured dark variant to drift. It carries its own wordmark, so never put HTML text beside it. The wordmark is set in Michroma, converted to outlines — no webfont is loaded for it.
- `app/icon.svg` is the same mark cropped to the two swooshes; the wordmark is illegible at 16px. `app/opengraph-image.tsx` reads the logo file at build time rather than copying its paths, so the share image cannot drift from the logo.
- The hero video is the hero. Losing it leaves a flat navy panel that still passes every contrast check, so `npm run check` asserts the `<video>` and its source directly.
- Fonts: Fraunces (display) + Inter (body) via next/font. Prices and specs use `tabular-nums`.
- **Headings use a size token, never a bare `text-lg/xl/2xl`.** Tailwind's own sizes carry no `font-weight`, so a heading set in one silently inherits body 400 while `display-*` sit at 600 — that mismatch flattened the hierarchy on every page. Four tiers: `text-display-*` (page titles), `text-subhead` (a titled block owning a chunk of a page), `text-card-title` (a repeated grid item or in-card widget title), `text-eyebrow`. All carry their own weight. `npm run check` fails on a bare size.
- Three section rhythms, and only three: page intro band `py-14 text-center md:py-20`, main content section `py-20 md:py-28`, compressed band `py-16 md:py-20`. Pick the slot; don't invent a value.
- Two radii: `rounded-md` (10px) for controls, `rounded-card` (16px) for every card, panel, modal and framed image. Cards used to round at 14/20/28 depending on the page.
- One divider colour: the `line` token (`blue-100`), applied globally by `* { @apply border-line }`. Form inputs deliberately sit one step stronger (`blue-200`, → 300/400 on hover/focus) — that is a state ramp, not drift.
- Shadows are navy-tinted, never black.
- Mobile-first. Skeletons must be box-model-identical to real content (zero CLS) — `npm run check` diffs each skeleton's `Container` padding against its real page, because that pair drifted apart once and the detail page visibly jumped.
- Keep it restrained: no starbursts, no checkered flags, no clip art, no second accent colour.
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
