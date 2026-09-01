-- security invoker => RLS applies => only 'available' rows are ever counted.
create or replace function public.inventory_facets()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'makes', (
      select coalesce(jsonb_agg(jsonb_build_object('value', make, 'count', c) order by make), '[]'::jsonb)
      from (select make, count(*) c from public.vehicles where status='available' group by make) s
    ),
    'bodyTypes', (
      select coalesce(jsonb_agg(jsonb_build_object('value', body_type, 'count', c) order by body_type), '[]'::jsonb)
      from (select body_type, count(*) c from public.vehicles where status='available' group by body_type) s
    ),
    'priceMin',   (select min(price)   from public.vehicles where status='available'),
    'priceMax',   (select max(price)   from public.vehicles where status='available'),
    'yearMin',    (select min(year)    from public.vehicles where status='available'),
    'yearMax',    (select max(year)    from public.vehicles where status='available'),
    'mileageMax', (select max(mileage) from public.vehicles where status='available'),
    'total',      (select count(*)     from public.vehicles where status='available')
  );
$$;

grant execute on function public.inventory_facets() to anon, authenticated;
