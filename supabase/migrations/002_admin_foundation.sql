-- ============================================================================
-- Noir Cocktail Bar - Admin foundation
-- Struttura dati per prenotazioni, menu e gestione contenuti.
--
-- Questa migrazione è incrementale: conserva le colonne già utilizzate dal
-- sito pubblico e aggiunge il modello richiesto dalla futura area admin.
-- ============================================================================

begin;

create extension if not exists pgcrypto;

-- Funzione condivisa per mantenere updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 1. Prenotazioni tavoli
-- ============================================================================

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  guests integer not null,
  booking_date date not null,
  booking_time time without time zone not null,
  status text not null default 'pending',
  notes text,
  admin_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_customer_name_not_blank
    check (btrim(customer_name) <> ''),
  constraint bookings_phone_not_blank
    check (btrim(phone) <> ''),
  constraint bookings_guests_positive
    check (guests > 0),
  constraint bookings_status_check
    check (status in ('pending', 'confirmed', 'rejected', 'cancelled'))
);

create index if not exists idx_bookings_date_time
  on public.bookings (booking_date, booking_time);

create index if not exists idx_bookings_status_created_at
  on public.bookings (status, created_at desc);

-- ============================================================================
-- 2. Categorie del menu
-- ============================================================================

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_categories_name_not_blank
    check (btrim(name) <> ''),
  constraint menu_categories_slug_not_blank
    check (btrim(slug) <> '')
);

create index if not exists idx_menu_categories_public_order
  on public.menu_categories (sort_order, id)
  where is_active = true;

-- ============================================================================
-- 3. Elementi del menu
-- ============================================================================

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid
    references public.menu_categories (id)
    on delete cascade,
  name text not null,
  description text,
  ingredients text,
  price numeric(10, 2),
  image_url text,
  tags text[] not null default '{}'::text[],
  is_featured boolean not null default false,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_items_name_not_blank
    check (btrim(name) <> ''),
  constraint menu_items_price_non_negative
    check (price is null or price >= 0)
);

create index if not exists idx_menu_items_category_order
  on public.menu_items (category_id, sort_order, id)
  where is_available = true;

create index if not exists idx_menu_items_featured
  on public.menu_items (sort_order, id)
  where is_available = true and is_featured = true;

-- ============================================================================
-- 4. Eventi
-- La tabella esiste già nel sito pubblico. Aggiungiamo event_time e rendiamo
-- slug facoltativo, così il futuro form admin può usare i campi richiesti.
-- Le colonne legacy frequency, slug, sort_order e updated_at restano disponibili.
-- ============================================================================

alter table public.events
  add column if not exists event_time time without time zone;

alter table public.events
  alter column slug drop not null;

-- ============================================================================
-- 5. Gallery
-- La tabella esistente contiene già tutti i campi richiesti. Manteniamo anche
-- category, aspect_ratio e updated_at, già utilizzati dal frontend.
-- ============================================================================

alter table public.gallery_images
  add column if not exists updated_at timestamptz not null default now();

-- ============================================================================
-- 6. Impostazioni sito
-- Il sito usa oggi una riga CMS estesa. Aggiungiamo key/value senza rimuovere
-- le colonne Hero e contatti, così il frontend corrente continua a funzionare.
-- ============================================================================

drop index if exists public.idx_site_settings_singleton;

alter table public.site_settings
  add column if not exists key text,
  add column if not exists value text;

with ranked_settings as (
  select
    id,
    row_number() over (order by created_at, id) as position
  from public.site_settings
  where key is null
)
update public.site_settings as settings
set key = case
  when ranked.position = 1 then 'general'
  else 'legacy-' || settings.id::text
end
from ranked_settings as ranked
where settings.id = ranked.id;

alter table public.site_settings
  alter column key set not null,
  alter column site_name drop not null;

create unique index if not exists idx_site_settings_key
  on public.site_settings (key);

-- ============================================================================
-- Trigger updated_at
-- ============================================================================

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists set_menu_categories_updated_at
  on public.menu_categories;
create trigger set_menu_categories_updated_at
before update on public.menu_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_images_updated_at
  on public.gallery_images;
create trigger set_gallery_images_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at
  on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

revoke execute on function public.set_updated_at() from public;
revoke execute on function public.set_updated_at() from anon;
revoke execute on function public.set_updated_at() from authenticated;

-- ============================================================================
-- Row Level Security
-- Le operazioni amministrative restano disponibili soltanto tramite service
-- role. I visitatori possono leggere i contenuti visibili e creare bookings.
-- ============================================================================

alter table public.bookings enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.events enable row level security;
alter table public.gallery_images enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can create pending bookings"
  on public.bookings;
create policy "Public can create pending bookings"
on public.bookings
for insert
to anon, authenticated
with check (
  status = 'pending'
  and admin_message is null
);

drop policy if exists "Public can read active menu categories"
  on public.menu_categories;
create policy "Public can read active menu categories"
on public.menu_categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read available menu items"
  on public.menu_items;
create policy "Public can read available menu items"
on public.menu_items
for select
to anon, authenticated
using (
  is_available = true
  and (
    category_id is null
    or exists (
      select 1
      from public.menu_categories as category
      where category.id = menu_items.category_id
        and category.is_active = true
    )
  )
);

drop policy if exists "Public can read active events"
  on public.events;
create policy "Public can read active events"
on public.events
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active gallery images"
  on public.gallery_images;
create policy "Public can read active gallery images"
on public.gallery_images
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read site settings"
  on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

-- Permessi minimi per anon/authenticated. RLS applica anche i filtri sopra.
revoke all privileges on table public.bookings
  from public, anon, authenticated;
revoke all privileges on table public.menu_categories
  from public, anon, authenticated;
revoke all privileges on table public.menu_items
  from public, anon, authenticated;
revoke all privileges on table public.events
  from public, anon, authenticated;
revoke all privileges on table public.gallery_images
  from public, anon, authenticated;
revoke all privileges on table public.site_settings
  from public, anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on table public.menu_categories to anon, authenticated;
grant select on table public.menu_items to anon, authenticated;
grant select on table public.events to anon, authenticated;
grant select on table public.gallery_images to anon, authenticated;
grant select on table public.site_settings to anon, authenticated;

grant insert (
  customer_name,
  phone,
  email,
  guests,
  booking_date,
  booking_time,
  notes
) on table public.bookings to anon, authenticated;

-- ============================================================================
-- Seed categorie iniziali
-- UUID e upsert rendono il seed rieseguibile.
-- ============================================================================

insert into public.menu_categories (
  id,
  name,
  slug,
  description,
  sort_order,
  is_active
)
values
  (
    '70000000-0000-4000-8000-000000000001',
    'Cocktail Signature',
    'cocktail-signature',
    'Le creazioni originali firmate Noir.',
    1,
    true
  ),
  (
    '70000000-0000-4000-8000-000000000002',
    'Cocktail Classici',
    'cocktail-classici',
    'I grandi classici della miscelazione.',
    2,
    true
  ),
  (
    '70000000-0000-4000-8000-000000000003',
    'Alcolici Premium',
    'alcolici-premium',
    'Una selezione di distillati ed etichette premium.',
    3,
    true
  ),
  (
    '70000000-0000-4000-8000-000000000004',
    'Cicchetti / Shottini',
    'cicchetti-shottini',
    'Shot e piccoli assaggi dal carattere deciso.',
    4,
    true
  ),
  (
    '70000000-0000-4000-8000-000000000005',
    'Aperitivi Noir',
    'aperitivi-noir',
    'Aperitivi pensati per iniziare la serata.',
    5,
    true
  ),
  (
    '70000000-0000-4000-8000-000000000006',
    'Champagne & Bollicine',
    'champagne-bollicine',
    'Champagne, spumanti e bollicine selezionate.',
    6,
    true
  ),
  (
    '70000000-0000-4000-8000-000000000007',
    'Analcolici',
    'analcolici',
    'Proposte alcohol free curate con la stessa attenzione.',
    7,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

commit;
