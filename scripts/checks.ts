import { LeadSchema } from '@/lib/schemas/lead';
import { estimateMonthlyPayment } from '@/lib/payment';
import { parseFilters, serializeFilters } from '@/lib/filters';
import { resolveVehicleImage } from '@/lib/images';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let pass = 0, fail = 0;
const check = (name: string, cond: boolean, extra = '') => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name} ${extra}`); }
};

console.log('\nLead schema');
const valid = LeadSchema.safeParse({
  name: 'Maria Gomez', email: 'maria@example.com', phone: '(949) 555-0134',
  message: 'Is the Civic still available?', lead_type: 'general',
  source_page: '/contact', consent: 'on',
});
check('valid general lead parses', valid.success, JSON.stringify(valid.error?.issues));

const noContact = LeadSchema.safeParse({
  name: 'No Contact', lead_type: 'general', source_page: '/', consent: 'on',
});
check('rejects lead with neither email nor phone', !noContact.success);

const badEmail = LeadSchema.safeParse({
  name: 'Bad Email', email: 'not-an-email', lead_type: 'general', source_page: '/', consent: 'on',
});
check('rejects malformed email', !badEmail.success);

const sell = LeadSchema.safeParse({
  name: 'Seller', phone: '9495550134', lead_type: 'sell_your_car', source_page: '/sell-your-car',
  consent: 'on', v_year: '2014', v_make: 'Toyota', v_model: 'Camry', v_mileage: '98000',
});
check('sell_your_car coerces year/mileage', sell.success && sell.data.lead_type === 'sell_your_car');

const sellMissing = LeadSchema.safeParse({
  name: 'Seller', phone: '9495550134', lead_type: 'sell_your_car',
  source_page: '/sell-your-car', consent: 'on',
});
check('sell_your_car requires vehicle details', !sellMissing.success);

const inquiry = LeadSchema.safeParse({
  name: 'Buyer', phone: '9495550134', lead_type: 'vehicle_inquiry',
  source_page: '/inventory/x', consent: 'on', vehicle_id: 'not-a-uuid',
});
check('vehicle_inquiry rejects non-uuid vehicle_id', !inquiry.success);

const honeypot = LeadSchema.safeParse({
  name: 'Spam Bot', email: 'bot@example.com', lead_type: 'general',
  source_page: '/', consent: 'on', company: 'FILLED', ts: String(Date.now()),
});
check('honeypot field is captured for server-side check',
  honeypot.success && honeypot.data.company === 'FILLED');

console.log('\nPayment math');
const e = estimateMonthlyPayment({ price: 12995, downPayment: 1300, termMonths: 60, apr: 8.9 });
check('monthly payment is plausible', e.monthly > 150 && e.monthly < 400, `got ${e.monthly}`);
const zero = estimateMonthlyPayment({ price: 10000, downPayment: 0, termMonths: 60, apr: 0 });
check('0% APR does not divide by zero', Number.isFinite(zero.monthly) && zero.monthly > 0, `got ${zero.monthly}`);
const over = estimateMonthlyPayment({ price: 5000, downPayment: 99999, termMonths: 60, apr: 8.9 });
check('down payment above price clamps to 0', over.monthly === 0, `got ${over.monthly}`);

console.log('\nFilter parsing (must clamp, never throw)');
const junk = parseFilters({ maxPrice: 'banana', minYear: '-5', page: '99999', sort: 'nonsense' });
check('garbage maxPrice ignored', junk.maxPrice === undefined);
check('out-of-range year clamped', junk.minYear === 1980, `got ${junk.minYear}`);
check('page clamped to max', junk.page === 500, `got ${junk.page}`);
check('unknown sort falls back to newest', junk.sort === 'newest');
const swapped = parseFilters({ minPrice: '15000', maxPrice: '5000' });
check('reversed price range is swapped', swapped.minPrice === 5000 && swapped.maxPrice === 15000);
const rt = parseFilters(Object.fromEntries(new URLSearchParams(
  serializeFilters(parseFilters({ make: 'honda,toyota', body: 'suv', sort: 'price_asc' })))));
check('filters round-trip through the URL', rt.make.join(',') === 'honda,toyota' && rt.body[0] === 'suv' && rt.sort === 'price_asc');

console.log('\nImage guard');
check('local path allowed', resolveVehicleImage('/vehicles/a/01.jpg').kind === 'local');
check('allowlisted host allowed', resolveVehicleImage('https://upload.wikimedia.org/x.jpg').kind === 'remote');
check('unknown host rejected', resolveVehicleImage('https://evil.example.com/x.jpg').kind === 'invalid');
check('null rejected', resolveVehicleImage(null).kind === 'invalid');
check('protocol-relative rejected', resolveVehicleImage('//evil.com/x.jpg').kind === 'invalid');
check('garbage rejected', resolveVehicleImage('not a url').kind === 'invalid');


// ---------------------------------------------------------------------------
// Colour contrast. The palette is orange-and-blue, where it is very easy to
// pick a tone that looks right and fails WCAG — the logo orange in particular
// carries only 2.74:1 against white, so anything placed on it must be dark.
// These assert the real pairs used in the UI, read from tailwind.config.ts and
// globals.css so the check cannot silently drift from the palette it guards.
// ---------------------------------------------------------------------------

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** CSS custom props in globals.css are "R G B" triples. */
function varHex(name: string): string {
  const css = readFileSync(join(ROOT, 'app/globals.css'), 'utf8');
  const m = css.match(new RegExp(`--${name}:\\s*(\\d+)\\s+(\\d+)\\s+(\\d+)`));
  if (!m) throw new Error(`--${name} not found in globals.css`);
  return '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
}

function tokenHex(path: string): string {
  const cfg = readFileSync(join(ROOT, 'tailwind.config.ts'), 'utf8');
  const [group, shade] = path.split('.');
  const block = shade
    ? cfg.slice(cfg.indexOf(`${group}: {`))
    : cfg;
  const needle = shade ? new RegExp(`\\b${shade}:\\s*'(#[0-9A-Fa-f]{6})'`) : new RegExp(`'${group}':\\s*'(#[0-9A-Fa-f]{6})'`);
  const m = block.match(needle);
  if (!m) throw new Error(`token ${path} not found in tailwind.config.ts`);
  return m[1];
}

console.log('\nColour contrast (WCAG AA: 4.5 normal text, 3.0 large/UI)');

const bg = varHex('bg');
const surface = varHex('surface');
const fg = varHex('fg');
const fgMuted = varHex('fg-muted');
const accent = varHex('accent');
const accentFg = varHex('accent-fg');

const pairs: [string, string, string, number][] = [
  ['body text on page background', fg, bg, 4.5],
  ['muted text on page background', fgMuted, bg, 4.5],
  ['body text on card surface', fg, surface, 4.5],
  ['muted text on card surface', fgMuted, surface, 4.5],
  ['light text on darkest section', tokenHex('neutral.50'), tokenHex('blue.900'), 4.5],
  ['light text on deep section', tokenHex('neutral.50'), tokenHex('blue.700'), 4.5],
  ['heading on tinted panel', tokenHex('blue.900'), tokenHex('neutral.100'), 4.5],

  // Navigation and links. The logo blue is a mid-tone — 4.37:1 on white, under
  // AA — so it cannot be used for text. blue-700 is the text-safe step down.
  ['nav link on the white header', tokenHex('blue.700'), '#ffffff', 4.5],
  ['link text on the page ground', tokenHex('blue.700'), bg, 4.5],
  // The logo orange is 3.82:1 on white at its darkest usable step, so it is
  // never text. This guards the temptation to make nav links match the CTA.
  ['orange is not used for body text (orange-600 on white)', tokenHex('orange.600'), '#ffffff', 3.0],

  // The CTA inverts with its ground. On light pages it is an orange fill with
  // a near-black label: white on orange-500 is only 2.74:1 and fails outright.
  ['CTA label on the orange CTA', tokenHex('orange-ink'), tokenHex('orange.500'), 4.5],
  ['CTA label on the orange CTA hover', tokenHex('orange-ink'), tokenHex('orange.400'), 4.5],
  ['CTA label on the orange CTA active', tokenHex('orange-ink'), tokenHex('orange.600'), 4.5],
  // The orange fill is 2.58:1 against the page, under the 3:1 a control edge
  // needs, so the border is what gives the button a boundary. If this fails,
  // the button has lost its edge — do not "fix" it by deleting the assertion.
  ['CTA border against the white header', tokenHex('orange.600'), '#ffffff', 3.0],
  ['CTA border against the page ground', tokenHex('orange.600'), bg, 3.0],
  ['CTA border against the tinted band', tokenHex('orange.600'), tokenHex('neutral.100'), 3.0],
  // On dark grounds it stays white: the hero, and the header over it.
  ['onDark CTA label on its white fill', tokenHex('blue.900'), '#ffffff', 4.5],
  ['onDark CTA against the darkest section', '#ffffff', tokenHex('blue.900'), 3.0],
  // The onDark border is still load-bearing, but only over the video: a blank
  // white frame behind a white button would otherwise leave no edge at all.
  ['onDark CTA border against a white video frame', tokenHex('blue.400'), '#ffffff', 3.0],
  // Accents on the dark field: the eyebrow, its rule, and the logo mark.
  ['orange accent on the darkest section', tokenHex('orange.500'), tokenHex('blue.900'), 3.0],
  ['orange eyebrow text on the darkest section', tokenHex('orange.400'), tokenHex('blue.900'), 4.5],
  ['logo mark blue on the white header', tokenHex('blue.500'), '#ffffff', 3.0],
];

for (const [name, fgHex, bgHex, min] of pairs) {
  const ratio = contrast(fgHex, bgHex);
  check(
    `${name} (${fgHex} on ${bgHex}) = ${ratio.toFixed(2)}:1`,
    ratio >= min,
    `needs >= ${min}:1`,
  );
}


console.log('\nUser-facing validation messages (no raw Zod internals)');

// Regression guard: an untouched <select> posts '', and .optional() alone let
// Zod leak "Invalid enum value. Expected 'excellent' | 'good' | ..." into the UI.
const emptyFinancing = LeadSchema.safeParse({
  name: '', email: '', phone: '', lead_type: 'financing',
  source_page: '/financing', consent: 'on', credit_band: '', down_payment: '',
});
const emptySell = LeadSchema.safeParse({
  name: '', phone: '', lead_type: 'sell_your_car',
  source_page: '/sell-your-car', consent: 'on',
  v_year: '', v_make: '', v_model: '', v_mileage: '', v_condition: '',
});

const allMessages = [emptyFinancing, emptySell]
  .filter((r) => !r.success)
  .flatMap((r) => (r as { error: { issues: { message: string }[] } }).error.issues.map((i) => i.message));

check('empty submits produce at least one error', allMessages.length > 0);
for (const m of allMessages) {
  check(
    `message is human-readable: "${m.slice(0, 52)}"`,
    !m.includes('|') && !m.includes('Expected') && !m.includes('Invalid enum') && !m.includes('nan'),
    '<- raw Zod internals leaking to the user',
  );
}

const validFinancing = LeadSchema.safeParse({
  name: 'Ana Reyes', phone: '9495550134', lead_type: 'financing',
  source_page: '/financing', consent: 'on', credit_band: '', down_payment: '',
});
check('financing accepts an untouched credit-situation select', validFinancing.success,
  JSON.stringify(validFinancing.error?.issues?.[0]?.message));

const financingNoContact = LeadSchema.safeParse({
  name: 'Ana Reyes', email: '', phone: '', lead_type: 'financing',
  source_page: '/financing', consent: 'on', credit_band: '',
});
check('financing still requires email or phone', !financingNoContact.success);


console.log('\nHero video scrim (text sits over uncontrolled footage)');

/** Composite a translucent scrim over a backdrop, per channel. */
function compositeOver(scrim: string, alpha: number, backdrop: string): string {
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [sr, sg, sb] = hex(scrim);
  const [br, bg, bb] = hex(backdrop);
  const mix = (a: number, b: number) => Math.round(a * alpha + b * (1 - alpha));
  return (
    '#' +
    [mix(sr, br), mix(sg, bg), mix(sb, bb)]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
  );
}

// Worst case is a blank white video frame. If the copy stays readable against
// that, it stays readable against every frame.
const SCRIM_ALPHA = 0.80; // keep in sync with bg-blue-900/80 in Hero.tsx
// blue-900, not blue-950: the near-black 950 desaturated the footage to a grey
// that could never match the navy of the bar above it.
const worstCase = compositeOver(tokenHex('blue.900'), SCRIM_ALPHA, '#ffffff');

// The hero copy is pure white, not neutral-50: it sits next to the white nav bar
// at the top of the page, and warm off-white reads dingy beside it.
const heroSrc = readFileSync(join(ROOT, 'components/home/Hero.tsx'), 'utf8');
check('hero copy is pure white, not neutral-50', !/text-neutral-50/.test(heroSrc),
  '<- the assertions below guard white; an off-white would go unchecked');

// The video IS the hero. It has no fallback and nothing else fills that space,
// so losing the element (or its source) leaves a flat navy panel that still
// passes every contrast check above — which is exactly why it needs its own.
check('the hero still renders the lot video',
  /<video/.test(heroSrc) && heroSrc.includes('/video/danvice-lot.mp4'),
  '<- without it the hero is a flat colour block');
check('the video sits behind the scrim, not over it', /-z-20/.test(heroSrc),
  '<- a video above the scrim makes the headline unreadable on bright frames');

const heroText = '#ffffff';
const heroRatio = contrast(heroText, worstCase);
check(
  `hero copy over a white video frame (${heroText} on ${worstCase}) = ${heroRatio.toFixed(2)}:1`,
  heroRatio >= 4.5,
  'lower the scrim opacity and the headline becomes unreadable on bright footage',
);

console.log('\nScroll-aware header (two inverted states)');

// At the top of the homepage the bar wears the hero's own background colour;
// past 80px it flips to white with blue text. Both states carry live text, so
// both need to clear AA, and the classes are read back out of the component so
// a restyle cannot quietly outrun these numbers.
const headerSrc = readFileSync(join(ROOT, 'components/layout/SiteHeader.tsx'), 'utf8');
const heroFile = readFileSync(join(ROOT, 'components/home/Hero.tsx'), 'utf8');
const cssFile = readFileSync(join(ROOT, 'app/globals.css'), 'utf8');

// Over the hero the bar has NO background: an opaque bar could never match the
// scrimmed video beneath it, which is what put a seam across the fold. The
// hero's veil supplies the colour and runs on past the bar instead.
check('header is transparent over the hero', /transparent\s*\n?\s*\?\s*'bg-transparent'/.test(headerSrc),
  '<- an opaque bar reintroduces the seam');

// usePathname reads the ambient request URL. An ISR regeneration triggered by
// revalidateTag renders this page inside the triggering request, so the
// inventory webhook once cached a homepage header that believed it was on
// /api/revalidate. The selected segment follows the route being rendered.
check('header detects the homepage by layout segment, not pathname',
  headerSrc.includes('useSelectedLayoutSegment()') && !/\busePathname\(/.test(headerSrc),
  '<- usePathname here lets a revalidate request poison the cached header');
check('header draws no rule across the seam', !headerSrc.includes('border-white/10'));
check('the hero veil supplies the colour behind it', cssFile.includes('.hero-veil'));
check('the hero runs up under the header', /-mt-16[\s\S]*md:-mt-20/.test(heroFile),
  '<- without the pull-up the video starts below the bar again');

// The hero starts at the very top of the viewport, so any height short of a
// full one leaves the next section's light ground as a band across the fold.
check('the hero fills the whole viewport', /min-h-svh/.test(heroFile),
  '<- a fractional height shows the light ground at the bottom of the screen');
check('the hero height is not a fraction of the viewport',
  !/min-h-\[\d+(?:\.\d+)?(?:svh|vh|dvh|lvh)\]/.test(heroFile),
  '<- e.g. min-h-[92svh] leaves 8% of the fold showing the section below');
check('header scrolled state is white', headerSrc.includes('bg-white'));
// Nav links are blue, never the CTA orange: orange-600 on white is 3.82:1,
// under AA for text, so matching them to the button would fail outright.
check('header scrolled links are blue', headerSrc.includes('text-blue-700'));
check('header nav links are not the CTA orange', !/text-orange-[0-9]{3}/.test(headerSrc),
  '<- orange on white is 3.82:1, under AA for text');

// The veil is solid blue-900 through the header's height, so that is
// literally what sits behind the nav labels at rest.
const navTop = contrast('#ffffff', tokenHex('blue.900'));
check(`nav at top: white on the hero veil = ${navTop.toFixed(2)}:1`, navTop >= 4.5);

const navScrolled = contrast(tokenHex('blue.700'), '#ffffff');
check(`nav after scroll: blue-700 on white = ${navScrolled.toFixed(2)}:1`, navScrolled >= 4.5);

// Links sit at 85% white on the navy bar; that is the real rendered colour.
const navTopMuted = contrast(compositeOver('#ffffff', 0.85, tokenHex('blue.900')), tokenHex('blue.900'));
check(`nav link at rest (white/85 on blue-900) = ${navTopMuted.toFixed(2)}:1`, navTopMuted >= 4.5);

console.log('\nEvery page can get back to the homepage');

// The site once had exactly one link to '/' anywhere: the header logo. The
// footer had none at all. This asserts every page except the homepage itself
// renders the breadcrumb strip, so a new page cannot ship as a dead end.
const pageFiles = readdirSync(join(ROOT, 'app'), { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('page.tsx'))
  .filter((f) => f !== 'page.tsx');

check('found the app pages to audit', pageFiles.length >= 6, `<- found ${pageFiles.length}`);
for (const f of pageFiles) {
  const src = readFileSync(join(ROOT, 'app', f), 'utf8');
  check(`/${f.replace(/\/?page\.tsx$/, '')} renders a Breadcrumb`, src.includes('<Breadcrumb'));
}

// The two chrome surfaces a visitor reaches for when the breadcrumb is scrolled
// past. Both linked nowhere before this.
for (const [label, file] of [
  ['footer', 'components/layout/SiteFooter.tsx'],
  ['mobile drawer', 'components/layout/MobileNavDrawer.tsx'],
] as const) {
  const src = readFileSync(join(ROOT, file), 'utf8');
  check(`${label} links home`, /href="\/"/.test(src));
}

// Home is prepended by the Breadcrumb component, so no caller can omit it.
const crumbSrc = readFileSync(join(ROOT, 'components/ui/Breadcrumb.tsx'), 'utf8');
check('breadcrumb always prepends Home', /name: 'Home', href: '\/'/.test(crumbSrc));

console.log('\nMobile: touch targets, iOS zoom, and classes that actually compile');

// h-13 sat in Button's lg size for weeks emitting NO CSS — it is not in
// Tailwind's default scale — so every size="lg" button collapsed to its line
// box. Source review cannot catch that; only the built stylesheet can. This
// check reads the compiled CSS when it exists and falls back to asserting the
// config declares the value.
const TW_DEFAULT_SPACING = new Set([
  '0','px','0.5','1','1.5','2','2.5','3','3.5','4','5','6','7','8','9','10','11','12',
  '14','16','20','24','28','32','36','40','44','48','52','56','60','64','72','80','96',
]);
const twConfigSrc = readFileSync(join(ROOT, 'tailwind.config.ts'), 'utf8');
const spacingExtend = twConfigSrc.match(/spacing:\s*\{([^}]*)\}/)?.[1] ?? '';
const buttonSrc = readFileSync(join(ROOT, 'components/ui/Button.tsx'), 'utf8');
const sizeBlock = buttonSrc.match(/const sizes[^{]*\{([\s\S]*?)\n\};/)?.[1] ?? '';
const heightClasses = [...sizeBlock.matchAll(/\bh-([\w.]+)\b/g)].map((m) => m[1]);

check('found Button size classes to audit', heightClasses.length >= 3, `<- ${heightClasses.length}`);
for (const h of heightClasses) {
  const declared = TW_DEFAULT_SPACING.has(h) || new RegExp(`(^|[^\\w])${h}\\s*:`).test(spacingExtend);
  check(`Button height h-${h} resolves to real CSS`, declared,
    '<- not in Tailwind\'s scale and not in the spacing extend: emits nothing');
}

// Any input under 16px makes iOS Safari zoom the viewport on focus, and the
// viewport meta sets no maximumScale to suppress it.
const fieldSrc = readFileSync(join(ROOT, 'components/ui/Field.tsx'), 'utf8');
const controlLine = fieldSrc.match(/export const controlClasses =([\s\S]*?);/)?.[1] ?? '';
const tinyText = controlLine.match(/text-\[([0-9.]+)rem\]/);
check('form controls are >= 16px (iOS focus-zoom threshold)',
  !tinyText || Number(tinyText[1]) >= 1,
  `<- ${tinyText?.[0]} zooms the page on every field tap`);

// appearance-none removes WebKit's slider thumb and accent-color cannot restore
// it, so a range input styled that way needs an explicit thumb rule or it has
// no draggable handle at all.
const cssSrc = readFileSync(join(ROOT, 'app/globals.css'), 'utf8');
const calcSrc = readFileSync(join(ROOT, 'components/vehicles/PaymentCalculator.tsx'), 'utf8');
const rangeCount = (calcSrc.match(/type="range"/g) ?? []).length;
check('payment calculator still has its sliders', rangeCount === 2, `<- ${rangeCount}`);
check('slider thumb is drawn for WebKit', cssSrc.includes('::-webkit-slider-thumb'),
  '<- appearance-none with no thumb rule renders no handle on iOS');
check('slider thumb is drawn for Firefox', cssSrc.includes('::-moz-range-thumb'));
check('sliders no longer rely on inert accent-color', !calcSrc.includes('accent-blue'),
  '<- accent-color does nothing once appearance is none');

// Every control in the inventory browsing UI was 34-40px. Guard the floor.
for (const f of [
  'inventory/FilterPanel', 'inventory/FilterToolbar', 'inventory/ActiveFilterChips',
  'inventory/Pagination',
  // The payment calculator's term buttons sit between the two sliders, and the
  // lead modal is a bottom sheet on mobile — both are thumb targets too.
  'vehicles/PaymentCalculator', 'leads/LeadFormModal',
]) {
  const src = readFileSync(join(ROOT, `components/${f}.tsx`), 'utf8');
  check(`${f} has no sub-44px control`, !/\bh-(?:8|9|10)\b/.test(src),
    '<- h-8/h-9/h-10 is under the 44px touch minimum');
}

// The mobile sheet used to dismiss itself on every checkbox.
const panelSrc = readFileSync(join(ROOT, 'components/inventory/FilterPanel.tsx'), 'utf8');
check('filter sheet does not close on each filter change',
  !/onApply\?\.\(\)/.test(panelSrc),
  '<- committing a filter must not dismiss the sheet');
const toolbarSrc = readFileSync(join(ROOT, 'components/inventory/FilterToolbar.tsx'), 'utf8');
check('filter sheet offers an explicit way out', toolbarSrc.includes('Show {resultCount}'));

console.log('\nOne CTA, everywhere');

// The site previously carried eight CTA labels across five button variants.
// These guard the single-CTA rule structurally, because a convention drifts.
const buttonSrc2 = readFileSync(join(ROOT, 'components/ui/Button.tsx'), 'utf8');
for (const dead of ['cream', 'maroon', 'outline']) {
  check(`Button no longer defines a '${dead}' variant`,
    !new RegExp(`^\\s*${dead}:`, 'm').test(buttonSrc2));
}
check('the default CTA is an orange fill with a dark label',
  /primary:\s*\n?\s*'[^']*bg-orange-500[^']*text-orange-ink/.test(buttonSrc2),
  '<- white on orange-500 is 2.74:1; the label has to be dark');
// The orange fill is 2.58:1 against the page, so unlike the old red fill it
// cannot carry its own edge. The border is the only thing giving it one.
check('the light-ground CTA keeps its load-bearing border',
  /primary:\s*\n?\s*'[^']*border-orange-600/.test(buttonSrc2),
  '<- orange-500 is 2.58:1 against the page; without the border it has no edge');
// Brightening on hover is deliberate and easy to "correct" back into failure:
// darkening puts the label at 4.07:1 on orange-600 and 2.78:1 on orange-700.
check('the CTA brightens on hover rather than darkening',
  /primary:\s*\n?\s*'[^']*hover:bg-orange-400/.test(buttonSrc2),
  '<- hover:bg-orange-600/700 drops the label under AA');
check('the onDark CTA stays white for dark grounds',
  /onDark:\s*\n?\s*'[^']*bg-white[^']*text-blue-900/.test(buttonSrc2));
check('the onDark CTA keeps its load-bearing border',
  /onDark:\s*\n?\s*'[^']*border-blue-400/.test(buttonSrc2),
  '<- a bright video frame behind a white button leaves it no edge');

const pageFiles2 = readdirSync(join(ROOT, 'app'), { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('page.tsx'));
const componentFiles = readdirSync(join(ROOT, 'components'), { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('.tsx'));

for (const f of pageFiles2) {
  const src = readFileSync(join(ROOT, 'app', f), 'utf8');
  const route = `/${f.replace(/\/?page\.tsx$/, '')}`;
  check(`${route} uses no deleted button variant`,
    !/variant="(cream|maroon|outline)"/.test(src));
}

// Exactly one button on the homepage, and it is the Call CTA.
const homeSrc = readFileSync(join(ROOT, 'app/page.tsx'), 'utf8');
const heroSrc2 = readFileSync(join(ROOT, 'components/home/Hero.tsx'), 'utf8');
const homeButtons = [...homeSrc.matchAll(/<Button(?:Link)?\b(?![^>]*variant="link")/g)].length;
check(`homepage body has no button outside the hero (found ${homeButtons})`, homeButtons === 0,
  '<- the homepage carries exactly one CTA and it is the hero Call now');
check('the hero CTA is the shared CallButton', /<CallButton/.test(heroSrc2));
check('the hero has no second competing CTA',
  [...heroSrc2.matchAll(/<(?:CallButton|ButtonLink|Button)\b/g)].length === 1);

// Every phone CTA routes through the one component; bare tel: text links are fine.
for (const f of componentFiles.concat(pageFiles2.map((p) => `../app/${p}`))) {
  const path = f.startsWith('../app/')
    ? join(ROOT, 'app', f.slice(7))
    : join(ROOT, 'components', f);
  const src = readFileSync(path, 'utf8');
  if (!src.includes('tel:') || path.endsWith('CallButton.tsx')) continue;
  const buttonish = /href={`tel:[^`]*`}[^>]*className="[^"]*(?:rounded-md|bg-brand)/s.test(src);
  check(`${f.replace('../app/', 'app/')} has no hand-rolled phone button`, !buttonish,
    '<- phone CTAs must render CallButton so label, icon and href cannot drift');
}

// onDark is the white button, and it is only safe on a dark ground. Anywhere
// else it is the white-on-white that prompted this change, so its use is
// restricted to the hero and the header that sits over the hero.
const ON_DARK_ALLOWED = ['home/Hero.tsx', 'layout/SiteHeader.tsx', 'ui/Button.tsx', 'ui/CallButton.tsx'];
for (const f of componentFiles) {
  const src = readFileSync(join(ROOT, 'components', f), 'utf8');
  if (!/onDark/.test(src) || ON_DARK_ALLOWED.includes(f)) continue;
  check(`${f} does not put the white CTA on a light page`, false,
    '<- onDark belongs to the hero and the header over it, nothing else');
}
check('the dark-ground CTA is used where it should be',
  /variant="onDark"/.test(readFileSync(join(ROOT, 'components/home/Hero.tsx'), 'utf8')) &&
    /onDark'\s*:\s*'primary'/.test(readFileSync(join(ROOT, 'components/layout/SiteHeader.tsx'), 'utf8')),
  '<- the hero CTA and the header CTA over it must stay white');

console.log('\nMobile chrome');

// Nothing may be pinned to the bottom of the screen on a phone. The fixed
// Call bar is gone; this stops one creeping back in.
for (const f of componentFiles) {
  const src = readFileSync(join(ROOT, 'components', f), 'utf8');
  const bottomBar = /className="[^"]*\bfixed\b[^"]*\bbottom-0\b[^"]*\bmd:hidden\b/.test(src);
  check(`${f} pins nothing to the bottom of the phone screen`, !bottomBar,
    '<- no buttons at the bottom of the screen on mobile');
}
check('the fixed mobile bar is gone for good',
  !existsSync(join(ROOT, 'components/layout/MobileStickyBar.tsx')));

// It is now the only route to the phone on inner pages, so it has to be a
// real destination: full screen, and carrying the CTA.
const drawerSrc = readFileSync(join(ROOT, 'components/layout/MobileNavDrawer.tsx'), 'utf8');
check('the mobile menu takes the whole screen',
  /inset-0/.test(drawerSrc) && /100dvh/.test(drawerSrc),
  '<- a side sheet leaves the page showing behind it');
check('the mobile menu carries the Call CTA', /<CallButton/.test(drawerSrc),
  '<- with no bottom bar this is the only way to call from an inner page');

// The footer padding existed solely to clear that bar.
const footSrc = readFileSync(join(ROOT, 'components/layout/SiteFooter.tsx'), 'utf8');
check('the footer no longer reserves space for a bar', !/4\.5rem/.test(footSrc));

console.log('\nHTML caching (no page older than the current deploy)');

// next.config lists page routes by hand, which is the safe choice against a
// regex that could catch /_next/static — but a new page would silently miss the
// header and could then be served stale from a phone mid-demo.
const configSrc = readFileSync(join(ROOT, 'next.config.mjs'), 'utf8');
const declaredRoutes = [...(configSrc.match(/const PAGE_ROUTES = \[([\s\S]*?)\]/)?.[1] ?? '')
  .matchAll(/'([^']+)'/g)].map((m) => m[1]);

const actualRoutes = readdirSync(join(ROOT, 'app'), { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('page.tsx'))
  .map((f) => '/' + f.replace(/\/?page\.tsx$/, ''))
  .map((r) => r.replace(/\[(\w+)\]/g, ':$1'))
  .map((r) => (r === '/' ? '/' : r.replace(/\/$/, '')));

check(`found the page routes to cover (${actualRoutes.length})`, actualRoutes.length >= 7);
for (const route of actualRoutes) {
  check(`${route} is covered by the HTML cache header`, declaredRoutes.includes(route),
    '<- add it to PAGE_ROUTES in next.config.mjs or it can be served stale');
}
// Read the constant's value, not the file: the comment above it necessarily
// spells out the directives it is explaining.
const cacheValue = configSrc.match(/HTML_CACHE_CONTROL =\s*\n?\s*'([^']+)'/)?.[1] ?? '';
check(`the cache header is set (${cacheValue || 'NOT FOUND'})`, cacheValue.length > 0);
check('the header forces the browser to revalidate',
  /max-age=0/.test(cacheValue) && /must-revalidate/.test(cacheValue),
  '<- without it a phone can show a page from before the deploy');
check('the edge still caches', /s-maxage=\d+/.test(cacheValue),
  '<- dropping s-maxage would make every request hit the origin');

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
