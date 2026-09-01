create table public.vehicles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null,
  stock_number    text not null,
  vin             text,

  year            smallint not null,
  make            text not null,
  model           text not null,
  trim_level      text,          -- not "trim": TRIM is a SQL function name

  price           integer not null,   -- whole US dollars; this inventory has no cents
  previous_price  integer,            -- non-null => render a price-drop badge
  mileage         integer not null,

  body_type       public.body_type    not null,
  transmission    public.transmission not null,
  drivetrain      public.drivetrain   not null,
  fuel_type       public.fuel_type    not null default 'gasoline',

  exterior_color  text,
  interior_color  text,
  doors           smallint,
  seats           smallint,
  engine          text,
  cylinders       smallint,
  mpg_city        smallint,
  mpg_highway     smallint,

  images          text[] not null default '{}',
  image_credits   jsonb  not null default '[]'::jsonb,
  description     text,
  features        text[] not null default '{}',

  status          public.vehicle_status not null default 'available',
  is_featured     boolean not null default false,
  date_listed     date not null default current_date,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Two constraints on this expression, both learned the hard way:
  --   * 'english'::regconfig is required. The untyped literal resolves as
  --     STABLE, and a generated column demands IMMUTABLE.
  --   * Enum columns are excluded: enum->text is STABLE because labels can be
  --     renamed. Body and fuel are filtered via dedicated indexes instead.
  search_vector tsvector generated always as (
    to_tsvector('english'::regconfig,
      coalesce(year::text,'')     || ' ' ||
      coalesce(make,'')           || ' ' ||
      coalesce(model,'')          || ' ' ||
      coalesce(trim_level,'')     || ' ' ||
      coalesce(exterior_color,'')
    )
  ) stored,

  constraint vehicles_slug_key         unique (slug),
  constraint vehicles_stock_number_key unique (stock_number),
  constraint vehicles_vin_key          unique (vin),
  constraint vehicles_slug_format      check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint vehicles_vin_len          check (vin is null or char_length(vin) = 17),
  constraint vehicles_year_range       check (year between 1980 and 2100),
  constraint vehicles_price_pos        check (price > 0 and price < 1000000),
  constraint vehicles_prev_price_gt    check (previous_price is null or previous_price > price),
  constraint vehicles_mileage_nonneg   check (mileage >= 0 and mileage < 1000000),
  constraint vehicles_images_len       check (array_length(images,1) is null or array_length(images,1) <= 24)
);

comment on column public.vehicles.images is
  'Ordered image refs. "/vehicles/<slug>/01.jpg" (local) or "https://host/path.jpg" (remote; host must be in lib/image-hosts.mjs). First element is the hero image.';

-- Every public query is scoped to status='available', so partial indexes are
-- both smaller and an exact match for the access pattern.
create index vehicles_avail_created_idx on public.vehicles (created_at desc) where status = 'available';
create index vehicles_avail_price_idx   on public.vehicles (price)           where status = 'available';
create index vehicles_avail_mileage_idx on public.vehicles (mileage)         where status = 'available';
create index vehicles_avail_year_idx    on public.vehicles (year desc)       where status = 'available';
create index vehicles_avail_make_idx    on public.vehicles (make)            where status = 'available';
create index vehicles_avail_body_idx    on public.vehicles (body_type)       where status = 'available';
create index vehicles_featured_idx      on public.vehicles (created_at desc) where status = 'available' and is_featured;
create index vehicles_features_gin      on public.vehicles using gin (features);
create index vehicles_search_gin        on public.vehicles using gin (search_vector);

create trigger vehicles_set_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();
