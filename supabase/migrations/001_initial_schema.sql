-- ============================================================================
-- Noir Cocktail Bar - Initial Supabase schema
-- Eseguibile direttamente nel SQL Editor di Supabase.
-- ============================================================================

begin;

create extension if not exists pgcrypto;

-- ============================================================================
-- Funzione condivisa per updated_at
-- ============================================================================

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
-- Tabelle
-- ============================================================================

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  site_name text,
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

create table if not exists public.cocktail_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cocktail_categories_name_not_blank
    check (btrim(name) <> ''),
  constraint cocktail_categories_slug_not_blank
    check (btrim(slug) <> '')
);

create table if not exists public.cocktails (
  id uuid primary key default gen_random_uuid(),
  category_id uuid,
  name text not null,
  slug text not null unique,
  description text,
  ingredients text,
  price numeric(10, 2),
  image_url text,
  is_signature boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cocktails_category_id_fkey
    foreign key (category_id)
    references public.cocktail_categories (id)
    on update cascade
    on delete set null,
  constraint cocktails_name_not_blank
    check (btrim(name) <> ''),
  constraint cocktails_slug_not_blank
    check (btrim(slug) <> ''),
  constraint cocktails_price_non_negative
    check (price is null or price >= 0)
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text,
  image_url text not null,
  alt text,
  aspect_ratio text not null default 'landscape',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_images_url_not_blank
    check (btrim(image_url) <> ''),
  constraint gallery_images_aspect_ratio_check
    check (aspect_ratio in ('landscape', 'portrait', 'square', 'tall'))
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  frequency text,
  description text,
  image_url text,
  event_date date,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_title_not_blank
    check (btrim(title) <> ''),
  constraint events_slug_not_blank
    check (btrim(slug) <> '')
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  specialty text,
  quote text,
  image_url text,
  instagram_handle text,
  instagram_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint artists_name_not_blank
    check (btrim(name) <> '')
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating integer not null default 5,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_name_not_blank
    check (btrim(name) <> ''),
  constraint testimonials_text_not_blank
    check (btrim(text) <> ''),
  constraint testimonials_rating_check
    check (rating between 1 and 5)
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint awards_title_not_blank
    check (btrim(title) <> '')
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  reservation_date date not null,
  reservation_time time without time zone not null,
  guests integer not null,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservations_customer_name_not_blank
    check (btrim(customer_name) <> ''),
  constraint reservations_customer_phone_not_blank
    check (btrim(customer_phone) <> ''),
  constraint reservations_guests_check
    check (guests between 1 and 30),
  constraint reservations_status_check
    check (status in ('pending', 'confirmed', 'cancelled'))
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_email_normalized
    check (
      email = lower(btrim(email))
      and char_length(email) between 3 and 320
      and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    )
);

-- Compatibilità con una eventuale esecuzione successiva dello schema prototipo.
alter table public.site_settings
  add column if not exists key text,
  add column if not exists value text,
  add column if not exists city text,
  add column if not exists logo_url text,
  add column if not exists hero_title text,
  add column if not exists hero_subtitle text,
  add column if not exists hero_description text,
  add column if not exists hero_background_url text;

-- Backfill compatibile con l'eventuale schema prototipo privo di key.
with ranked_settings as (
  select
    id,
    row_number() over (order by created_at, id) as position
  from public.site_settings
  where key is null
)
update public.site_settings as settings
set key = case
  when ranked.position = 1 then 'legacy-general'
  else 'legacy-' || settings.id::text
end
from ranked_settings as ranked
where settings.id = ranked.id;

alter table public.site_settings
  alter column key set not null,
  alter column site_name drop not null;

alter table public.cocktails
  add column if not exists category_id uuid
  references public.cocktail_categories (id)
  on update cascade
  on delete set null;

alter table public.gallery_images
  add column if not exists aspect_ratio text not null default 'landscape';

alter table public.artists
  add column if not exists instagram_handle text;

alter table public.testimonials
  add column if not exists updated_at timestamptz not null default now();

alter table public.awards
  add column if not exists updated_at timestamptz not null default now();

alter table public.reservations
  add column if not exists updated_at timestamptz not null default now();

alter table public.newsletter_subscribers
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

-- site_settings usa chiavi univoche e può contenere più impostazioni.
drop index if exists public.idx_site_settings_singleton;

create unique index if not exists idx_site_settings_key
  on public.site_settings (key);

-- ============================================================================
-- Indici
-- ============================================================================

create index if not exists idx_cocktail_categories_active_sort
  on public.cocktail_categories (sort_order, id)
  where is_active = true;

create index if not exists idx_cocktails_category_active_sort
  on public.cocktails (category_id, sort_order, id)
  where is_active = true;

create index if not exists idx_cocktails_signature_sort
  on public.cocktails (sort_order, id)
  where is_active = true and is_signature = true;

create index if not exists idx_gallery_images_active_sort
  on public.gallery_images (sort_order, id)
  where is_active = true;

create index if not exists idx_events_active_sort
  on public.events (sort_order, id)
  where is_active = true;

create index if not exists idx_events_event_date
  on public.events (event_date)
  where is_active = true and event_date is not null;

create index if not exists idx_artists_active_sort
  on public.artists (sort_order, id)
  where is_active = true;

create index if not exists idx_testimonials_active_sort
  on public.testimonials (sort_order, id)
  where is_active = true;

create index if not exists idx_awards_active_sort
  on public.awards (sort_order, id)
  where is_active = true;

create index if not exists idx_reservations_date_time_status
  on public.reservations (reservation_date, reservation_time, status);

create index if not exists idx_reservations_created_at
  on public.reservations (created_at desc);

create index if not exists idx_newsletter_subscribers_active
  on public.newsletter_subscribers (is_active)
  where is_active = true;

-- ============================================================================
-- Trigger updated_at
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

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists set_awards_updated_at on public.awards;
create trigger set_awards_updated_at
before update on public.awards
for each row execute function public.set_updated_at();

drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

drop trigger if exists set_newsletter_subscribers_updated_at
  on public.newsletter_subscribers;
create trigger set_newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

revoke execute on function public.set_updated_at() from public;
revoke execute on function public.set_updated_at() from anon;
revoke execute on function public.set_updated_at() from authenticated;

-- ============================================================================
-- Row Level Security
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

drop policy if exists "Public can read site settings"
  on public.site_settings;
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

drop policy if exists "Public can read active cocktails"
  on public.cocktails;
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
      where category.id = cocktails.category_id
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

drop policy if exists "Public can read active events"
  on public.events;
create policy "Public can read active events"
on public.events
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active artists"
  on public.artists;
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

drop policy if exists "Public can read active awards"
  on public.awards;
create policy "Public can read active awards"
on public.awards
for select
to anon, authenticated
using (is_active = true);

-- I visitatori possono creare richieste, ma non leggere o modificarle.
drop policy if exists "Public can create pending reservations"
  on public.reservations;
create policy "Public can create pending reservations"
on public.reservations
for insert
to anon, authenticated
with check (status = 'pending');

-- Le iscrizioni sono inseribili, ma l'elenco rimane privato.
drop policy if exists "Public can subscribe to newsletter"
  on public.newsletter_subscribers;
create policy "Public can subscribe to newsletter"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (
  is_active = true
  and email = lower(btrim(email))
  and char_length(email) between 3 and 320
  and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);

-- Permessi API minimi; service_role continua a gestire il CMS e i dati privati.
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

grant usage on schema public to anon, authenticated;

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
-- Seed iniziale
-- ============================================================================

insert into public.site_settings (
  key,
  value,
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
  hero_background_url,
  created_at
)
values (
  'site_name',
  'Noir Cocktail Bar',
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
  null,
  '2026-01-01 00:00:00+00'
)
on conflict (key) do update set
  value = excluded.value,
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
  hero_background_url = excluded.hero_background_url,
  created_at = excluded.created_at;

-- Impostazioni atomiche usate dalla futura gestione contenuti.
insert into public.site_settings (key, value, created_at)
values
  (
    'tagline',
    'Premium Cocktail Experience.',
    '2026-01-01 00:00:01+00'
  ),
  (
    'description',
    'Cocktail d’autore, atmosfera ricercata e dettagli pensati per trasformare ogni notte in un’esperienza da ricordare.',
    '2026-01-01 00:00:02+00'
  ),
  (
    'phone',
    '+39 333 123 4567',
    '2026-01-01 00:00:03+00'
  ),
  (
    'email',
    'info@noircocktailbar.it',
    '2026-01-01 00:00:04+00'
  ),
  (
    'whatsapp',
    'https://wa.me/393331234567',
    '2026-01-01 00:00:05+00'
  ),
  (
    'address',
    'Via Roma 24',
    '2026-01-01 00:00:06+00'
  ),
  (
    'city',
    'Milano',
    '2026-01-01 00:00:07+00'
  ),
  (
    'opening_hours',
    'Martedì - Domenica, 18:00 - 02:00',
    '2026-01-01 00:00:08+00'
  ),
  (
    'instagram_url',
    'https://www.instagram.com/',
    '2026-01-01 00:00:09+00'
  ),
  (
    'facebook_url',
    'https://www.facebook.com/',
    '2026-01-01 00:00:10+00'
  ),
  (
    'hero_title',
    'Noir Cocktail Bar',
    '2026-01-01 00:00:11+00'
  ),
  (
    'hero_subtitle',
    'Premium Cocktail Experience',
    '2026-01-01 00:00:12+00'
  ),
  (
    'hero_description',
    'Un luogo dove mixology, atmosfera e dettagli si incontrano.',
    '2026-01-01 00:00:13+00'
  )
on conflict (key) do update set
  value = excluded.value,
  created_at = excluded.created_at;

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

insert into public.gallery_images (
  id,
  title,
  category,
  image_url,
  alt,
  aspect_ratio,
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
    'landscape',
    1,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    'Noir Negroni',
    'Signature',
    '/images/noir-negroni.png',
    'Noir Negroni sul bancone',
    'portrait',
    2,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    'Cocktail Craft',
    'Craft',
    '/images/gallery-craft.png',
    'Strumenti e ingredienti per la miscelazione',
    'tall',
    3,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    'Golden Smoke',
    'Mixology',
    '/images/golden-smoke.png',
    'Golden Smoke con note aromatiche',
    'square',
    4,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000005',
    'Noir Experience',
    'Experience',
    '/images/experience-cocktail.png',
    'Cocktail artigianale in un ambiente dalle luci soffuse',
    'landscape',
    5,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000006',
    'Velvet Night',
    'Night',
    '/images/velvet-night.png',
    'Velvet Night in coppa',
    'portrait',
    6,
    true
  )
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  image_url = excluded.image_url,
  alt = excluded.alt,
  aspect_ratio = excluded.aspect_ratio,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

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

insert into public.artists (
  id,
  name,
  role,
  specialty,
  quote,
  image_url,
  instagram_handle,
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
    '@alessandro.noir',
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
    '@sofia.noir',
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
    '@lorenzo.noir',
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
  instagram_handle = excluded.instagram_handle,
  instagram_url = excluded.instagram_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

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
