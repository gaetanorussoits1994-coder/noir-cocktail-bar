-- ============================================================================
-- Noir Cocktail Bar - Unificazione prenotazioni pubbliche e admin
-- Mantiene compatibilità con le colonne legacy customer_phone/customer_email
-- e sposta il flusso corrente sulla tabella public.reservations.
-- ============================================================================

begin;

alter table public.reservations
  add column if not exists phone text,
  add column if not exists email text;

update public.reservations
set
  phone = coalesce(phone, customer_phone),
  email = coalesce(email, customer_email)
where phone is null or email is null;

alter table public.reservations
  alter column phone set not null,
  alter column customer_phone drop not null;

alter table public.reservations
  drop constraint if exists reservations_status_check;

alter table public.reservations
  add constraint reservations_status_check
  check (status in ('pending', 'confirmed', 'rejected', 'cancelled'));

alter table public.reservations enable row level security;

drop policy if exists "Public can create pending reservations"
  on public.reservations;
create policy "Public can create pending reservations"
on public.reservations
for insert
to anon
with check (status = 'pending');

drop policy if exists "Authenticated admins can manage reservations"
  on public.reservations;
create policy "Authenticated admins can manage reservations"
on public.reservations
for all
to authenticated
using (true)
with check (true);

revoke all privileges on table public.reservations
  from public, anon, authenticated;

grant insert (
  customer_name,
  phone,
  email,
  reservation_date,
  reservation_time,
  guests,
  notes,
  status
) on table public.reservations to anon;

grant select, insert, update, delete
on table public.reservations
to authenticated;

-- Conserva nello storico unificato le richieste già presenti in bookings.
insert into public.reservations (
  id,
  customer_name,
  phone,
  email,
  reservation_date,
  reservation_time,
  guests,
  notes,
  status,
  created_at,
  updated_at
)
select
  id,
  customer_name,
  phone,
  email,
  booking_date,
  booking_time,
  guests,
  notes,
  status,
  created_at,
  updated_at
from public.bookings
on conflict (id) do nothing;

create index if not exists idx_reservations_admin_order
  on public.reservations (reservation_date, reservation_time, created_at);

commit;
