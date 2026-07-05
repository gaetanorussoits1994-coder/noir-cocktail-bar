-- ============================================================================
-- Noir Cocktail Bar - categoria Amari e selezione iniziale
-- Dipende da 007_premium_menu_catalog.sql.
-- ============================================================================

begin;

insert into public.menu_categories (
  id, name, slug, description, sort_order, is_active
)
values (
  '70000000-0000-4000-8000-000000000018',
  'Amari',
  'amari',
  'Una selezione italiana di amari da meditazione e fine pasto.',
  15,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

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
  'Amaro italiano',
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
      'Amaro Montenegro',
      'amaro-montenegro',
      'Amaro italiano morbido e aromatico, con note di arancia, spezie dolci ed erbe officinali. Il finale è equilibrato e delicatamente amaricante.',
      'Infuso di erbe aromatiche, spezie e scorze di agrumi',
      7::numeric,
      array['Amaro', 'Italiano']::text[],
      '23% vol.',
      'Temperatura ambiente o con ghiaccio',
      1
    ),
    (
      'Amaro Averna',
      'amaro-averna',
      'Amaro siciliano dal corpo pieno, attraversato da caramello, agrumi ed erbe mediterranee. La chiusura è lunga, rotonda e piacevolmente amara.',
      'Erbe, radici, scorze di agrumi e caramello',
      7::numeric,
      array['Amaro', 'Siciliano']::text[],
      '29% vol.',
      'Temperatura ambiente o con ghiaccio',
      2
    ),
    (
      'Fernet-Branca',
      'fernet-branca',
      'Fernet intenso e balsamico, con una trama netta di erbe, spezie e radici. Il profilo asciutto e persistente lo rende ideale come digestivo.',
      'Erbe aromatiche, spezie e radici',
      7::numeric,
      array['Fernet', 'Balsamico']::text[],
      '39% vol.',
      'Temperatura ambiente',
      3
    ),
    (
      'Vecchio Amaro del Capo',
      'vecchio-amaro-del-capo',
      'Amaro calabrese aromatico e fresco, caratterizzato da erbe, fiori e agrumi del territorio. Servito freddo esprime un finale pulito e fragrante.',
      'Erbe, fiori e scorze di agrumi calabresi',
      6::numeric,
      array['Amaro', 'Calabrese']::text[],
      '35% vol.',
      '-20 °C',
      4
    )
) as item(
  name,
  slug,
  description,
  ingredients,
  price,
  tags,
  alcohol_level,
  serving_temperature,
  display_order
)
where category.slug = 'amari'
on conflict do nothing;

commit;
