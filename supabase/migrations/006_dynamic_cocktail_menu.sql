-- ============================================================================
-- Noir Cocktail Bar - Menu cocktail dinamico
-- Aggiunge il modello pubblico richiesto mantenendo i campi legacy.
-- ============================================================================

begin;

alter table public.menu_items
  add column if not exists slug text,
  add column if not exists category text,
  add column if not exists alcohol_level text,
  add column if not exists display_order integer not null default 0;

update public.menu_items as item
set
  category = coalesce(
    nullif(btrim(item.category), ''),
    category.name,
    'Cocktail'
  ),
  display_order = case
    when item.display_order = 0 then item.sort_order
    else item.display_order
  end
from public.menu_categories as category
where item.category_id = category.id;

update public.menu_items
set category = 'Cocktail'
where category is null or btrim(category) = '';

update public.menu_items
set display_order = sort_order
where display_order = 0 and sort_order <> 0;

update public.menu_items
set slug =
  trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
  || '-' || left(id::text, 8)
where slug is null or btrim(slug) = '';

alter table public.menu_items
  alter column slug set not null,
  alter column category set not null;

create unique index if not exists idx_menu_items_slug
  on public.menu_items (slug);

create index if not exists idx_menu_items_public_display
  on public.menu_items (is_available, is_featured, display_order, created_at);

alter table public.menu_items enable row level security;

drop policy if exists "Public can read available menu items"
  on public.menu_items;
create policy "Public can read available menu items"
on public.menu_items
for select
to anon, authenticated
using (is_available = true);

drop policy if exists "Authenticated admins can manage menu items"
  on public.menu_items;
create policy "Authenticated admins can manage menu items"
on public.menu_items
for all
to authenticated
using (true)
with check (true);

grant select on table public.menu_items to anon;
grant select, insert, update, delete
on table public.menu_items
to authenticated;

commit;
