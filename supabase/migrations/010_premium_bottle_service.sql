-- ============================================================================
-- Noir Cocktail Bar - bottiglie premium per servizio al tavolo
-- Sostituisce i placeholder generici senza eliminare referenze create dall'admin.
-- ============================================================================

begin;

insert into public.menu_categories (
  id, name, slug, description, sort_order, is_active
)
values (
  '70000000-0000-4000-8000-000000000003',
  'Alcolici Premium',
  'alcolici-premium',
  'Selezione di bottiglie premium servite al tavolo, pensate per degustazioni esclusive, serate private e momenti da condividere.',
  15,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

delete from public.menu_items
where lower(btrim(name)) in (
  'vodka premium',
  'gin premium',
  'rum premium',
  'whisky premium',
  'tequila premium',
  'mezcal premium'
)
and lower(btrim(category)) = 'alcolici premium';

create temporary table noir_bottle_seed (
  name text not null,
  slug text not null,
  description text not null,
  story text not null,
  tasting_notes text not null,
  price numeric not null,
  tags text[] not null,
  alcohol_level text not null,
  product_style text not null,
  serving_format text not null,
  display_order integer not null
) on commit drop;

insert into noir_bottle_seed values
  ('Belvedere Vodka', 'belvedere-vodka', 'Vodka polacca premium, celebre per purezza e morbidezza. La segale dona una trama vellutata, precisa e persistente.', 'Prodotta in Polonia secondo una tradizione secolare, prende il nome dal palazzo Belweder di Varsavia.', 'Vaniglia, pepe bianco, mandorla e finale pulito.', 140, array['Vodka','Polonia','Premium','Nessun allergene'], '40% vol.', 'Vodka premium', 'Bottiglia 70 cl', 1),
  ('Beluga Noble Vodka', 'beluga-noble-vodka', 'Vodka morbida e composta, costruita su un profilo pulito e una texture setosa. La delicata dolcezza accompagna un finale armonioso.', 'La ricetta Noble unisce distillazione accurata, filtrazione e un periodo di riposo prima dell''imbottigliamento.', 'Cereale dolce, miele leggero, pepe e chiusura morbida.', 150, array['Vodka','Noble','Premium','Nessun allergene'], '40% vol.', 'Vodka premium', 'Bottiglia 70 cl', 2),
  ('Grey Goose Vodka', 'grey-goose-vodka', 'Vodka francese elegante e rotonda, con una consistenza cremosa e un profilo nitido. È pensata per un servizio essenziale e molto pulito.', 'Nasce in Francia da grano tenero invernale della Piccardia e acqua di sorgente filtrata naturalmente.', 'Mandorla, agrume delicato, anice lieve e finale fresco.', 145, array['Vodka','Francia','Premium','Nessun allergene'], '40% vol.', 'Vodka premium', 'Bottiglia 70 cl', 3),
  ('Gin Mare', 'gin-mare', 'Gin mediterraneo aromatico e gastronomico, in cui ginepro, oliva ed erbe costiere costruiscono un sorso sapido e complesso.', 'Distillato in Spagna, interpreta il Mediterraneo attraverso oliva Arbequina, basilico, rosmarino e timo.', 'Ginepro, oliva, rosmarino, timo, basilico e agrumi.', 130, array['Gin','Mediterraneo','Botanico','Nessun allergene'], '42,7% vol.', 'Gin mediterraneo', 'Bottiglia 70 cl', 4),
  ('Hendrick''s Gin', 'hendricks-gin', 'Gin scozzese floreale e riconoscibile, con una trama morbida di ginepro, rosa e cetriolo. Il finale resta fresco e aromatico.', 'Creato nella Girvan Distillery, combina distillati prodotti in due alambicchi differenti e infusioni di rosa e cetriolo.', 'Cetriolo, rosa, ginepro, agrumi e pepe.', 120, array['Gin','Scozia','Floreale','Nessun allergene'], '41,4% vol.', 'Gin scozzese', 'Bottiglia 70 cl', 5),
  ('Hendrick''s Neptunia', 'hendricks-neptunia', 'Edizione marittima luminosa e fresca, con agrumi costieri e una delicata sensazione salina che prolunga le botaniche classiche.', 'Nata dal Cabinet of Curiosities di Hendrick''s, è ispirata alla costa dell''Ayrshire e al carattere del mare.', 'Agrumi, erbe costiere, ginepro, cetriolo e finale salino.', 140, array['Gin','Limited Release','Marino','Nessun allergene'], '43,4% vol.', 'Gin scozzese', 'Bottiglia 70 cl', 6),
  ('Hendrick''s Flora Adora', 'hendricks-flora-adora', 'Gin intensamente floreale, morbido e profumato, costruito per esaltare fiori freschi, erbe e la firma di rosa e cetriolo.', 'Edizione del Cabinet of Curiosities ispirata ai fiori che attirano gli impollinatori nel giardino della master distiller.', 'Fiori freschi, ginepro, cetriolo, rosa e spezie leggere.', 140, array['Gin','Limited Release','Floreale','Nessun allergene'], '43,4% vol.', 'Gin scozzese', 'Bottiglia 70 cl', 7),
  ('Bombay Sapphire', 'bombay-sapphire', 'London Dry Gin equilibrato e versatile, con ginepro nitido, agrumi e spezie ben integrate. Il profilo è pulito e luminoso.', 'Le dieci botaniche vengono lavorate con infusione a vapore; la casa ha sede a Laverstoke Mill, in Inghilterra.', 'Ginepro, limone, coriandolo, angelica e spezie.', 100, array['Gin','London Dry','Nessun allergene'], '40% vol.', 'London Dry Gin', 'Bottiglia 70 cl', 8),
  ('Bombay Citron Pressé', 'bombay-citron-presse', 'Gin agrumato e vivace, arricchito dal carattere naturale dei limoni mediterranei. Freschezza e ginepro restano in equilibrio.', 'Nasce come espressione agrumata della famiglia Bombay, sviluppata intorno a limoni mediterranei raccolti a maturazione.', 'Limone maturo, ginepro, coriandolo e spezie delicate.', 105, array['Gin','Agrumato','Nessun allergene'], '37,5% vol.', 'Gin agrumato', 'Bottiglia 70 cl', 9),
  ('Tanqueray No. Ten', 'tanqueray-no-ten', 'Gin premium secco e brillante, con agrumi freschi in primo piano e una struttura botanica precisa e persistente.', 'Lanciato nel 2000 e chiamato come il piccolo alambicco Tiny Ten, utilizza agrumi freschi nella distillazione.', 'Pompelmo, lime, arancia, ginepro e camomilla.', 130, array['Gin','Citrus','Premium','Nessun allergene'], '47,3% vol.', 'Gin agrumato', 'Bottiglia 70 cl', 10),
  ('Monkey 47', 'monkey-47', 'Gin della Foresta Nera complesso e concentrato, capace di unire note resinose, floreali, speziate e agrumate.', 'Prodotto in Germania con quarantasette botaniche e acqua della Foresta Nera, richiama la storia del comandante Montgomery Collins.', 'Ginepro, mirtillo rosso, agrumi, fiori, erbe e spezie.', 145, array['Gin','Germania','47 Botaniche','Nessun allergene'], '47% vol.', 'Dry Gin', 'Bottiglia 50 cl', 11),
  ('Diplomático Reserva Exclusiva', 'diplomatico-reserva-exclusiva', 'Rum venezuelano ricco e avvolgente, con dolcezza misurata, frutta matura e una lunga trama di spezie e legno.', 'Nasce ai piedi delle Ande venezuelane dall''unione di distillati affinati e selezionati per profondità e morbidezza.', 'Arancia, toffee, vaniglia, uvetta, cacao e rovere.', 130, array['Rum','Venezuela','Invecchiato','Nessun allergene'], '40% vol.', 'Rum invecchiato', 'Bottiglia 70 cl', 12),
  ('Zacapa 23', 'zacapa-23', 'Rum guatemalteco morbido e stratificato, con frutta dolce, spezie, cacao e legni ben integrati.', 'Prodotto da miele vergine di canna e affinato in altura con un sistema ispirato alla solera.', 'Caramello, vaniglia, cacao, uvetta, spezie e legno tostato.', 150, array['Rum','Guatemala','Solera','Nessun allergene'], '40% vol.', 'Rum solera', 'Bottiglia 70 cl', 13),
  ('Don Julio 1942', 'don-julio-1942', 'Tequila añejo setosa e profonda, con agave cotta, vaniglia, caramello e rovere in elegante continuità.', 'Creata in omaggio a Don Julio Estrada, che avviò la propria tequila nel 1942 nelle Highlands di Jalisco.', 'Agave cotta, vaniglia, toffee, cacao, rovere e spezie.', 320, array['Tequila','Añejo','Jalisco','Nessun allergene'], '40% vol.', 'Tequila añejo', 'Bottiglia 70 cl', 14),
  ('Patrón Silver', 'patron-silver', 'Tequila blanco pulita e luminosa, con agave dolce, agrumi e pepe. La texture è morbida, il finale fresco.', 'Prodotta a Jalisco da agave Weber blu, unisce lavorazioni tradizionali e selezione accurata dei distillati.', 'Agave fresca, lime, pepe bianco, erbe e lieve dolcezza.', 140, array['Tequila','Blanco','Jalisco','Nessun allergene'], '40% vol.', 'Tequila blanco', 'Bottiglia 70 cl', 15),
  ('Clase Azul Reposado', 'clase-azul-reposado', 'Tequila reposado opulenta e vellutata, con agave cotta, vaniglia, nocciola e spezie dolci.', 'Prodotta a Jalisco e affinata in botti di whiskey americano, è presentata nel caratteristico decanter in ceramica dipinto a mano.', 'Agave cotta, vaniglia, caramello, nocciola, cannella e rovere.', 380, array['Tequila','Reposado','Jalisco','Nessun allergene'], '40% vol.', 'Tequila reposado', 'Bottiglia 70 cl', 16),
  ('Mezcal Montelobos', 'mezcal-montelobos', 'Mezcal artigianale teso e affumicato, con agave arrostita, erbe e mineralità. Il finale è asciutto e persistente.', 'Nato a Oaxaca attorno all''agave Espadín, valorizza cottura in fossa e tecniche tradizionali di produzione.', 'Agave cotta, fumo, erbe, pepe, agrumi e terra umida.', 135, array['Mezcal','Oaxaca','Affumicato','Nessun allergene'], '43,2% vol.', 'Mezcal Espadín', 'Bottiglia 70 cl', 17),
  ('Macallan 12 Double Cask', 'macallan-12-double-cask', 'Single malt dello Speyside elegante e rotondo, in equilibrio tra miele, agrumi, spezie e rovere.', 'Matura per dodici anni in una combinazione di botti di rovere europeo e americano stagionate con sherry.', 'Miele, arancia, uvetta, cannella, vaniglia e rovere.', 190, array['Whisky','Single Malt','Speyside','Nessun allergene'], '40% vol.', 'Single Malt Scotch', 'Bottiglia 70 cl', 18),
  ('Lagavulin 16', 'lagavulin-16', 'Single malt di Islay intenso e marino, con fumo di torba, frutta secca e una profondità calda e persistente.', 'Distillato sulla costa meridionale di Islay e maturato per almeno sedici anni, rappresenta uno stile torbato iconico.', 'Torba, iodio, alghe, frutta secca, vaniglia e spezie.', 190, array['Whisky','Single Malt','Islay','Torbato','Nessun allergene'], '43% vol.', 'Single Malt Scotch', 'Bottiglia 70 cl', 19),
  ('Glenfiddich 12', 'glenfiddich-12', 'Single malt fresco e accessibile, con pera, frutta bianca e una delicata vena di rovere e malto.', 'Prodotto nella distilleria fondata da William Grant nel 1887, matura in botti americane ed europee.', 'Pera, mela, malto, miele, vaniglia e rovere leggero.', 130, array['Whisky','Single Malt','Speyside','Nessun allergene'], '40% vol.', 'Single Malt Scotch', 'Bottiglia 70 cl', 20),
  ('Johnnie Walker Blue Label', 'johnnie-walker-blue-label', 'Blended Scotch profondo e setoso, con miele, frutta, cioccolato e un fumo elegante che accompagna il lungo finale.', 'È la selezione di vertice della casa Johnnie Walker, costruita assemblando whisky scelti per rarità e carattere.', 'Miele, nocciola, cioccolato fondente, frutta secca, spezie e fumo.', 320, array['Whisky','Blended Scotch','Prestige','Nessun allergene'], '40% vol.', 'Blended Scotch Whisky', 'Bottiglia 70 cl', 21),
  ('Hibiki Japanese Harmony', 'hibiki-japanese-harmony', 'Blended whisky giapponese armonioso e raffinato, con fiori, miele, agrumi e un legno delicatamente speziato.', 'Creato da Suntory, riunisce whisky di malto e cereale delle distillerie Yamazaki, Hakushu e Chita.', 'Rosa, litchi, miele, scorza d''arancia, cioccolato bianco e quercia.', 230, array['Whisky','Giappone','Blended','Nessun allergene'], '43% vol.', 'Japanese blended whisky', 'Bottiglia 70 cl', 22);

-- Sposta Don Julio 1942 nella categoria corretta se era già presente altrove.
update public.menu_items as item
set
  category_id = category.id,
  category = category.name
from public.menu_categories as category
where category.slug = 'alcolici-premium'
  and lower(btrim(item.name)) = 'don julio 1942';

update public.menu_items as item
set
  slug = seed.slug,
  description = seed.description,
  story = seed.story,
  ingredients = seed.tasting_notes,
  price = seed.price,
  tags = seed.tags,
  alcohol_level = seed.alcohol_level,
  product_style = seed.product_style,
  serving_format = seed.serving_format,
  serving_temperature = null,
  is_featured = false,
  is_available = true,
  display_order = seed.display_order,
  sort_order = seed.display_order
from noir_bottle_seed as seed
where lower(btrim(item.name)) = lower(btrim(seed.name))
  and lower(btrim(item.category)) = 'alcolici premium';

insert into public.menu_items (
  category_id, name, slug, category, description, story, ingredients, price,
  tags, alcohol_level, product_style, serving_format, serving_temperature,
  is_featured, is_available, display_order, sort_order
)
select
  category.id, seed.name, seed.slug, category.name, seed.description,
  seed.story, seed.tasting_notes, seed.price, seed.tags, seed.alcohol_level,
  seed.product_style, seed.serving_format, null,
  false, true, seed.display_order, seed.display_order
from noir_bottle_seed as seed
join public.menu_categories as category
  on category.slug = 'alcolici-premium'
where not exists (
  select 1
  from public.menu_items as existing
  where lower(btrim(existing.name)) = lower(btrim(seed.name))
    and lower(btrim(existing.category)) = 'alcolici premium'
)
on conflict do nothing;

commit;
