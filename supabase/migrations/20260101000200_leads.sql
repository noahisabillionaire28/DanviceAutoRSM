create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  name          text not null,
  email         text,
  phone         text,
  message       text,

  lead_type     public.lead_type not null default 'general',
  vehicle_id    uuid references public.vehicles(id) on delete set null,
  source_page   text not null default '/',
  consent       boolean not null default false,

  -- financing:     {credit_band, down_payment}
  -- sell_your_car: {year, make, model, mileage, condition}
  details       jsonb not null default '{}'::jsonb,

  status        public.lead_status not null default 'new',
  internal_note text,

  user_agent    text,
  referrer      text,
  ip_hash       text,  -- sha256(ip + LEAD_SALT); a raw IP is never stored

  constraint leads_name_len     check (char_length(btrim(name)) between 2 and 80),
  constraint leads_email_fmt    check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'),
  constraint leads_phone_fmt    check (phone is null or char_length(regexp_replace(phone,'\D','','g')) between 10 and 15),
  constraint leads_contact_req  check (email is not null or phone is not null),
  constraint leads_message_len  check (message is null or char_length(message) <= 2000),
  constraint leads_details_obj  check (jsonb_typeof(details) = 'object'),
  constraint leads_details_size check (pg_column_size(details) < 4096),
  constraint leads_consent_true check (consent = true)
);

create index leads_created_idx on public.leads (created_at desc);
create index leads_type_idx    on public.leads (lead_type, created_at desc);
create index leads_vehicle_idx on public.leads (vehicle_id) where vehicle_id is not null;
create index leads_status_idx  on public.leads (status) where status = 'new';
create index leads_iphash_idx  on public.leads (ip_hash, created_at desc);
