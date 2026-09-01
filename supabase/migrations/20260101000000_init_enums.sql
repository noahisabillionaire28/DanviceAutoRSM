create extension if not exists pgcrypto;

create type public.vehicle_status as enum ('available','pending','sold','hidden');
create type public.body_type     as enum ('sedan','suv','truck','coupe','hatchback','minivan','wagon','convertible');
create type public.transmission  as enum ('automatic','manual','cvt','dual_clutch');
create type public.drivetrain    as enum ('fwd','rwd','awd','4wd');
create type public.fuel_type     as enum ('gasoline','hybrid','plug_in_hybrid','electric','diesel','flex_fuel');
create type public.lead_type     as enum ('general','financing','sell_your_car','vehicle_inquiry');
create type public.lead_status   as enum ('new','contacted','qualified','closed','spam');

-- search_path is pinned: an unpinned search_path on a trigger function is a
-- privilege-escalation vector if it is ever made security definer.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end $$;
