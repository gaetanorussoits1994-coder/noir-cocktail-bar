-- ============================================================================
-- Noir Cocktail Bar - catalogo premium, metadati prodotto e deduplicazione
-- Dipende da 006_dynamic_cocktail_menu.sql.
-- ============================================================================

begin;

alter table public.menu_items
  add column if not exists story text,
  add column if not exists glassware text,
  add column if not exists garnish text,
  add column if not exists preparation_technique text,
  add column if not exists staff_recommendation text,
  add column if not exists pairing text,
  add column if not exists product_style text,
  add column if not exists serving_format text,
  add column if not exists serving_temperature text;

-- Separa le categorie che in precedenza erano aggregate.
update public.menu_categories
set
  name = 'Champagne',
  slug = 'champagne',
  description = 'Maison iconiche e cuvée selezionate per brindisi e occasioni speciali.',
  sort_order = 4,
  is_active = true
where slug = 'champagne-bollicine';

update public.menu_categories
set
  name = 'Cocktail Analcolici',
  slug = 'cocktail-analcolici',
  description = 'Miscelazioni alcohol free costruite con succhi, botaniche e mixer di qualità.',
  sort_order = 9,
  is_active = true
where slug = 'analcolici';

insert into public.menu_categories (
  id, name, slug, description, sort_order, is_active
)
values
  ('70000000-0000-4000-8000-000000000001', 'Cocktail Signature', 'cocktail-signature', 'Creazioni originali firmate Noir, costruite con ingredienti riconoscibili e una precisa identità.', 1, true),
  ('70000000-0000-4000-8000-000000000002', 'Cocktail Classici', 'cocktail-classici', 'I grandi codici della miscelazione internazionale, eseguiti nel rispetto delle ricette.', 2, true),
  ('70000000-0000-4000-8000-000000000017', 'Negroni Collection', 'negroni-collection', 'Il classico italiano e le sue variazioni più autorevoli, dal vermouth al mezcal.', 3, true),
  ('70000000-0000-4000-8000-000000000006', 'Champagne', 'champagne', 'Maison iconiche e cuvée selezionate per brindisi e occasioni speciali.', 4, true),
  ('70000000-0000-4000-8000-000000000008', 'Prosecco', 'prosecco', 'Bollicine italiane fresche e immediate, ideali per aprire la serata.', 5, true),
  ('70000000-0000-4000-8000-000000000009', 'Vini Bianchi', 'vini-bianchi', 'Etichette fresche, minerali o aromatiche servite alla temperatura ideale.', 6, true),
  ('70000000-0000-4000-8000-000000000010', 'Vini Rossi', 'vini-rossi', 'Rossi italiani scelti per struttura, equilibrio e vocazione gastronomica.', 7, true),
  ('70000000-0000-4000-8000-000000000011', 'Birre', 'birre', 'Lager, stout e weiss tra grandi classici italiani e internazionali.', 8, true),
  ('70000000-0000-4000-8000-000000000007', 'Cocktail Analcolici', 'cocktail-analcolici', 'Miscelazioni alcohol free costruite con succhi, botaniche e mixer di qualità.', 9, true),
  ('70000000-0000-4000-8000-000000000012', 'Soft Drinks', 'soft-drinks', 'Bibite classiche, toniche e mixer premium serviti ben freddi.', 10, true),
  ('70000000-0000-4000-8000-000000000013', 'Acque', 'acque', 'Acque minerali naturali e frizzanti in diversi formati.', 11, true),
  ('70000000-0000-4000-8000-000000000014', 'Caffetteria', 'caffetteria', 'Espresso e proposte calde preparate al momento.', 12, true),
  ('70000000-0000-4000-8000-000000000016', 'Food & Cicchetti', 'food-cicchetti', 'Piatti da condividere e piccoli assaggi pensati per accompagnare la drink list.', 13, true),
  ('70000000-0000-4000-8000-000000000015', 'Dolci', 'dolci', 'Finali golosi in formato essenziale, preparati per chiudere la serata con misura.', 14, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

update public.menu_categories
set sort_order = 3, is_active = true
where slug = 'negroni-collection';

update public.menu_categories
set sort_order = 13, is_active = true
where slug = 'food-cicchetti';

update public.menu_categories
set is_active = false
where slug in ('aperitivi-noir', 'cicchetti-shottini', 'alcolici-premium');

-- Sposta le varianti Negroni nella loro collezione dedicata.
update public.menu_items
set category_id = (
  select id from public.menu_categories
  where slug = 'negroni-collection'
  limit 1
)
where lower(btrim(name)) in (
  'americano',
  'boulevardier',
  'coffee negroni',
  'kingston negroni',
  'mezcal negroni',
  'mi-to',
  'negroni classico',
  'negroni sbagliato',
  'old pal',
  'white negroni'
);

update public.menu_items as item
set category = category.name
from public.menu_categories as category
where item.category_id = category.id;

-- Conserva la riga più recente e disponibile di ogni prodotto duplicato.
with ranked as (
  select
    id,
    row_number() over (
      partition by lower(btrim(name)), lower(btrim(category))
      order by is_available desc, updated_at desc, created_at desc, id
    ) as duplicate_rank
  from public.menu_items
)
delete from public.menu_items
where id in (
  select id from ranked where duplicate_rank > 1
);

create unique index if not exists idx_menu_items_unique_name_category
  on public.menu_items (lower(btrim(name)), lower(btrim(category)));

create temporary table noir_premium_seed (
  name text not null,
  slug text not null,
  category_slug text not null,
  description text not null,
  ingredients text,
  price numeric,
  tags text[] not null default '{}',
  alcohol_level text,
  story text,
  glassware text,
  garnish text,
  preparation_technique text,
  staff_recommendation text,
  pairing text,
  product_style text,
  serving_format text,
  serving_temperature text,
  display_order integer not null
) on commit drop;

insert into noir_premium_seed values
  -- Birre: dati di stile e servizio dichiarati dai rispettivi produttori.
  ('Peroni Nastro Azzurro', 'peroni-nastro-azzurro', 'birre', 'Lager italiana chiara dal profilo secco, con note di cereale e un finale delicatamente luppolato. La carbonazione vivace la rende pulita e rinfrescante.', 'Acqua, malto d''orzo, mais italiano, luppolo', 6, array['Birra','Glutine'], '5,1% vol.', 'Nata in Italia negli anni Sessanta, è diventata una delle lager italiane più riconoscibili nel mondo.', 'Calice pilsner', null, 'Servizio diretto, senza ghiaccio', 'Servirla ben fredda, lasciando sviluppare una corona di schiuma compatta.', 'Cicchetti fritti e crostini sapidi', 'Premium lager', 'Bottiglia 33 cl', '4–6 °C', 1),
  ('Heineken', 'heineken', 'birre', 'Lager chiara dal gusto pulito, con leggere note fruttate e una chiusura moderatamente amara. Il corpo snello mantiene il sorso fresco.', 'Acqua, malto d''orzo, estratto di luppolo, lievito', 6, array['Birra','Glutine'], '5% vol.', 'Prodotta dal 1873, utilizza il caratteristico lievito Heineken A-Yeast.', 'Calice pilsner', null, 'Servizio diretto, senza ghiaccio', 'Ideale per chi cerca una lager internazionale lineare e riconoscibile.', 'Tagliere Noir e snack salati', 'Lager', 'Bottiglia 33 cl', '3–5 °C', 2),
  ('Corona Extra', 'corona-extra', 'birre', 'Lager messicana leggera, nitida e morbida, con un equilibrio gentile tra malto e luppolo. Le note di cereale e miele accompagnano un finale asciutto.', 'Acqua, malto d''orzo, cereali non maltati, luppolo', 6, array['Birra','Glutine'], '4,6% vol.', 'Corona Extra nasce in Messico nel 1925 ed è tradizionalmente associata a un servizio informale e molto fresco.', 'Bottiglia', 'Spicchio di lime facoltativo', 'Servizio diretto, senza ghiaccio', 'Aggiungere il lime solo su richiesta, per non coprire il profilo originale.', 'Bao pulled pork o cicchetti speziati', 'Pale lager', 'Bottiglia 33 cl', '3–5 °C', 3),
  ('Ichnusa Non Filtrata', 'ichnusa-non-filtrata', 'birre', 'Lager non filtrata dorata e opalescente, corposa ma morbida. L''aroma è fruttato, con un leggero sentore di luppolo e un finale moderatamente amaro.', 'Acqua, malto d''orzo, luppolo, lievito', 7, array['Birra','Glutine'], '5% vol.', 'Prodotta ad Assemini, conserva i lieviti in sospensione perché non viene filtrata.', 'Bicchiere lager', null, 'Versare lentamente per mantenere la naturale velatura', 'Servirla a 3 °C come indicato dal produttore.', 'Salumi, formaggi e crostini', 'Lager non filtrata', 'Bottiglia 50 cl', '3 °C', 4),
  ('Leffe Blonde', 'leffe-blonde', 'birre', 'Birra d''abbazia bionda dal profilo maltato, fruttato e speziato. Vaniglia e chiodo di garofano accompagnano una dolce amarezza equilibrata.', 'Acqua, malto d''orzo, cereali, luppolo, lievito', 7, array['Birra','Glutine'], '6,6% vol.', 'Leffe richiama la tradizione brassicola dell''abbazia di Notre-Dame de Leffe.', 'Calice a tulipano', null, 'Servizio diretto, senza ghiaccio', 'Lasciarla respirare nel calice per valorizzare le note speziate.', 'Formaggi stagionati e crostacei', 'Belgian abbey blonde', 'Bottiglia 33 cl', '5 °C', 5),
  ('Guinness Draught', 'guinness-draught', 'birre', 'Stout irlandese color rubino scuro con schiuma densa e cremosa. Caffè tostato, cacao, dolcezza e amaro trovano un equilibrio morbido.', 'Acqua, malto d''orzo, orzo, orzo tostato, luppolo, azoto, lievito', 7, array['Birra','Glutine'], '4,2% vol.', 'La versione Draught fu introdotta nel 1959, duecento anni dopo il celebre contratto di Arthur Guinness a St. James''s Gate.', 'Pinta Guinness', null, 'Versata in due tempi', 'Attendere che l''effetto cascade si assesti prima di completare la pinta.', 'Bao pulled pork e carni saporite', 'Irish dry stout', 'Lattina 44 cl', '5–7 °C', 6),
  ('Paulaner Weissbier', 'paulaner-weissbier', 'birre', 'Weissbier naturalmente velata, morbida e fragrante, con note di banana, lievito e spezie. La componente di frumento sostiene una schiuma fine e persistente.', 'Acqua, malto di frumento, malto d''orzo, lievito, luppolo', 7, array['Birra','Glutine'], '5,5% vol.', 'È una delle interpretazioni più note della tradizione bavarese della birra di frumento.', 'Weizenglas', null, 'Versare lentamente includendo i lieviti finali', 'Ruotare delicatamente la bottiglia prima dell''ultimo versaggio.', 'Crostoni, formaggi freschi e piatti speziati', 'Hefe-Weissbier', 'Bottiglia 50 cl', '6–8 °C', 7),
  ('Franziskaner Weissbier', 'franziskaner-weissbier', 'birre', 'Weissbier non filtrata dal corpo morbido e dalla naturale torbidità. Le note di banana matura, agrumi e spezie precedono un finale fresco.', 'Acqua, malto di frumento, malto d''orzo, luppolo, lievito', 7, array['Birra','Glutine'], '5% vol.', 'La sua identità è legata alla tradizione bavarese delle Hefe-Weissbier ad alta fermentazione.', 'Weizenglas', null, 'Versare lentamente includendo i lieviti finali', 'Servirla nel bicchiere alto dedicato per sostenere schiuma e aromi.', 'Bao, crostoni e formaggi delicati', 'Hefe-Weissbier', 'Bottiglia 50 cl', '6–8 °C', 8),
  ('Menabrea Bionda', 'menabrea-bionda', 'birre', 'Lager italiana dal gusto pieno e dall''aroma morbido e bilanciato. Il profilo pulito lascia emergere cereale, florealità e un amaro composto.', 'Acqua, malto d''orzo, mais, luppolo', 6, array['Birra','Glutine'], '4,8% vol.', 'Prodotta a Biella, rappresenta la tradizione del birrificio Menabrea fondato nel 1846.', 'Calice pilsner', null, 'Servizio diretto, senza ghiaccio', 'Servirla tra 6 e 8 °C, come consigliato dal produttore.', 'Crostacei, verdure e cicchetti', 'Premium lager', 'Bottiglia 33 cl', '6–8 °C', 9),

  -- Cocktail analcolici.
  ('Virgin Mojito', 'virgin-mojito', 'cocktail-analcolici', 'Lime fresco, menta e soda restituiscono il carattere aromatico del Mojito senza rum. È dissetante, vegetale e vivace.', 'Lime, menta fresca, zucchero, soda', 8, array['Mocktail','Fresh'], '0% vol.', 'Versione alcohol free del classico highball cubano.', 'Highball', 'Ciuffo di menta e spicchio di lime', 'Build e leggera pestatura', 'Perfetto quando si desidera un drink molto fresco e non alcolico.', 'Cicchetti salati e crostoni', 'Alcohol free highball', null, null, 1),
  ('Virgin Colada', 'virgin-colada', 'cocktail-analcolici', 'Ananas e crema di cocco creano una consistenza vellutata e tropicale. Il lime mantiene il finale fresco e impedisce alla dolcezza di prevalere.', 'Succo d''ananas, crema di cocco, lime', 9, array['Mocktail','Cocco'], '0% vol.', 'Interpretazione analcolica della Piña Colada caraibica.', 'Hurricane', 'Foglia d''ananas', 'Shake con ghiaccio', 'Consigliata a chi cerca morbidezza e profumi tropicali.', 'Dolci al cioccolato o frutta fresca', 'Alcohol free tropical', null, null, 2),
  ('Virgin Spritz', 'virgin-spritz', 'cocktail-analcolici', 'Aperitivo analcolico agrumato, amaricante e delicatamente frizzante. La struttura resta asciutta e adatta all''inizio della serata.', 'Bitter analcolico, sparkling tea, soda, arancia', 8, array['Mocktail','Bitter'], '0% vol.', 'Riprende il rituale veneziano dello Spritz eliminando la componente alcolica.', 'Calice vino', 'Mezza fetta d''arancia', 'Build su ghiaccio', 'Ideale come aperitivo alcohol free.', 'Tagliere Noir e olive', 'Alcohol free spritz', null, null, 3),
  ('Noir Sunset', 'noir-sunset', 'cocktail-analcolici', 'Arancia rossa, melograno e lime disegnano un profilo fruttato ma teso. La soda al pompelmo aggiunge una vena amara e luminosa.', 'Arancia rossa, melograno, lime, soda al pompelmo', 9, array['Mocktail','Citrus'], '0% vol.', 'Creazione analcolica della casa ispirata ai colori dell''ora dorata.', 'Highball', 'Twist di pompelmo', 'Shake e top di soda', 'Da scegliere se si cerca frutta con un finale non troppo dolce.', 'Bao pulled pork', 'Noir alcohol free signature', null, null, 4),
  ('Berry Tonic', 'berry-tonic', 'cocktail-analcolici', 'Frutti di bosco, limone e tonica costruiscono un drink asciutto e profumato. Il finale chinato bilancia la naturale dolcezza della frutta.', 'Cordial ai frutti di bosco, limone, acqua tonica', 8, array['Mocktail','Berry'], '0% vol.', 'Creazione contemporanea pensata intorno alla freschezza della tonica.', 'Copa', 'Frutti di bosco e scorza di limone', 'Build su ghiaccio', 'Ottimo per chi apprezza i profili fruttati ma asciutti.', 'Crostini con formaggi freschi', 'Alcohol free tonic', null, null, 5),
  ('Citrus Garden', 'citrus-garden', 'cocktail-analcolici', 'Pompelmo, limone e basilico offrono un aroma verde e agrumato. La soda completa un drink verticale, fresco e poco dolce.', 'Pompelmo rosa, limone, basilico, sciroppo semplice, soda', 8, array['Mocktail','Citrus'], '0% vol.', 'Creazione della casa dedicata agli agrumi e alle erbe mediterranee.', 'Collins', 'Basilico e scorza di pompelmo', 'Shake e top di soda', 'Consigliato come apertura fresca della serata.', 'Burrata, alici e piatti mediterranei', 'Noir alcohol free signature', null, null, 6),
  ('Shirley Temple', 'shirley-temple', 'cocktail-analcolici', 'Ginger ale, granatina e lime compongono un classico analcolico frizzante. Il profilo è dolce, speziato e immediato.', 'Ginger ale, granatina, lime', 7, array['Mocktail'], '0% vol.', 'Il drink nacque negli Stati Uniti negli anni Trenta e porta il nome della giovane attrice Shirley Temple.', 'Highball', 'Ciliegia e spicchio di lime', 'Build su ghiaccio', 'Una scelta classica per chi preferisce un analcolico più morbido.', 'Dessert cremosi', 'Alcohol free classic', null, null, 7),

  -- Bollicine e vini.
  ('Prosecco DOC Brut', 'prosecco-doc-brut', 'prosecco', 'Bollicina italiana fresca, con note di mela, pera e fiori bianchi. Il finale brut mantiene il calice agile e pulito.', 'Uve Glera, solfiti', 7, array['Solfiti','Bollicine'], '11% vol.', 'Il Prosecco DOC nasce principalmente da uve Glera nel Nord-Est italiano.', 'Flûte', null, 'Servizio al calice', 'Servire appena stappato per preservare fragranza e perlage.', 'Cicchetti, crostacei e aperitivo', 'Prosecco DOC Brut', 'Calice 125 ml', '6–8 °C', 1),
  ('Prosecco DOC Rosé', 'prosecco-doc-rose', 'prosecco', 'Perlage fine, piccoli frutti rossi e una vena floreale definiscono un sorso fresco. La chiusura è asciutta e delicata.', 'Uve Glera e Pinot Nero, solfiti', 8, array['Solfiti','Bollicine'], '11% vol.', 'La tipologia Prosecco DOC Rosé unisce Glera e una quota di Pinot Nero vinificato in rosso.', 'Flûte', null, 'Servizio al calice', 'Ottimo calice di benvenuto, servito molto fresco.', 'Tartare e salumi delicati', 'Prosecco DOC Rosé', 'Calice 125 ml', '6–8 °C', 2),
  ('Vermentino di Sardegna', 'vermentino-di-sardegna', 'vini-bianchi', 'Bianco mediterraneo fresco e sapido, con note di agrumi, erbe aromatiche e frutta bianca. Il finale minerale invita al secondo sorso.', 'Uve Vermentino, solfiti', 8, array['Solfiti','Vino bianco'], '12,5% vol.', 'Il Vermentino trova in Sardegna una delle sue espressioni italiane più riconoscibili.', 'Calice da bianco', null, 'Servizio al calice', 'Ideale per chi cerca freschezza e una netta impronta mediterranea.', 'Burrata, alici e pesce', 'Vermentino di Sardegna DOC', 'Calice 125 ml', '8–10 °C', 1),
  ('Pinot Grigio', 'pinot-grigio', 'vini-bianchi', 'Bianco secco e lineare, con profumi di pera, mela e fiori chiari. La freschezza accompagna un finale pulito e delicato.', 'Uve Pinot Grigio, solfiti', 8, array['Solfiti','Vino bianco'], '12,5% vol.', 'Il Pinot Grigio è una delle varietà bianche più diffuse nel Nord Italia.', 'Calice da bianco', null, 'Servizio al calice', 'Un calice versatile e immediato.', 'Cicchetti leggeri e formaggi freschi', 'Pinot Grigio DOC', 'Calice 125 ml', '8–10 °C', 2),
  ('Chianti Classico', 'chianti-classico', 'vini-rossi', 'Rosso toscano dal profilo di ciliegia, viola e spezie, sostenuto da tannini presenti ma misurati. La freschezza del Sangiovese lo rende gastronomico.', 'Uve Sangiovese, solfiti', 9, array['Solfiti','Vino rosso'], '13,5% vol.', 'Il Chianti Classico nasce nell''area storica compresa tra Firenze e Siena.', 'Calice da rosso', null, 'Servizio al calice', 'Lasciarlo ossigenare qualche minuto prima del servizio.', 'Salumi, formaggi stagionati e tartare', 'Chianti Classico DOCG', 'Calice 125 ml', '16–18 °C', 1),
  ('Valpolicella Ripasso', 'valpolicella-ripasso', 'vini-rossi', 'Rosso veneto morbido e strutturato, con ciliegia matura, spezie e leggere note appassite. Il passaggio sulle vinacce dell''Amarone ne amplia corpo e profondità.', 'Uve Corvina, Corvinone e Rondinella, solfiti', 10, array['Solfiti','Vino rosso'], '14% vol.', 'La tecnica del Ripasso prevede un secondo contatto del vino con le vinacce dell''Amarone o del Recioto.', 'Calice ampio da rosso', null, 'Servizio al calice', 'Consigliato quando si desidera un rosso più avvolgente.', 'Pulled pork e formaggi stagionati', 'Valpolicella Ripasso DOC', 'Calice 125 ml', '16–18 °C', 2),

  -- Soft drink e acque.
  ('Coca-Cola', 'coca-cola', 'soft-drinks', 'Cola classica dal profilo speziato, caramellato e vivace. Servita molto fredda mantiene una carbonazione netta.', 'Acqua gassata, zucchero, colorante caramello, aromi naturali, caffeina', 4, array['Caffeina'], null, 'La formula Coca-Cola fu creata ad Atlanta nel 1886.', 'Highball', 'Fetta di limone facoltativa', 'Servizio diretto su richiesta', 'Servirla ben fredda, con o senza ghiaccio.', 'Snack salati e burger', 'Cola', 'Bottiglia 33 cl', '3–5 °C', 1),
  ('Coca-Cola Zero', 'coca-cola-zero', 'soft-drinks', 'Cola senza zuccheri dal gusto pieno e dalla carbonazione vivace. Le note speziate e agrumate restano nitide nel servizio freddo.', 'Acqua gassata, colorante caramello, acidificante, edulcoranti, aromi naturali, caffeina', 4, array['Caffeina'], null, 'Versione senza zuccheri della cola classica.', 'Highball', 'Fetta di limone facoltativa', 'Servizio diretto su richiesta', 'Scelta adatta a chi desidera una cola senza zuccheri.', 'Snack salati e burger', 'Cola senza zuccheri', 'Bottiglia 33 cl', '3–5 °C', 2),
  ('Fanta', 'fanta', 'soft-drinks', 'Bibita gassata all''arancia dal profilo dolce, agrumato e immediato. Il servizio molto freddo ne valorizza la freschezza.', 'Acqua gassata, zucchero, succo d''arancia, aromi naturali', 4, array[]::text[], null, 'Soft drink all''arancia diffuso a livello internazionale.', 'Highball', 'Fetta d''arancia facoltativa', 'Servizio diretto su richiesta', 'Servire ben fredda.', 'Snack e cicchetti', 'Aranciata', 'Bottiglia 33 cl', '3–5 °C', 3),
  ('Sprite', 'sprite', 'soft-drinks', 'Bibita gassata al limone e lime, limpida e molto fresca. La dolcezza è bilanciata da una netta impronta agrumata.', 'Acqua gassata, zucchero, acidificanti, aromi naturali di limone e lime', 4, array[]::text[], null, 'Soft drink agrumato nato negli Stati Uniti nel 1961.', 'Highball', 'Spicchio di lime facoltativo', 'Servizio diretto su richiesta', 'Servire molto fredda.', 'Cicchetti speziati', 'Lemon-lime soda', 'Bottiglia 33 cl', '3–5 °C', 4),
  ('Schweppes Tonica', 'schweppes-tonica', 'soft-drinks', 'Acqua tonica frizzante dalla caratteristica nota amaricante di chinino. Agrumi e carbonazione sostengono un finale asciutto.', 'Acqua gassata, zucchero, acidificante, aromi naturali, chinino', 4, array[]::text[], null, 'La tradizione Schweppes nelle bevande gassate risale al XVIII secolo.', 'Highball', 'Twist di limone facoltativo', 'Servizio diretto', 'Ottima anche come mixer per gin e distillati.', 'Aperitivo e snack salati', 'Tonic water', 'Bottiglia 18 cl', '3–5 °C', 5),
  ('Ginger Beer', 'ginger-beer', 'soft-drinks', 'Mixer analcolico intenso, speziato e agrumato, dominato dallo zenzero. La carbonazione vivace lascia un finale caldo e persistente.', 'Acqua gassata, zucchero, zenzero, aromi naturali, acidificante', 5, array[]::text[], null, 'La ginger beer moderna conserva il carattere speziato delle tradizionali bevande fermentate allo zenzero.', 'Highball', 'Spicchio di lime facoltativo', 'Servizio diretto', 'Da bere liscia o come mixer per Mule.', 'Bao e piatti speziati', 'Ginger beer analcolica', 'Bottiglia 20 cl', '3–5 °C', 6),
  ('Ginger Ale', 'ginger-ale', 'soft-drinks', 'Bibita gassata allo zenzero più morbida e delicata rispetto alla ginger beer. Le note speziate restano leggere e pulite.', 'Acqua gassata, zucchero, zenzero, aromi naturali, acidificante', 5, array[]::text[], null, 'Nata come soft drink allo zenzero, è diventata anche un mixer classico.', 'Highball', 'Twist di limone facoltativo', 'Servizio diretto', 'Indicata per chi desidera un mixer speziato ma gentile.', 'Crostini e snack', 'Ginger ale', 'Bottiglia 20 cl', '3–5 °C', 7),
  ('Red Bull', 'red-bull', 'soft-drinks', 'Energy drink dolce e vivace con caffeina e taurina. Servito freddo conserva una carbonazione netta.', 'Acqua gassata, zuccheri, taurina, caffeina, vitamine del gruppo B', 5, array['Caffeina'], null, 'Energy drink introdotto sul mercato europeo nel 1987.', 'Highball', null, 'Servizio diretto', 'Non misceliamo automaticamente l''energy drink con alcolici.', 'Servizio singolo', 'Energy drink', 'Lattina 25 cl', '3–5 °C', 8),
  ('Succhi premium', 'succhi-premium', 'soft-drinks', 'Selezione di succhi e nettari di frutta serviti freddi. La disponibilità varia tra ananas, pesca, pera, arancia e mirtillo.', 'Succo o nettare di frutta; verificare l''etichetta della referenza disponibile', 5, array[]::text[], null, 'Una selezione pensata sia per il servizio singolo sia per la miscelazione.', 'Highball', null, 'Servizio diretto', 'Chiedere allo staff il gusto disponibile e gli eventuali allergeni in etichetta.', 'Colazione serale o servizio analcolico', 'Succo di frutta', 'Bottiglia 20 cl', '4–6 °C', 9),
  ('Acqua Panna 0,75L', 'acqua-panna-075', 'acque', 'Acqua minerale naturale dal gusto morbido e delicato. Il formato da tavolo accompagna il pasto senza interferire con aromi e sapori.', 'Acqua minerale naturale', 5, array[]::text[], null, 'Acqua minerale naturale di origine toscana.', 'Calice acqua', null, 'Servizio in bottiglia', 'Consigliata per il tavolo e la degustazione.', 'Tutto il menu', 'Acqua naturale', 'Bottiglia 0,75 L', '8–12 °C', 1),
  ('S.Pellegrino 0,75L', 'san-pellegrino-075', 'acque', 'Acqua minerale frizzante dal perlage fine e persistente. La mineralità accompagna bene piatti e cocktail strutturati.', 'Acqua minerale frizzante con anidride carbonica', 5, array[]::text[], null, 'Acqua minerale italiana proveniente da San Pellegrino Terme.', 'Calice acqua', null, 'Servizio in bottiglia', 'Ideale a tavola quando si preferisce una bollicina minerale.', 'Tutto il menu', 'Acqua frizzante', 'Bottiglia 0,75 L', '8–12 °C', 2),
  ('Acqua naturale 0,5L', 'acqua-naturale-05', 'acque', 'Acqua minerale naturale in formato individuale. Fresca e neutra, è adatta al servizio al banco o al tavolo.', 'Acqua minerale naturale', 3, array[]::text[], null, 'Formato individuale selezionato per il servizio rapido.', 'Calice acqua', null, 'Servizio in bottiglia', 'Servire fresca, non ghiacciata.', 'Tutto il menu', 'Acqua naturale', 'Bottiglia 0,5 L', '8–12 °C', 3),
  ('Acqua frizzante 0,5L', 'acqua-frizzante-05', 'acque', 'Acqua minerale frizzante in formato individuale. La carbonazione pulisce il palato tra un assaggio e l''altro.', 'Acqua minerale frizzante con anidride carbonica', 3, array[]::text[], null, 'Formato individuale selezionato per il servizio rapido.', 'Calice acqua', null, 'Servizio in bottiglia', 'Servire fresca.', 'Tutto il menu', 'Acqua frizzante', 'Bottiglia 0,5 L', '8–12 °C', 4),

  -- Caffetteria, food e dolci.
  ('Espresso', 'espresso', 'caffetteria', 'Caffè espresso estratto al momento, con crema compatta e aroma tostato. Il profilo varia naturalmente con la miscela in uso.', 'Caffè macinato, acqua', 2, array['Caffeina'], null, 'L''espresso italiano concentra in pochi centilitri aromi, corpo e persistenza.', 'Tazzina espresso', null, 'Estrazione espresso', 'Da bere appena servito.', 'Dolci al cioccolato', 'Caffè espresso', 'Tazzina', 'Servizio caldo', 1),
  ('Cappuccino', 'cappuccino', 'caffetteria', 'Espresso, latte caldo e schiuma fine formano una consistenza cremosa. Il caffè resta riconoscibile sotto la dolcezza naturale del latte.', 'Caffè espresso, latte vaccino', 3, array['Caffeina','Latte','Lattosio'], null, 'Classico della caffetteria italiana basato sull''equilibrio tra espresso e latte montato.', 'Tazza cappuccino', 'Cacao solo su richiesta', 'Estrazione espresso e montatura del latte', 'Segnalare allo staff eventuali esigenze relative al latte.', 'Dolci e biscotti', 'Caffetteria con latte', 'Tazza', 'Servizio caldo', 2),
  ('Tagliere Noir', 'tagliere-noir', 'food-cicchetti', 'Una selezione di salumi artigianali, formaggi stagionati e accompagnamenti scelti per condividere un momento di convivialità. Miele, confetture e pane croccante completano contrasti dolci e sapidi.', 'Salumi selezionati, formaggi stagionati, miele, confetture, pane croccante', 18, array['Food','Latte','Lattosio','Glutine'], null, 'Il tagliere raccoglie la tradizione italiana dell''aperitivo in una composizione pensata per la condivisione.', null, null, 'Composizione espressa e servizio al tagliere', 'Condividere al centro del tavolo, iniziando dai sapori più delicati.', 'Noir Negroni, Prosecco Brut o Chianti Classico', 'Tagliere da condivisione', 'Una porzione da condividere', null, 1),
  ('Bao Pulled Pork', 'bao-pulled-pork', 'food-cicchetti', 'Pane bao soffice cotto al vapore farcito con pulled pork cotto lentamente, salsa della casa e cavolo croccante. Il contrasto tra morbidezza, succulenza e freschezza rende ogni boccone equilibrato.', 'Pane bao, pulled pork, salsa della casa, cavolo croccante', 10, array['Food','Glutine','Soia','Sesamo'], null, 'Il bao incontra la cottura lenta del pulled pork in una proposta contemporanea da cocktail bar.', null, 'Sesamo', 'Cottura al vapore e farcitura espressa', 'Mangiarlo caldo, appena servito.', 'Corona Extra, Guinness Draught o Noir Sunset', 'Bao farcito', 'Porzione individuale', 'Servizio caldo', 2),
  ('Tartare Mini Toast', 'tartare-mini-toast', 'food-cicchetti', 'Tartare di manzo condita al momento, servita su pane tostato con senape delicata ed erbe fresche. Il pane croccante sostiene la consistenza morbida della carne e una sapidità misurata.', 'Manzo crudo selezionato, pane, senape, erbe aromatiche, olio EVO', 12, array['Food','Glutine','Senape'], null, 'Un formato da cocktail bar ispirato al servizio classico della tartare di manzo.', null, 'Erbe fresche', 'Taglio al coltello, condimento espresso e tostatura', 'Consumare appena servita.', 'Old Fashioned o Chianti Classico', 'Cicchetto di carne cruda', 'Porzione individuale', 'Servizio fresco', 3),
  ('Crostone Burrata & Alici', 'crostone-burrata-alici', 'food-cicchetti', 'Pane tostato, burrata cremosa e alici sapide compongono un crostone mediterraneo netto e goloso. Limone e olio extravergine alleggeriscono il finale.', 'Pane, burrata, alici, limone, olio EVO', 9, array['Food','Glutine','Latte','Lattosio','Pesce'], null, 'Una combinazione italiana classica riletta in formato da aperitivo.', null, 'Scorza di limone', 'Tostatura e montaggio espresso', 'Mangiarlo subito per conservare il contrasto tra pane e burrata.', 'Golden Hour, White Negroni o Vermentino', 'Crostone mediterraneo', 'Porzione individuale', 'Servizio tiepido', 4),
  ('Tiramisù Noir', 'tiramisu-noir', 'dolci', 'Crema al mascarpone, caffè e cacao amaro in una porzione morbida e intensa. La dolcezza è contenuta per lasciare spazio alle note tostate.', 'Mascarpone, uova, zucchero, caffè, cacao, savoiardi', 7, array['Latte','Lattosio','Uova','Glutine','Caffeina'], null, 'Rilettura Noir del classico dessert italiano al caffè.', null, 'Cacao amaro', 'Montaggio a freddo', 'Ideale come chiusura da condividere con un distillato.', 'Espresso Martini o caffè espresso', 'Dessert al cucchiaio', 'Porzione individuale', 'Servizio fresco', 1),
  ('Brownie al cioccolato', 'brownie-cioccolato', 'dolci', 'Brownie fondente dal cuore umido e dalla superficie leggermente croccante. Il cacao intenso è bilanciato da una piccola nota salina.', 'Cioccolato fondente, burro, uova, zucchero, farina, cacao', 7, array['Latte','Lattosio','Uova','Glutine'], null, 'Dolce di tradizione americana proposto in formato essenziale.', null, 'Cacao e sale in fiocchi', 'Cottura al forno', 'Servirlo leggermente tiepido.', 'Guinness Draught o Cocoa Martini', 'Dolce da forno', 'Porzione individuale', 'Servizio tiepido', 2);

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
  story,
  glassware,
  garnish,
  preparation_technique,
  staff_recommendation,
  pairing,
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
  seed.name,
  seed.slug,
  category.name,
  seed.description,
  seed.ingredients,
  seed.price,
  seed.tags,
  seed.alcohol_level,
  seed.story,
  seed.glassware,
  seed.garnish,
  seed.preparation_technique,
  seed.staff_recommendation,
  seed.pairing,
  seed.product_style,
  seed.serving_format,
  seed.serving_temperature,
  false,
  true,
  seed.display_order,
  seed.display_order
from noir_premium_seed as seed
join public.menu_categories as category
  on category.slug = seed.category_slug
on conflict do nothing;

-- Aggiorna anche le righe già presenti, evitando che un seed rieseguito le duplichi.
update public.menu_items as item
set
  slug = seed.slug,
  description = seed.description,
  ingredients = seed.ingredients,
  price = seed.price,
  tags = seed.tags,
  alcohol_level = seed.alcohol_level,
  story = seed.story,
  glassware = seed.glassware,
  garnish = seed.garnish,
  preparation_technique = seed.preparation_technique,
  staff_recommendation = seed.staff_recommendation,
  pairing = seed.pairing,
  product_style = seed.product_style,
  serving_format = seed.serving_format,
  serving_temperature = seed.serving_temperature,
  display_order = seed.display_order,
  sort_order = seed.display_order,
  is_available = true
from noir_premium_seed as seed
join public.menu_categories as category
  on category.slug = seed.category_slug
where item.category_id = category.id
  and lower(btrim(item.name)) = lower(btrim(seed.name));

-- Schede editoriali specifiche per i cocktail già presenti nel catalogo.
create temporary table noir_cocktail_details (
  name text primary key,
  description text not null,
  story text not null,
  alcohol_level text not null,
  glassware text not null,
  garnish text not null,
  preparation_technique text not null,
  staff_recommendation text not null,
  pairing text not null,
  allergen_tags text[] not null default '{}'
) on commit drop;

insert into noir_cocktail_details values
  ('Black Orchid', 'Vodka, violetta, mora e limone definiscono un cocktail floreale dal colore profondo. La componente acida tiene in equilibrio il frutto e la texture soffice.', 'Signature Noir ispirato alle sfumature scure dell''orchidea e costruito per un servizio elegante in coppa.', 'Circa 18% vol.', 'Coppa Nick & Nora', 'Mora fresca e petalo edibile', 'Shake e double strain', 'Lasciarlo riposare qualche secondo in coppa prima del primo sorso.', 'Dessert al cioccolato fondente', array[]::text[]),
  ('Cocoa Martini', 'Vodka, espresso, cold brew e liquore al cacao compongono un after-dinner tostato e asciutto. Caffè e cacao restano distinti, senza trasformarlo in un dessert eccessivamente dolce.', 'Creazione Noir che avvicina la struttura dell''Espresso Martini alle note amare del cacao.', 'Circa 20% vol.', 'Coppa cocktail', 'Tre chicchi di caffè', 'Hard shake e double strain', 'Consigliato dopo cena, quando si desidera un cocktail intenso ma pulito.', 'Tiramisù Noir', array['Caffeina']),
  ('Golden Hour', 'Gin, bergamotto, limone e cordial allo Champagne offrono agrumi maturi e una trama luminosa. Il finale è secco, floreale e leggermente vinoso.', 'Signature della casa dedicato alla luce dorata che precede la notte.', 'Circa 17% vol.', 'Coppa Nick & Nora', 'Twist di bergamotto o limone', 'Shake e double strain', 'È una scelta precisa per iniziare con un signature fresco e non troppo dolce.', 'Crostone burrata e alici', array['Solfiti']),
  ('Midnight Boulevard', 'Bourbon, bitter, vermouth rosso e cannella creano un profilo caldo e speziato. La dolcezza del whiskey sostiene un finale amaricante e persistente.', 'Rilettura Noir del Boulevardier, pensata per la parte più lenta e raccolta della serata.', 'Circa 24% vol.', 'Tumbler basso', 'Scorza d''arancia e cannella', 'Stir e servizio su grande cubo', 'Da bere lentamente, lasciando che la diluizione apra le spezie.', 'Tagliere Noir', array['Solfiti']),
  ('Noir Negroni', 'Gin premium, bitter, vermouth rosso ed essenza di cacao danno profondità al classico equilibrio in parti uguali. Il cacao resta sul fondo aromatico, mentre arancia e botaniche guidano il finale.', 'Signature della casa nato dal desiderio di rendere il Negroni più scuro senza alterarne la struttura.', 'Circa 24% vol.', 'Tumbler basso', 'Scorza d''arancia', 'Stir e servizio su grande cubo', 'Ideale per chi conosce il Negroni e cerca una variazione misurata.', 'Tagliere Noir o brownie fondente', array['Solfiti']),
  ('Velvet Smoke', 'Mezcal, vermouth rosso e bitter costruiscono una base affumicata, vinosa e amaricante. L''arancia bruciata aggiunge oli essenziali e una chiusura calda.', 'Signature Noir centrato sul dialogo tra agave cotta, vino aromatizzato e agrume tostato.', 'Circa 23% vol.', 'Tumbler basso', 'Mezza ruota d''arancia bruciata', 'Stir e servizio su grande cubo', 'Sceglierlo quando si desidera un drink deciso con affumicatura evidente.', 'Bao pulled pork', array['Solfiti']),
  ('Daiquiri', 'Rum bianco, lime fresco e zucchero formano un sour essenziale e nitido. La ricetta vive sull''equilibrio preciso tra acidità, dolcezza e carattere del rum.', 'Nato tra Cuba e la fine dell''Ottocento, il Daiquiri è uno dei riferimenti fondamentali della miscelazione caraibica.', 'Circa 20% vol.', 'Coppa cocktail', 'Disco sottile di lime', 'Shake e fine strain', 'Chiederlo molto secco per mettere in primo piano il rum.', 'Cicchetti fritti o crostacei', array[]::text[]),
  ('Dry Martini', 'London dry gin e vermouth dry compongono un cocktail trasparente, freddo e rigoroso. Botaniche, note vinose e diluizione devono restare in perfetto controllo.', 'Il Martini si afferma tra la fine dell''Ottocento e il Novecento, diventando un simbolo della miscelazione internazionale.', 'Circa 28% vol.', 'Coppa Martini', 'Oliva oppure twist di limone', 'Stir e strain', 'Specificare allo staff la preferenza tra oliva, twist e grado di secchezza.', 'Mandorle salate e olive', array['Solfiti']),
  ('Espresso Martini', 'Vodka, liquore al caffè ed espresso appena estratto producono una crema compatta e un gusto tostato. La dolcezza sostiene il caffè senza coprirne l''amaro naturale.', 'Dick Bradsell creò il drink a Londra negli anni Ottanta; oggi è un moderno classico da dopocena.', 'Circa 18% vol.', 'Coppa cocktail', 'Tre chicchi di caffè', 'Hard shake e double strain', 'Da bere subito, finché crema e temperatura sono al punto giusto.', 'Tiramisù Noir', array['Caffeina']),
  ('Mai Tai', 'Rum scuro, rum agricole, orange curaçao, lime e orzata creano un tiki complesso e agrumato. La mandorla arrotonda il distillato senza nascondere la struttura dei rum.', 'Il Mai Tai fu codificato nella cultura tiki californiana degli anni Quaranta ed è legato alla figura di Trader Vic.', 'Circa 20% vol.', 'Tumbler basso', 'Menta e mezzo lime', 'Shake e servizio su ghiaccio tritato', 'Mescolarlo brevemente con la cannuccia per integrare la diluizione iniziale.', 'Bao pulled pork', array['Mandorla','Frutta a guscio']),
  ('Manhattan', 'Rye whiskey, vermouth rosso e bitter aromatico danno un cocktail secco, speziato e vinoso. La texture setosa accompagna un finale lungo di spezie e ciliegia.', 'Documentato dalla seconda metà dell''Ottocento, il Manhattan è uno dei grandi classici a base whiskey.', 'Circa 27% vol.', 'Coppa Nick & Nora', 'Ciliegia al maraschino', 'Stir e strain', 'Il rye accentua spezie e secchezza; chiedere bourbon per un risultato più morbido.', 'Salumi stagionati', array['Solfiti']),
  ('Margarita', 'Tequila blanco, triple sec e lime offrono agave, agrume e una misurata dolcezza d''arancia. Il bordo salato, se richiesto, amplifica freschezza e sapidità.', 'Le origini sono contese, ma il Margarita si consolida nel Novecento come riferimento mondiale della miscelazione alla tequila.', 'Circa 22% vol.', 'Coppa Margarita', 'Mezzo bordo di sale e lime', 'Shake e fine strain', 'Consigliamo il mezzo bordo di sale per poter alternare sorsi più o meno sapidi.', 'Bao pulled pork o crostini speziati', array[]::text[]),
  ('Martini Cocktail', 'Gin e vermouth dry sono raffreddati e diluiti con precisione per ottenere un profilo netto. La guarnizione scelta orienta il drink verso note agrumate oppure più sapide.', 'È la forma più essenziale della famiglia Martini, evoluta dalle ricette a base gin e vermouth del tardo Ottocento.', 'Circa 28% vol.', 'Coppa Martini', 'Oliva oppure twist di limone', 'Stir e strain', 'Parlare con il bartender per definire ratio, garnish e temperatura desiderati.', 'Olive e mandorle salate', array['Solfiti']),
  ('Mojito', 'Rum bianco, lime, menta, zucchero e soda formano un long drink fresco e aromatico. La menta viene lavorata con delicatezza per evitare note vegetali amare.', 'Il Mojito è legato alla tradizione cubana e discende da antiche miscele di distillato, agrumi, zucchero ed erbe.', 'Circa 12% vol.', 'Highball', 'Ciuffo di menta e spicchio di lime', 'Build e leggera pestatura', 'Bere attraverso gli aromi della menta senza schiacciarla ulteriormente.', 'Cicchetti salati e piatti speziati', array[]::text[]),
  ('Moscow Mule', 'Vodka, lime e ginger beer compongono un highball diretto, agrumato e speziato. La piccantezza dello zenzero guida un finale molto rinfrescante.', 'Il Moscow Mule nacque negli Stati Uniti negli anni Quaranta e rese celebre il servizio nella mug di rame.', 'Circa 12% vol.', 'Mug di rame', 'Spicchio di lime', 'Build su ghiaccio', 'Tenere il drink molto freddo e non lasciare diluire eccessivamente il ghiaccio.', 'Bao pulled pork', array[]::text[]),
  ('Old Fashioned', 'Bourbon o rye, zucchero e bitter aromatico mettono il whiskey al centro del bicchiere. Diluizione e oli d''arancia ne aprono progressivamente le note di legno e spezie.', 'Discende dalla definizione ottocentesca di cocktail composta da distillato, zucchero, acqua e bitter.', 'Circa 30% vol.', 'Tumbler basso', 'Scorza d''arancia', 'Stir e servizio su grande cubo', 'Scegliere rye per maggiore spezia o bourbon per una trama più rotonda.', 'Brownie fondente o formaggi stagionati', array[]::text[]),
  ('Penicillin', 'Blended Scotch, limone, miele e zenzero creano un sour caldo e pungente. Un float di whisky torbato aggiunge fumo e profondità aromatica.', 'Sam Ross creò il Penicillin a New York nel 2005, trasformandolo rapidamente in un moderno classico.', 'Circa 18% vol.', 'Tumbler basso', 'Zenzero candito', 'Shake, strain e float di Islay whisky', 'Avvicinare il bicchiere lentamente per percepire prima la componente torbata.', 'Formaggi stagionati', array[]::text[]),
  ('Tommy’s Margarita', 'Tequila blanco, lime e sciroppo d''agave sostituiscono il triple sec con una dolcezza più morbida. L''agave resta protagonista dall''attacco al finale.', 'Julio Bermejo creò questa variazione negli anni Novanta al Tommy''s Mexican Restaurant di San Francisco.', 'Circa 20% vol.', 'Tumbler basso', 'Spicchio di lime', 'Shake e servizio su ghiaccio', 'È la scelta giusta per assaggiare la tequila in una Margarita più essenziale.', 'Bao pulled pork', array[]::text[]),
  ('Whiskey Sour', 'Bourbon, limone, zucchero e albume formano un sour cremoso ma teso. Il bitter aromatico completa profumo e struttura senza appesantire.', 'La famiglia dei sour è documentata nell''Ottocento; il Whiskey Sour ne è una delle espressioni più durature.', 'Circa 17% vol.', 'Tumbler basso', 'Gocce di bitter e scorza di limone', 'Dry shake, shake con ghiaccio e strain', 'Lasciare che la schiuma si stabilizzi prima di bere.', 'Tagliere Noir', array['Uova']),
  ('Americano', 'Bitter italiano, vermouth rosso e soda creano un aperitivo leggero, vinoso e amaricante. La carbonazione allunga il drink e ne esalta gli agrumi.', 'Evoluzione del Milano-Torino, l''Americano si diffuse tra la fine dell''Ottocento e l''inizio del Novecento.', 'Circa 10% vol.', 'Highball', 'Mezza fetta d''arancia', 'Build su ghiaccio', 'Ideale come primo drink grazie alla gradazione contenuta.', 'Tagliere Noir e olive', array['Solfiti']),
  ('Boulevardier', 'Bourbon o rye, bitter e vermouth rosso trasferiscono la struttura del Negroni sul whiskey. Spezie, arancia e note vinose producono un finale caldo e persistente.', 'Il Boulevardier compare nel volume Barflies and Cocktails del 1927 ed è associato allo scrittore Erskine Gwynne.', 'Circa 25% vol.', 'Tumbler basso', 'Scorza d''arancia', 'Stir e servizio su grande cubo', 'Scegliere rye per un profilo più secco e speziato.', 'Salumi e formaggi stagionati', array['Solfiti']),
  ('Coffee Negroni', 'Gin, bitter, vermouth rosso e cold brew aggiungono tostatura alla struttura del Negroni. Il caffè prolunga l''amaro e rende il finale più scuro.', 'Variazione contemporanea nata dall''incontro tra il rituale del caffè e il classico aperitivo italiano.', 'Circa 22% vol.', 'Tumbler basso', 'Scorza d''arancia e chicco di caffè', 'Stir e servizio su grande cubo', 'Consigliato dopo cena o con un dessert poco dolce.', 'Brownie al cioccolato', array['Solfiti','Caffeina']),
  ('Kingston Negroni', 'Rum giamaicano, bitter e vermouth rosso danno al Negroni esteri fruttati e una forte impronta tropicale. Banana matura, spezie e arancia accompagnano l''amaro.', 'Joaquín Simó creò il Kingston Negroni a New York nel 2009 usando rum giamaicano al posto del gin.', 'Circa 25% vol.', 'Tumbler basso', 'Scorza d''arancia', 'Stir e servizio su grande cubo', 'Da scegliere se si ama il Negroni ma si cercano rum e frutta matura.', 'Bao pulled pork', array['Solfiti']),
  ('Mezcal Negroni', 'Mezcal, bitter italiano e vermouth rosso sostituiscono le botaniche del gin con agave cotta e fumo. Il risultato resta fedele alla struttura amaricante del Negroni.', 'Twist contemporaneo che applica la formula in parti uguali al distillato messicano d''agave.', 'Circa 24% vol.', 'Tumbler basso', 'Scorza d''arancia', 'Stir e servizio su grande cubo', 'Perfetto per chi cerca una variazione affumicata ma ancora riconoscibile.', 'Bao pulled pork o tagliere Noir', array['Solfiti']),
  ('Mi-To', 'Bitter di Milano e vermouth rosso di Torino si incontrano in un aperitivo essenziale. Dolcezza vinosa, agrumi e amaro convivono senza aggiunta di soda.', 'Il Milano-Torino precede Americano e Negroni e prende il nome dalle città d''origine dei due ingredienti.', 'Circa 16% vol.', 'Tumbler basso', 'Scorza d''arancia', 'Build su ghiaccio e breve stir', 'Un ottimo ingresso alla famiglia del Negroni con gradazione più contenuta.', 'Cicchetti salati', array['Solfiti']),
  ('Negroni Classico', 'Gin, bitter italiano e vermouth rosso in parti uguali creano un equilibrio netto tra botaniche, dolcezza vinosa e amaro. La diluizione sul ghiaccio ne apre progressivamente gli aromi.', 'La tradizione colloca la nascita del Negroni a Firenze nel 1919, legandola al conte Camillo Negroni.', 'Circa 24% vol.', 'Tumbler basso', 'Scorza d''arancia', 'Stir e servizio su grande cubo', 'Berlo lentamente per seguire l''evoluzione della diluizione.', 'Tagliere Noir', array['Solfiti']),
  ('Negroni Sbagliato', 'Bitter e vermouth rosso vengono allungati con spumante brut al posto del gin. Il perlage rende il drink più fresco, vinoso e leggero.', 'Mirko Stocchetto creò lo Sbagliato al Bar Basso di Milano nei primi anni Settanta.', 'Circa 13% vol.', 'Calice vino', 'Mezza fetta d''arancia', 'Build su ghiaccio con top di spumante', 'Ideale come aperitivo quando si desidera la firma del Negroni con più leggerezza.', 'Crostini e salumi delicati', array['Solfiti']),
  ('Old Pal', 'Rye whiskey, bitter e vermouth dry producono una variazione secca, speziata e affilata. Rispetto al Boulevardier riduce la dolcezza e mette in evidenza cereale e amaro.', 'Il drink appare nell''opera di Harry MacElhone degli anni Venti ed è dedicato al giornalista sportivo William “Sparrow” Robertson.', 'Circa 27% vol.', 'Coppa Nick & Nora', 'Twist di limone', 'Stir e strain', 'Consigliato agli amanti dei cocktail secchi e diretti.', 'Formaggi stagionati', array['Solfiti']),
  ('White Negroni', 'Gin, Suze e vermouth bianco secco reinterpretano il Negroni con genziana, fiori e agrumi. Il colore è chiaro, ma il finale resta decisamente amaricante.', 'Wayne Collins creò il White Negroni nel 2001 durante Vinexpo a Bordeaux.', 'Circa 25% vol.', 'Tumbler basso', 'Twist di pompelmo', 'Stir e servizio su grande cubo', 'Da scegliere per una lettura più floreale e secca della famiglia Negroni.', 'Burrata e alici', array['Solfiti']);

update public.menu_items as item
set
  description = detail.description,
  story = detail.story,
  alcohol_level = detail.alcohol_level,
  glassware = detail.glassware,
  garnish = detail.garnish,
  preparation_technique = detail.preparation_technique,
  staff_recommendation = detail.staff_recommendation,
  pairing = detail.pairing,
  tags = (
    select array_agg(distinct tag)
    from unnest(coalesce(item.tags, '{}'::text[]) || detail.allergen_tags) as tag
  )
from noir_cocktail_details as detail
where lower(btrim(item.name)) = lower(btrim(detail.name))
  and item.category in (
    'Cocktail Signature',
    'Cocktail Classici',
    'Negroni Collection'
  );

commit;
