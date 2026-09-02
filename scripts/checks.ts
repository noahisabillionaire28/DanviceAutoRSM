import { LeadSchema } from '@/lib/schemas/lead';
import { estimateMonthlyPayment } from '@/lib/payment';
import { parseFilters, serializeFilters } from '@/lib/filters';
import { resolveVehicleImage } from '@/lib/images';
import { readFileSync } from 'node:fs';
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
// Colour contrast. The brand palette is red-on-cream, where it is easy to pick
// a tone that looks right and fails WCAG. These assert the real pairs used in
// the UI, read from tailwind.config.ts and globals.css so the check cannot
// silently drift from the palette it is meant to guard.
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
  ['CTA label on CTA fill', accentFg, accent, 4.5],
  ['CTA label on CTA hover fill', tokenHex('brand-ink'), tokenHex('brand.600'), 4.5],
  ['cream text on darkest section', tokenHex('cream.50'), tokenHex('maroon.900'), 4.5],
  ['cream text on deep section', tokenHex('cream.50'), tokenHex('maroon.700'), 4.5],
  ['heading on tinted panel', tokenHex('maroon.900'), tokenHex('cream.100'), 4.5],
  // Dark sections invert to a cream CTA: red-on-red only reaches 2.86:1.
  ['inverted CTA fill against darkest section', tokenHex('cream.50'), tokenHex('maroon.900'), 3.0],
  ['inverted CTA label on its fill', tokenHex('maroon.900'), tokenHex('cream.50'), 4.5],
  ['red CTA fill against page background', accent, bg, 3.0],
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
const SCRIM_ALPHA = 0.75; // keep in sync with bg-maroon-950/75 in Hero.tsx
const worstCase = compositeOver(tokenHex('maroon.950'), SCRIM_ALPHA, '#ffffff');

// The hero copy is pure white, not cream-50: it sits next to the white nav bar
// at the top of the page, and warm off-white reads dingy beside it.
const heroSrc = readFileSync(join(ROOT, 'components/home/Hero.tsx'), 'utf8');
check('hero copy is pure white, not cream-50', !/text-cream-50/.test(heroSrc),
  '<- the assertions below guard white; cream would go unchecked');

const heroText = '#ffffff';
const heroRatio = contrast(heroText, worstCase);
check(
  `hero copy over a white video frame (${heroText} on ${worstCase}) = ${heroRatio.toFixed(2)}:1`,
  heroRatio >= 4.5,
  'lower the scrim opacity and the headline becomes unreadable on bright footage',
);

console.log('\nScroll-aware header (two inverted states)');

// At the top of the homepage the bar wears the hero's own background colour;
// past 80px it flips to white with red text. Both states carry live text, so
// both need to clear AA, and the classes are read back out of the component so
// a restyle cannot quietly outrun these numbers.
const headerSrc = readFileSync(join(ROOT, 'components/layout/SiteHeader.tsx'), 'utf8');
check('header top state uses the hero background', headerSrc.includes('bg-maroon-900'));
check('header scrolled state is white', headerSrc.includes('bg-white'));
check('header scrolled links are brand red', headerSrc.includes('text-brand-600'));

const navTop = contrast('#ffffff', tokenHex('maroon.900'));
check(`nav at top: white on maroon-900 = ${navTop.toFixed(2)}:1`, navTop >= 4.5);

const navScrolled = contrast(tokenHex('brand.600'), '#ffffff');
check(`nav after scroll: brand-600 on white = ${navScrolled.toFixed(2)}:1`, navScrolled >= 4.5);

// Links sit at 85% white on the red bar; that is the real rendered colour.
const navTopMuted = contrast(compositeOver('#ffffff', 0.85, tokenHex('maroon.900')), tokenHex('maroon.900'));
check(`nav link at rest (white/85 on maroon-900) = ${navTopMuted.toFixed(2)}:1`, navTopMuted >= 4.5);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
