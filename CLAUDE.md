# Danvice Auto of RSM — demo site

Stack: Next.js 15 (App Router) · TypeScript (strict) · Tailwind · Supabase (@supabase/ssr) · Vercel
Dev: `npm run dev` → http://localhost:3000 · Build: `npm run build` · Logic checks: `npm run check`
Live: https://danvice-auto-rsm-lucrosai.vercel.app · Supabase project `danvice-auto-rsm` (us-west-1)

## Design rules
- Palette from the Danvice Auto logo: logo blue `#3F7BC0` (`blue-500`), logo orange `#F07D22` (`orange-500`), cool light ground (`neutral-*`). `blue-900` `#12253A` is the dark field — the logo blue is a mid-tone (white text on it is 4.37:1, under AA) so it can never be the dark ground itself.
- Blue carries structure (dark sections, body text, links, the mark). Orange is the CTA and nothing else. There is no third colour.
- One CTA site-wide: the `CallButton`. Every call to action is Call now — never a second competing button.
- The CTA inverts with its ground, and has exactly two appearances. `primary` (default): `orange-500` fill, `orange-ink` (near-black) label, `orange-600` border. `onDark`: white fill, `blue-900` label, `blue-400` border. **Both borders are load-bearing.** White on orange is 2.74:1 so the label must be dark, and the orange fill is 2.58:1 against the page, under the 3:1 a control edge needs — the border is the only thing giving the button a boundary.
- The CTA brightens on hover (`orange-400`) instead of darkening. This is backwards on purpose: darkening drops the label to 4.07:1 on `orange-600` and 2.78:1 on `orange-700`, both failing. `npm run check` fails if someone "fixes" it.
- `onDark` belongs to exactly two places: the hero, and the header while it is transparent over the hero. Anywhere else it is a white button on a light page, which is the thing this rule exists to prevent.
- Orange is never text. `orange-600` on white is 3.82:1, under AA — nav links are `blue-700` (8.37:1). Orange text is allowed only on the dark field (`orange-400` on `blue-900` is 6.84:1).
- Secondary actions are the `link` variant, never a button. `Button` has only `primary | onDark | ghost | link`.
- The logo mark is inlined in `components/layout/Logo.tsx`, not an image file: the D has to invert with its ground (`blue-500` on white, white over the hero) and an `<img>` cannot inherit a colour.
- The hero video is the hero. Losing it leaves a flat navy panel that still passes every contrast check, so `npm run check` asserts the `<video>` and its source directly.
- Fonts: Fraunces (display) + Inter (body) via next/font. Prices and specs use `tabular-nums`.
- Shadows are navy-tinted, never black. Whitespace: `py-20 md:py-28` per section.
- Mobile-first. Skeletons must be box-model-identical to real content (zero CLS).
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
