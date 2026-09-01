import { LeadSchema } from '@/lib/schemas/lead';
import { estimateMonthlyPayment } from '@/lib/payment';
import { parseFilters, serializeFilters } from '@/lib/filters';
import { resolveVehicleImage } from '@/lib/images';

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

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
