-- ============================================================================
-- Noir Cocktail Bar - Delirium Tremens e selezione Alcolici Premium
-- Dipende da 007_premium_menu_catalog.sql.
-- ============================================================================

begin;

update public.menu_categories
set
  name = 'Alcolici Premium',
  description = 'Distillati selezionati per degustazioni pulite e cocktail essenziali dal carattere elegante.',
  sort_order = 15,
  is_active = true
where slug = 'alcolici-premium';

insert into public.menu_categories (
  id, name, slug, description, sort_order, is_active
)
values (
  '70000000-0000-4000-8000-000000000003',
  'Alcolici Premium',
  'alcolici-premium',
  'Distillati selezionati per degustazioni pulite e cocktail essenziali dal carattere elegante.',
  15,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

update public.menu_categories
set sort_order = 16
where slug = 'amari';

insert into public.menu_items (
  category_id,
  name,
  slug,
  category,
  description,
  ingredients,
  price,
  tags,
  alcohol_level,
  product_style,
  serving_format,
  serving_temperature,
  is_featured,
  is_available,
  display_order,
  sort_order
)
select
  category.id,
  'Delirium Tremens',
  'delirium-tremens',
  category.name,
  'Birra belga iconica, intensa e speziata, con note fruttate, corpo elegante e finale persistente.',
  'Acqua, malto d''orzo, luppolo, lievito e spezie',
  8,
  array['Belgian Strong Ale', 'Glutine']::text[],
  '8,5% vol.',
  'Belgian Strong Ale',
  'Bottiglia 33 cl',
  '6–8 °C',
  false,
  true,
  10,
  10
from public.menu_categories as category
where category.slug = 'birre'
on conflict do nothing;

insert into public.menu_items (
  category_id,
  name,
  slug,
  category,
  description,
  ingredients,
  price,
  tags,
  alcohol_level,
  product_style,
  serving_format,
  serving_temperature,
  is_featured,
  is_available,
  display_order,
  sort_order
)
select
  category.id,
  item.name,
  item.slug,
  category.name,
  item.description,
  item.ingredients,
  item.price,
  item.tags,
  item.alcohol_level,
  item.product_style,
  'Calice 40 ml',
  item.serving_temperature,
  false,
  true,
  item.display_order,
  item.display_order
from public.menu_categories as category
cross join (
  values
    (
      'Vodka Premium',
      'vodka-premium',
      'Distillato cristallino, morbido e raffinato, ideale per una degustazione pulita o per cocktail essenziali dal carattere elegante.',
      'Distillato di cereali selezionati; note pulite, morbide e minerali',
      10::numeric,
      array['Premium', 'Nessun allergene']::text[],
      'Circa 40% vol.',
      'Vodka premium',
      '8–12 °C',
      1
    ),
    (
      'Gin Premium',
      'gin-premium',
      'Gin selezionato con botaniche pregiate, profumi agrumati e note erbacee, pensato per drink sofisticati e aromatici.',
      'Ginepro, scorze di agrumi e botaniche selezionate',
      11::numeric,
      array['Premium', 'Botanico', 'Nessun allergene']::text[],
      'Circa 40% vol.',
      'Gin premium',
      '8–12 °C',
      2
    ),
    (
      'Rum Premium',
      'rum-premium',
      'Rum invecchiato, caldo e avvolgente, con sfumature di vaniglia, spezie dolci e legno tostato.',
      'Distillato di canna da zucchero affinato in legno; note di vaniglia e spezie',
      11::numeric,
      array['Premium', 'Invecchiato', 'Nessun allergene']::text[],
      'Circa 40% vol.',
      'Rum invecchiato',
      '16–20 °C',
      3
    ),
    (
      'Whisky Premium',
      'whisky-premium',
      'Distillato elegante e complesso, con note torbate, caramello, frutta secca e finale lungo.',
      'Whisky affinato in botte; note torbate, caramello e frutta secca',
      12::numeric,
      array['Premium', 'Torbato', 'Nessun allergene']::text[],
      'Circa 40% vol.',
      'Whisky premium',
      '16–20 °C',
      4
    ),
    (
      'Tequila Premium',
      'tequila-premium',
      'Agave selezionata, gusto pulito e minerale, con accenti vegetali e una chiusura intensa.',
      'Distillato di agave blu; note vegetali, minerali e agrumate',
      11::numeric,
      array['Premium', 'Agave', 'Nessun allergene']::text[],
      'Circa 40% vol.',
      'Tequila 100% agave',
      '14–18 °C',
      5
    ),
    (
      'Mezcal Premium',
      'mezcal-premium',
      'Distillato affumicato e profondo, con carattere deciso, note terrose e profilo aromatico persistente.',
      'Distillato artigianale di agave cotta; note affumicate e terrose',
      12::numeric,
      array['Premium', 'Affumicato', 'Nessun allergene']::text[],
      'Circa 45% vol.',
      'Mezcal artigianale',
      '14–18 °C',
      6
    )
) as item(
  name,
  slug,
  description,
  ingredients,
  price,
  tags,
  alcohol_level,
  product_style,
  serving_temperature,
  display_order
)
where category.slug = 'alcolici-premium'
on conflict do nothing;

commit;
