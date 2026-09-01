-- ── VEHICLES: public read, available rows only ───────────────────────────────
alter table public.vehicles enable row level security;
-- force: without this the owner/migration role bypasses policies, so a local
-- "the policy works" test would be a false pass.
alter table public.vehicles force row level security;

revoke all on public.vehicles from anon, authenticated;
-- Grants and RLS are INDEPENDENT gates. A perfect policy still fails with
-- "permission denied" if the role has no grant.
grant select on public.vehicles to anon, authenticated;

create policy "vehicles_public_read_available"
  on public.vehicles
  for select
  to anon, authenticated
  using (status = 'available');
-- No insert/update/delete policies => all anon writes denied.


-- ── LEADS: insert-only, never readable ───────────────────────────────────────
alter table public.leads enable row level security;
alter table public.leads force row level security;

revoke all on public.leads from anon, authenticated;

-- Column-level grant: anon physically cannot supply status, ip_hash,
-- internal_note, id, or created_at. Rejected at the GRANT layer before RLS is
-- even consulted — stronger and simpler than policing them in WITH CHECK.
grant insert (name, email, phone, message, lead_type, vehicle_id,
              source_page, consent, details, user_agent, referrer)
  on public.leads to anon, authenticated;

create policy "leads_anon_insert_only"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    consent = true
    and char_length(btrim(name)) between 2 and 80
    and (email is not null or phone is not null)
    and (message is null or char_length(message) <= 2000)
    -- FK checks bypass RLS, so without this exists() anon could attach a lead
    -- to a sold/hidden vehicle it cannot see (an enumeration oracle). The
    -- subquery runs as invoker, so it inherits the 'available' policy above.
    and (
      vehicle_id is null
      or exists (select 1 from public.vehicles v where v.id = vehicle_id)
    )
  );
-- Deliberately NO select/update/delete policy => only service_role reads leads.
-- RLS enabled with zero policies is deny-all, which is the desired state.
--
-- CONSEQUENCE: never chain .select() on the anon leads insert. It sets
-- Prefer: return=representation, making PostgREST run INSERT ... RETURNING;
-- RETURNING is a read, so the statement fails with 42501. Verified live.
