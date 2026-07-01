-- ============================================================================
-- Noir Cocktail Bar - Supabase CMS schema
-- Execute this entire file in the Supabase SQL Editor.
-- The script is idempotent and can also upgrade the previous Noir schema.
-- ============================================================================

begin;

-- Supabase supports pgcrypto and gen_random_uuid() out of the box.
create extension if not exists pgcrypto;

-- ============================================================================
-- Shared updated_at trigger
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 1. Global site identity, contact details, social links and hero content
-- ============================================================================

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  tagline text,
  description text,
  phone text,
  email text,
  whatsapp text,
  address text,
  city text,
  opening_hours text,
  instagram_url text,
  facebook_url text,
  logo_url text,
  hero_title text,
  hero_subtitle text,
  hero_description text,
  hero_background_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade compatibility for an earlier version of this project schema.
alter table public.site_settings add column if not exists city text;
alter table public.site_settings add column if not exists logo_url text;
alter table public.site_settings add column if not exists hero_title text;
alter table public.site_settings add column if not exists hero_subtitle text;
alter table public.site_settings add column if not exists hero_description text;
alter table public.site_settings add column if not exists hero_background_url text;

-- ============================================================================
-- 2. Cocktail menu categories
-- ============================================================================

create table if not exists public.cocktail_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 3. Cocktails and menu items
-- ============================================================================

create table if not exists public.cocktails (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.cocktail_categories(id)
    on update cascade
    on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  ingredients text,
  price numeric(10, 2) check (price is null or price >= 0),
  image_url text,
  is_signature boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade compatibility for the earlier schema, which stored category as text.
alter table public.cocktails
  add column if not exists category_id uuid
  references public.cocktail_categories(id)
  on update cascade
  on delete set null;

-- ============================================================================
-- 4. Public gallery
-- ============================================================================

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text,
  image_url text not null,
  alt text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 5. Events and recurring experiences
-- ============================================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  frequency text,
  description text,
  image_url text,
  event_date date,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 6. Bartenders and team
-- ============================================================================

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  specialty text,
  quote text,
  image_url text,
  instagram_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 7. Guest testimonials
-- ============================================================================

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating int not null default 5 check (rating between 1 and 5),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 8. Awards and recognitions
-- ============================================================================

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 9. Reservation requests
-- ============================================================================

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  reservation_date date not null,
  reservation_time time not null,
  guests int not null check (guests > 0),
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 10. Future newsletter subscriptions
-- ============================================================================

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Automatic updated_at maintenance
-- ============================================================================

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_cocktail_categories_updated_at
  on public.cocktail_categories;
create trigger set_cocktail_categories_updated_at
before update on public.cocktail_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_cocktails_updated_at on public.cocktails;
create trigger set_cocktails_updated_at
before update on public.cocktails
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_images_updated_at on public.gallery_images;
create trigger set_gallery_images_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_artists_updated_at on public.artists;
create trigger set_artists_updated_at
before update on public.artists
for each row execute function public.set_updated_at();

-- The trigger function is internal; visitors never need to invoke it directly.
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- ============================================================================
-- Query indexes
-- UNIQUE slug/email constraints above already provide their own indexes.
-- These indexes optimize active CMS lists, ordering and reservation management.
-- ============================================================================

create index if not exists idx_cocktail_categories_active_sort
  on public.cocktail_categories (is_active, sort_order);

create index if not exists idx_cocktails_category_active_sort
  on public.cocktails (category_id, is_active, sort_order);

create index if not exists idx_gallery_images_active_sort
  on public.gallery_images (is_active, sort_order);

create index if not exists idx_events_active_sort
  on public.events (is_active, sort_order);

create index if not exists idx_events_event_date
  on public.events (event_date)
  where event_date is not null;

create index if not exists idx_artists_active_sort
  on public.artists (is_active, sort_order);

create index if not exists idx_testimonials_active_sort
  on public.testimonials (is_active, sort_order);

create index if not exists idx_awards_active_sort
  on public.awards (is_active, sort_order);

create index if not exists idx_reservations_date_status
  on public.reservations (reservation_date, status);

-- ============================================================================
-- Row Level Security
-- Public visitors may read only active CMS content. site_settings is a singleton
-- without an is_active flag, so its single row is publicly readable.
-- Reservations and newsletter records are never publicly readable.
-- ============================================================================

alter table public.site_settings enable row level security;
alter table public.cocktail_categories enable row level security;
alter table public.cocktails enable row level security;
alter table public.gallery_images enable row level security;
alter table public.events enable row level security;
alter table public.artists enable row level security;
alter table public.testimonials enable row level security;
alter table public.awards enable row level security;
alter table public.reservations enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read active cocktail categories"
  on public.cocktail_categories;
create policy "Public can read active cocktail categories"
on public.cocktail_categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active cocktails" on public.cocktails;
create policy "Public can read active cocktails"
on public.cocktails
for select
to anon, authenticated
using (
  is_active = true
  and (
    category_id is null
    or exists (
      select 1
      from public.cocktail_categories as category
      where category.id = category_id
        and category.is_active = true
    )
  )
);

drop policy if exists "Public can read active gallery images"
  on public.gallery_images;
create policy "Public can read active gallery images"
on public.gallery_images
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active events" on public.events;
create policy "Public can read active events"
on public.events
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active artists" on public.artists;
create policy "Public can read active artists"
on public.artists
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active testimonials"
  on public.testimonials;
create policy "Public can read active testimonials"
on public.testimonials
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active awards" on public.awards;
create policy "Public can read active awards"
on public.awards
for select
to anon, authenticated
using (is_active = true);

-- Visitors may create pending reservations but cannot choose system fields.
drop policy if exists "Public can create pending reservations"
  on public.reservations;
create policy "Public can create pending reservations"
on public.reservations
for insert
to anon, authenticated
with check (status = 'pending');

-- Visitors may submit syntactically valid newsletter email addresses only.
drop policy if exists "Public can subscribe to newsletter"
  on public.newsletter_subscribers;
create policy "Public can subscribe to newsletter"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (
  email = lower(trim(email))
  and char_length(email) between 3 and 320
  and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);

-- Remove inherited/default visitor privileges, then grant only what is needed.
revoke all privileges on table public.site_settings
  from public, anon, authenticated;
revoke all privileges on table public.cocktail_categories
  from public, anon, authenticated;
revoke all privileges on table public.cocktails
  from public, anon, authenticated;
revoke all privileges on table public.gallery_images
  from public, anon, authenticated;
revoke all privileges on table public.events
  from public, anon, authenticated;
revoke all privileges on table public.artists
  from public, anon, authenticated;
revoke all privileges on table public.testimonials
  from public, anon, authenticated;
revoke all privileges on table public.awards
  from public, anon, authenticated;
revoke all privileges on table public.reservations
  from public, anon, authenticated;
revoke all privileges on table public.newsletter_subscribers
  from public, anon, authenticated;

grant select on table public.site_settings to anon, authenticated;
grant select on table public.cocktail_categories to anon, authenticated;
grant select on table public.cocktails to anon, authenticated;
grant select on table public.gallery_images to anon, authenticated;
grant select on table public.events to anon, authenticated;
grant select on table public.artists to anon, authenticated;
grant select on table public.testimonials to anon, authenticated;
grant select on table public.awards to anon, authenticated;

grant insert (
  customer_name,
  customer_phone,
  customer_email,
  reservation_date,
  reservation_time,
  guests,
  notes
) on table public.reservations to anon, authenticated;

grant insert (email)
on table public.newsletter_subscribers
to anon, authenticated;

-- ============================================================================
-- Seed data
-- Stable UUIDs and upserts make this section safe to execute more than once.
-- ============================================================================

-- Noir identity and the content currently displayed in the hero/contact/footer.
insert into public.site_settings (
  id,
  site_name,
  tagline,
  description,
  phone,
  email,
  whatsapp,
  address,
  city,
  opening_hours,
  instagram_url,
  facebook_url,
  logo_url,
  hero_title,
  hero_subtitle,
  hero_description,
  hero_background_url
)
values (
  '00000000-0000-4000-8000-000000000001',
  'Noir Cocktail Bar',
  'Premium Cocktail Experience.',
  'Cocktail d’autore, atmosfera ricercata e dettagli pensati per trasformare ogni notte in un’esperienza da ricordare.',
  '+39 333 123 4567',
  'info@noircocktailbar.it',
  'https://wa.me/393331234567',
  'Via Roma 24',
  'Milano',
  'Martedì - Domenica, 18:00 - 02:00',
  'https://www.instagram.com/',
  'https://www.facebook.com/',
  null,
  'Noir Cocktail Bar',
  'Premium Cocktail Experience',
  'Un luogo dove mixology, atmosfera e dettagli si incontrano.',
  null
)
on conflict (id) do update set
  site_name = excluded.site_name,
  tagline = excluded.tagline,
  description = excluded.description,
  phone = excluded.phone,
  email = excluded.email,
  whatsapp = excluded.whatsapp,
  address = excluded.address,
  city = excluded.city,
  opening_hours = excluded.opening_hours,
  instagram_url = excluded.instagram_url,
  facebook_url = excluded.facebook_url,
  logo_url = excluded.logo_url,
  hero_title = excluded.hero_title,
  hero_subtitle = excluded.hero_subtitle,
  hero_description = excluded.hero_description,
  hero_background_url = excluded.hero_background_url;

-- Menu categories. Only Signature is populated today; the others prepare growth.
insert into public.cocktail_categories (
  id,
  name,
  slug,
  description,
  sort_order,
  is_active
)
values
  (
    '01000000-0000-4000-8000-000000000001',
    'Signature',
    'signature',
    'Le creazioni originali che raccontano l’identità di Noir.',
    1,
    true
  ),
  (
    '01000000-0000-4000-8000-000000000002',
    'Classici',
    'classici',
    'I grandi classici della miscelazione.',
    2,
    true
  ),
  (
    '01000000-0000-4000-8000-000000000003',
    'Alcohol Free',
    'alcohol-free',
    'Creazioni analcoliche curate con la stessa attenzione.',
    3,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Current signature cocktail selection.
insert into public.cocktails (
  id,
  category_id,
  name,
  slug,
  description,
  ingredients,
  price,
  image_url,
  is_signature,
  is_active,
  sort_order
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    '01000000-0000-4000-8000-000000000001',
    'Noir Negroni',
    'noir-negroni',
    'Un classico intenso reinterpretato con note agrumate e una profondità vellutata.',
    null,
    18.00,
    '/images/noir-negroni.png',
    true,
    true,
    1
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '01000000-0000-4000-8000-000000000001',
    'Golden Smoke',
    'golden-smoke',
    'Bourbon, sfumature affumicate e accenti aromatici in un equilibrio caldo e avvolgente.',
    null,
    20.00,
    '/images/golden-smoke.png',
    true,
    true,
    2
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    '01000000-0000-4000-8000-000000000001',
    'Velvet Night',
    'velvet-night',
    'Frutti scuri e delicate note floreali per un cocktail morbido, elegante e notturno.',
    null,
    17.00,
    '/images/velvet-night.png',
    true,
    true,
    3
  )
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  ingredients = excluded.ingredients,
  price = excluded.price,
  image_url = excluded.image_url,
  is_signature = excluded.is_signature,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

-- Gallery items matching the current site imagery.
insert into public.gallery_images (
  id,
  title,
  category,
  image_url,
  alt,
  sort_order,
  is_active
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    'Noir Interior',
    'Atmosfera',
    '/images/gallery-interior.png',
    'Interni eleganti del Noir Cocktail Bar',
    1,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    'Noir Negroni',
    'Signature',
    '/images/noir-negroni.png',
    'Noir Negroni sul bancone',
    2,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    'Cocktail Craft',
    'Craft',
    '/images/gallery-craft.png',
    'Strumenti e ingredienti per la miscelazione',
    3,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    'Golden Smoke',
    'Mixology',
    '/images/golden-smoke.png',
    'Golden Smoke con note aromatiche',
    4,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000005',
    'Noir Experience',
    'Experience',
    '/images/experience-cocktail.png',
    'Cocktail artigianale in un ambiente dalle luci soffuse',
    5,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000006',
    'Velvet Night',
    'Night',
    '/images/velvet-night.png',
    'Velvet Night in coppa',
    6,
    true
  )
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  image_url = excluded.image_url,
  alt = excluded.alt,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Current recurring Noir events.
insert into public.events (
  id,
  title,
  slug,
  frequency,
  description,
  image_url,
  event_date,
  is_active,
  sort_order
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    'Jazz Night',
    'jazz-night',
    'Ogni venerdì',
    'Live jazz, cocktail signature e atmosfera elegante.',
    null,
    null,
    true,
    1
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'Guest Bartender',
    'guest-bartender',
    'Una volta al mese',
    'Bartender ospiti e drink list speciali.',
    null,
    null,
    true,
    2
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    'Private Lounge',
    'private-lounge',
    'Su prenotazione',
    'Esperienze private per piccoli gruppi ed eventi aziendali.',
    null,
    null,
    true,
    3
  )
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  frequency = excluded.frequency,
  description = excluded.description,
  image_url = excluded.image_url,
  event_date = excluded.event_date,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

-- Current Noir team.
insert into public.artists (
  id,
  name,
  role,
  specialty,
  quote,
  image_url,
  instagram_url,
  sort_order,
  is_active
)
values
  (
    '40000000-0000-4000-8000-000000000001',
    'Alessandro Ricci',
    'Head Mixologist',
    'Botanical cocktails',
    'Every cocktail tells a story.',
    '/images/artist-alessandro-ricci.png',
    'https://www.instagram.com/',
    1,
    true
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    'Sofia Martini',
    'Bar Manager',
    'Classic revisited',
    'Elegance is found in the smallest details.',
    '/images/artist-sofia-martini.png',
    'https://www.instagram.com/',
    2,
    true
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    'Lorenzo De Santis',
    'Creative Bartender',
    'Smoky signatures',
    'Balance is the soul of every drink.',
    '/images/artist-lorenzo-de-santis.png',
    'https://www.instagram.com/',
    3,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  specialty = excluded.specialty,
  quote = excluded.quote,
  image_url = excluded.image_url,
  instagram_url = excluded.instagram_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Current guest testimonials.
insert into public.testimonials (
  id,
  name,
  text,
  rating,
  is_active,
  sort_order
)
values
  (
    '50000000-0000-4000-8000-000000000001',
    'Marco Bellini',
    'Un’esperienza raffinata, cocktail impeccabili e atmosfera incredibile.',
    5,
    true,
    1
  ),
  (
    '50000000-0000-4000-8000-000000000002',
    'Giulia Ferri',
    'Noir è uno di quei luoghi che ricordi per dettagli, servizio e qualità.',
    5,
    true,
    2
  ),
  (
    '50000000-0000-4000-8000-000000000003',
    'Davide Romano',
    'Eleganza, musica e drink list curata in modo eccellente.',
    5,
    true,
    3
  )
on conflict (id) do update set
  name = excluded.name,
  text = excluded.text,
  rating = excluded.rating,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

-- Current awards.
insert into public.awards (
  id,
  title,
  year,
  description,
  sort_order,
  is_active
)
values
  (
    '60000000-0000-4000-8000-000000000001',
    'Best Cocktail Experience 2024',
    '2024',
    null,
    1,
    true
  ),
  (
    '60000000-0000-4000-8000-000000000002',
    'Luxury Mixology Selection 2025',
    '2025',
    null,
    2,
    true
  ),
  (
    '60000000-0000-4000-8000-000000000003',
    'Top Lounge Concept',
    null,
    null,
    3,
    true
  )
on conflict (id) do update set
  title = excluded.title,
  year = excluded.year,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

commit;
