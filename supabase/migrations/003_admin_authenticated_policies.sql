-- ============================================================================
-- Noir Cocktail Bar - Authenticated admin policies
--
-- Gli account creati in Supabase Auth sono considerati amministratori.
-- anon mantiene esclusivamente i permessi pubblici definiti nelle migrazioni
-- precedenti; authenticated può gestire i contenuti dell'area admin.
-- ============================================================================

begin;

alter table public.bookings enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.events enable row level security;
alter table public.gallery_images enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Authenticated admins can manage bookings"
  on public.bookings;
create policy "Authenticated admins can manage bookings"
on public.bookings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can manage menu categories"
  on public.menu_categories;
create policy "Authenticated admins can manage menu categories"
on public.menu_categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can manage menu items"
  on public.menu_items;
create policy "Authenticated admins can manage menu items"
on public.menu_items
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can manage events"
  on public.events;
create policy "Authenticated admins can manage events"
on public.events
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can manage gallery"
  on public.gallery_images;
create policy "Authenticated admins can manage gallery"
on public.gallery_images
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can manage site settings"
  on public.site_settings;
create policy "Authenticated admins can manage site settings"
on public.site_settings
for all
to authenticated
using (true)
with check (true);

grant select, insert, update, delete
on table public.bookings
to authenticated;

grant select, insert, update, delete
on table public.menu_categories
to authenticated;

grant select, insert, update, delete
on table public.menu_items
to authenticated;

grant select, insert, update, delete
on table public.events
to authenticated;

grant select, insert, update, delete
on table public.gallery_images
to authenticated;

grant select, insert, update, delete
on table public.site_settings
to authenticated;

commit;
