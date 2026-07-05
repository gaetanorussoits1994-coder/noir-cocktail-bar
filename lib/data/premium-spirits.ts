export type PremiumSpirit = {
  id: string;
  name: string;
  slug: string;
  description: { it: string; en: string };
  story: { it: string; en: string };
  tastingNotes: { it: string; en: string };
  price: number;
  tags: string[];
  alcoholLevel: string;
  servingFormat: string;
  sortOrder: number;
};

export const premiumSpirits: PremiumSpirit[] = [
  {
    id: "fallback-belvedere-vodka",
    name: "Belvedere Vodka",
    slug: "belvedere-vodka",
    description: {
      it: "Vodka polacca premium, celebre per purezza e morbidezza. La segale dona una trama vellutata, precisa e persistente.",
      en: "Premium Polish vodka celebrated for its purity and softness. Rye gives it a velvety, precise and persistent profile.",
    },
    story: {
      it: "Prodotta in Polonia secondo una tradizione secolare, prende il nome dal palazzo Belweder di Varsavia.",
      en: "Produced in Poland according to centuries-old tradition, it takes its name from Warsaw's Belweder Palace.",
    },
    tastingNotes: {
      it: "Vaniglia, pepe bianco, mandorla e finale pulito.",
      en: "Vanilla, white pepper, almond and a clean finish.",
    },
    price: 140,
    tags: ["Vodka", "Polonia", "Premium", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 1,
  },
  {
    id: "fallback-beluga-noble-vodka",
    name: "Beluga Noble Vodka",
    slug: "beluga-noble-vodka",
    description: {
      it: "Vodka morbida e composta, costruita su un profilo pulito e una texture setosa. La delicata dolcezza accompagna un finale armonioso.",
      en: "A smooth, composed vodka built around a clean profile and silky texture. Gentle sweetness leads into a harmonious finish.",
    },
    story: {
      it: "La ricetta Noble unisce distillazione accurata, filtrazione e un periodo di riposo prima dell'imbottigliamento.",
      en: "The Noble recipe combines careful distillation, filtration and a resting period before bottling.",
    },
    tastingNotes: {
      it: "Cereale dolce, miele leggero, pepe e chiusura morbida.",
      en: "Sweet grain, light honey, pepper and a soft finish.",
    },
    price: 150,
    tags: ["Vodka", "Noble", "Premium", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 2,
  },
  {
    id: "fallback-grey-goose-vodka",
    name: "Grey Goose Vodka",
    slug: "grey-goose-vodka",
    description: {
      it: "Vodka francese elegante e rotonda, con una consistenza cremosa e un profilo nitido. È pensata per un servizio essenziale e molto pulito.",
      en: "An elegant, rounded French vodka with a creamy texture and clear profile. It is designed for an essential, exceptionally clean serve.",
    },
    story: {
      it: "Nasce in Francia da grano tenero invernale della Piccardia e acqua di sorgente filtrata naturalmente.",
      en: "Made in France from winter wheat grown in Picardy and naturally filtered spring water.",
    },
    tastingNotes: {
      it: "Mandorla, agrume delicato, anice lieve e finale fresco.",
      en: "Almond, delicate citrus, light anise and a fresh finish.",
    },
    price: 145,
    tags: ["Vodka", "Francia", "Premium", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 3,
  },
  {
    id: "fallback-gin-mare",
    name: "Gin Mare",
    slug: "gin-mare",
    description: {
      it: "Gin mediterraneo aromatico e gastronomico, in cui ginepro, oliva ed erbe costiere costruiscono un sorso sapido e complesso.",
      en: "An aromatic, gastronomic Mediterranean gin where juniper, olive and coastal herbs create a savoury, complex profile.",
    },
    story: {
      it: "Distillato in Spagna, interpreta il Mediterraneo attraverso oliva Arbequina, basilico, rosmarino e timo.",
      en: "Distilled in Spain, it interprets the Mediterranean through Arbequina olive, basil, rosemary and thyme.",
    },
    tastingNotes: {
      it: "Ginepro, oliva, rosmarino, timo, basilico e agrumi.",
      en: "Juniper, olive, rosemary, thyme, basil and citrus.",
    },
    price: 130,
    tags: ["Gin", "Mediterraneo", "Botanico", "Nessun allergene"],
    alcoholLevel: "42,7% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 4,
  },
  {
    id: "fallback-hendricks-gin",
    name: "Hendrick's Gin",
    slug: "hendricks-gin",
    description: {
      it: "Gin scozzese floreale e riconoscibile, con una trama morbida di ginepro, rosa e cetriolo. Il finale resta fresco e aromatico.",
      en: "A distinctive floral Scottish gin with a smooth weave of juniper, rose and cucumber. The finish remains fresh and aromatic.",
    },
    story: {
      it: "Creato nella Girvan Distillery, combina distillati prodotti in due alambicchi differenti e infusioni di rosa e cetriolo.",
      en: "Created at Girvan Distillery, it combines spirits from two different stills with rose and cucumber infusions.",
    },
    tastingNotes: {
      it: "Cetriolo, rosa, ginepro, agrumi e pepe.",
      en: "Cucumber, rose, juniper, citrus and pepper.",
    },
    price: 120,
    tags: ["Gin", "Scozia", "Floreale", "Nessun allergene"],
    alcoholLevel: "41,4% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 5,
  },
  {
    id: "fallback-hendricks-neptunia",
    name: "Hendrick's Neptunia",
    slug: "hendricks-neptunia",
    description: {
      it: "Edizione marittima luminosa e fresca, con agrumi costieri e una delicata sensazione salina che prolunga le botaniche classiche.",
      en: "A bright, fresh maritime edition with coastal citrus and a delicate saline sensation extending the classic botanicals.",
    },
    story: {
      it: "Nata dal Cabinet of Curiosities di Hendrick's, è ispirata alla costa dell'Ayrshire e al carattere del mare.",
      en: "Born from Hendrick's Cabinet of Curiosities, it is inspired by the Ayrshire coast and the character of the sea.",
    },
    tastingNotes: {
      it: "Agrumi, erbe costiere, ginepro, cetriolo e finale salino.",
      en: "Citrus, coastal herbs, juniper, cucumber and a saline finish.",
    },
    price: 140,
    tags: ["Gin", "Limited Release", "Marino", "Nessun allergene"],
    alcoholLevel: "43,4% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 6,
  },
  {
    id: "fallback-hendricks-flora-adora",
    name: "Hendrick's Flora Adora",
    slug: "hendricks-flora-adora",
    description: {
      it: "Gin intensamente floreale, morbido e profumato, costruito per esaltare fiori freschi, erbe e la firma di rosa e cetriolo.",
      en: "An intensely floral, soft and fragrant gin designed to highlight fresh flowers, herbs and the signature rose and cucumber.",
    },
    story: {
      it: "Edizione del Cabinet of Curiosities ispirata ai fiori che attirano gli impollinatori nel giardino della master distiller.",
      en: "A Cabinet of Curiosities release inspired by the flowers that attract pollinators in the master distiller's garden.",
    },
    tastingNotes: {
      it: "Fiori freschi, ginepro, cetriolo, rosa e spezie leggere.",
      en: "Fresh flowers, juniper, cucumber, rose and gentle spice.",
    },
    price: 140,
    tags: ["Gin", "Limited Release", "Floreale", "Nessun allergene"],
    alcoholLevel: "43,4% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 7,
  },
  {
    id: "fallback-bombay-sapphire",
    name: "Bombay Sapphire",
    slug: "bombay-sapphire",
    description: {
      it: "London Dry Gin equilibrato e versatile, con ginepro nitido, agrumi e spezie ben integrate. Il profilo è pulito e luminoso.",
      en: "A balanced, versatile London Dry Gin with clear juniper, citrus and well-integrated spice. Its profile is clean and bright.",
    },
    story: {
      it: "Le dieci botaniche vengono lavorate con infusione a vapore; la casa ha sede a Laverstoke Mill, in Inghilterra.",
      en: "Its ten botanicals are vapour-infused; the house is based at Laverstoke Mill in England.",
    },
    tastingNotes: {
      it: "Ginepro, limone, coriandolo, angelica e spezie.",
      en: "Juniper, lemon, coriander, angelica and spice.",
    },
    price: 100,
    tags: ["Gin", "London Dry", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 8,
  },
  {
    id: "fallback-bombay-citron-presse",
    name: "Bombay Citron Pressé",
    slug: "bombay-citron-presse",
    description: {
      it: "Gin agrumato e vivace, arricchito dal carattere naturale dei limoni mediterranei. Freschezza e ginepro restano in equilibrio.",
      en: "A lively citrus gin enriched by the natural character of Mediterranean lemons. Freshness and juniper remain balanced.",
    },
    story: {
      it: "Nasce come espressione agrumata della famiglia Bombay, sviluppata intorno a limoni mediterranei raccolti a maturazione.",
      en: "Created as the citrus expression of the Bombay family, developed around ripe Mediterranean lemons.",
    },
    tastingNotes: {
      it: "Limone maturo, ginepro, coriandolo e spezie delicate.",
      en: "Ripe lemon, juniper, coriander and delicate spice.",
    },
    price: 105,
    tags: ["Gin", "Agrumato", "Nessun allergene"],
    alcoholLevel: "37,5% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 9,
  },
  {
    id: "fallback-tanqueray-no-ten",
    name: "Tanqueray No. Ten",
    slug: "tanqueray-no-ten",
    description: {
      it: "Gin premium secco e brillante, con agrumi freschi in primo piano e una struttura botanica precisa e persistente.",
      en: "A dry, brilliant premium gin led by fresh citrus with a precise, persistent botanical structure.",
    },
    story: {
      it: "Lanciato nel 2000 e chiamato come il piccolo alambicco Tiny Ten, utilizza agrumi freschi nella distillazione.",
      en: "Launched in 2000 and named after the small Tiny Ten still, it uses fresh citrus in its distillation.",
    },
    tastingNotes: {
      it: "Pompelmo, lime, arancia, ginepro e camomilla.",
      en: "Grapefruit, lime, orange, juniper and chamomile.",
    },
    price: 130,
    tags: ["Gin", "Citrus", "Premium", "Nessun allergene"],
    alcoholLevel: "47,3% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 10,
  },
  {
    id: "fallback-monkey-47",
    name: "Monkey 47",
    slug: "monkey-47",
    description: {
      it: "Gin della Foresta Nera complesso e concentrato, capace di unire note resinose, floreali, speziate e agrumate.",
      en: "A complex, concentrated Black Forest gin combining resinous, floral, spicy and citrus notes.",
    },
    story: {
      it: "Prodotto in Germania con quarantasette botaniche e acqua della Foresta Nera, richiama la storia del comandante Montgomery Collins.",
      en: "Made in Germany with forty-seven botanicals and Black Forest water, it recalls the story of Commander Montgomery Collins.",
    },
    tastingNotes: {
      it: "Ginepro, mirtillo rosso, agrumi, fiori, erbe e spezie.",
      en: "Juniper, cranberry, citrus, flowers, herbs and spice.",
    },
    price: 145,
    tags: ["Gin", "Germania", "47 Botaniche", "Nessun allergene"],
    alcoholLevel: "47% vol.",
    servingFormat: "Bottiglia 50 cl",
    sortOrder: 11,
  },
  {
    id: "fallback-diplomatico-reserva",
    name: "Diplomático Reserva Exclusiva",
    slug: "diplomatico-reserva-exclusiva",
    description: {
      it: "Rum venezuelano ricco e avvolgente, con dolcezza misurata, frutta matura e una lunga trama di spezie e legno.",
      en: "A rich, enveloping Venezuelan rum with measured sweetness, ripe fruit and a long weave of spice and oak.",
    },
    story: {
      it: "Nasce ai piedi delle Ande venezuelane dall'unione di distillati affinati e selezionati per profondità e morbidezza.",
      en: "Made at the foot of the Venezuelan Andes by blending aged distillates selected for depth and smoothness.",
    },
    tastingNotes: {
      it: "Arancia, toffee, vaniglia, uvetta, cacao e rovere.",
      en: "Orange, toffee, vanilla, raisin, cacao and oak.",
    },
    price: 130,
    tags: ["Rum", "Venezuela", "Invecchiato", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 12,
  },
  {
    id: "fallback-zacapa-23",
    name: "Zacapa 23",
    slug: "zacapa-23",
    description: {
      it: "Rum guatemalteco morbido e stratificato, con frutta dolce, spezie, cacao e legni ben integrati.",
      en: "A smooth, layered Guatemalan rum with sweet fruit, spice, cacao and beautifully integrated oak.",
    },
    story: {
      it: "Prodotto da miele vergine di canna e affinato in altura con un sistema ispirato alla solera.",
      en: "Made from virgin sugar cane honey and matured at altitude using a system inspired by solera ageing.",
    },
    tastingNotes: {
      it: "Caramello, vaniglia, cacao, uvetta, spezie e legno tostato.",
      en: "Caramel, vanilla, cacao, raisin, spice and toasted oak.",
    },
    price: 150,
    tags: ["Rum", "Guatemala", "Solera", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 13,
  },
  {
    id: "fallback-don-julio-1942",
    name: "Don Julio 1942",
    slug: "don-julio-1942",
    description: {
      it: "Tequila añejo setosa e profonda, con agave cotta, vaniglia, caramello e rovere in elegante continuità.",
      en: "A silky, profound añejo tequila with cooked agave, vanilla, caramel and oak in elegant continuity.",
    },
    story: {
      it: "Creata in omaggio a Don Julio Estrada, che avviò la propria tequila nel 1942 nelle Highlands di Jalisco.",
      en: "Created in tribute to Don Julio Estrada, who began making tequila in 1942 in the Jalisco Highlands.",
    },
    tastingNotes: {
      it: "Agave cotta, vaniglia, toffee, cacao, rovere e spezie.",
      en: "Cooked agave, vanilla, toffee, cacao, oak and spice.",
    },
    price: 320,
    tags: ["Tequila", "Añejo", "Jalisco", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 14,
  },
  {
    id: "fallback-patron-silver",
    name: "Patrón Silver",
    slug: "patron-silver",
    description: {
      it: "Tequila blanco pulita e luminosa, con agave dolce, agrumi e pepe. La texture è morbida, il finale fresco.",
      en: "A clean, bright blanco tequila with sweet agave, citrus and pepper. Its texture is smooth and the finish fresh.",
    },
    story: {
      it: "Prodotta a Jalisco da agave Weber blu, unisce lavorazioni tradizionali e selezione accurata dei distillati.",
      en: "Produced in Jalisco from Blue Weber agave, combining traditional methods with careful spirit selection.",
    },
    tastingNotes: {
      it: "Agave fresca, lime, pepe bianco, erbe e lieve dolcezza.",
      en: "Fresh agave, lime, white pepper, herbs and gentle sweetness.",
    },
    price: 140,
    tags: ["Tequila", "Blanco", "Jalisco", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 15,
  },
  {
    id: "fallback-clase-azul-reposado",
    name: "Clase Azul Reposado",
    slug: "clase-azul-reposado",
    description: {
      it: "Tequila reposado opulenta e vellutata, con agave cotta, vaniglia, nocciola e spezie dolci.",
      en: "An opulent, velvety reposado tequila with cooked agave, vanilla, hazelnut and sweet spice.",
    },
    story: {
      it: "Prodotta a Jalisco e affinata in botti di whiskey americano, è presentata nel caratteristico decanter in ceramica dipinto a mano.",
      en: "Produced in Jalisco and aged in American whiskey casks, it is presented in its signature hand-painted ceramic decanter.",
    },
    tastingNotes: {
      it: "Agave cotta, vaniglia, caramello, nocciola, cannella e rovere.",
      en: "Cooked agave, vanilla, caramel, hazelnut, cinnamon and oak.",
    },
    price: 380,
    tags: ["Tequila", "Reposado", "Jalisco", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 16,
  },
  {
    id: "fallback-mezcal-montelobos",
    name: "Mezcal Montelobos",
    slug: "mezcal-montelobos",
    description: {
      it: "Mezcal artigianale teso e affumicato, con agave arrostita, erbe e mineralità. Il finale è asciutto e persistente.",
      en: "A taut, smoky artisanal mezcal with roasted agave, herbs and minerality. The finish is dry and persistent.",
    },
    story: {
      it: "Nato a Oaxaca attorno all'agave Espadín, valorizza cottura in fossa e tecniche tradizionali di produzione.",
      en: "Born in Oaxaca around Espadín agave, it highlights pit roasting and traditional production techniques.",
    },
    tastingNotes: {
      it: "Agave cotta, fumo, erbe, pepe, agrumi e terra umida.",
      en: "Cooked agave, smoke, herbs, pepper, citrus and damp earth.",
    },
    price: 135,
    tags: ["Mezcal", "Oaxaca", "Affumicato", "Nessun allergene"],
    alcoholLevel: "43,2% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 17,
  },
  {
    id: "fallback-macallan-12-double-cask",
    name: "Macallan 12 Double Cask",
    slug: "macallan-12-double-cask",
    description: {
      it: "Single malt dello Speyside elegante e rotondo, in equilibrio tra miele, agrumi, spezie e rovere.",
      en: "An elegant, rounded Speyside single malt balancing honey, citrus, spice and oak.",
    },
    story: {
      it: "Matura per dodici anni in una combinazione di botti di rovere europeo e americano stagionate con sherry.",
      en: "Matured for twelve years in a combination of European and American oak casks seasoned with sherry.",
    },
    tastingNotes: {
      it: "Miele, arancia, uvetta, cannella, vaniglia e rovere.",
      en: "Honey, orange, raisin, cinnamon, vanilla and oak.",
    },
    price: 190,
    tags: ["Whisky", "Single Malt", "Speyside", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 18,
  },
  {
    id: "fallback-lagavulin-16",
    name: "Lagavulin 16",
    slug: "lagavulin-16",
    description: {
      it: "Single malt di Islay intenso e marino, con fumo di torba, frutta secca e una profondità calda e persistente.",
      en: "An intense, maritime Islay single malt with peat smoke, dried fruit and warm, persistent depth.",
    },
    story: {
      it: "Distillato sulla costa meridionale di Islay e maturato per almeno sedici anni, rappresenta uno stile torbato iconico.",
      en: "Distilled on Islay's southern coast and matured for at least sixteen years, it represents an iconic peated style.",
    },
    tastingNotes: {
      it: "Torba, iodio, alghe, frutta secca, vaniglia e spezie.",
      en: "Peat, iodine, seaweed, dried fruit, vanilla and spice.",
    },
    price: 190,
    tags: ["Whisky", "Single Malt", "Islay", "Torbato", "Nessun allergene"],
    alcoholLevel: "43% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 19,
  },
  {
    id: "fallback-glenfiddich-12",
    name: "Glenfiddich 12",
    slug: "glenfiddich-12",
    description: {
      it: "Single malt fresco e accessibile, con pera, frutta bianca e una delicata vena di rovere e malto.",
      en: "A fresh, approachable single malt with pear, white fruit and a delicate thread of oak and malt.",
    },
    story: {
      it: "Prodotto nella distilleria fondata da William Grant nel 1887, matura in botti americane ed europee.",
      en: "Produced at the distillery founded by William Grant in 1887, it matures in American and European oak casks.",
    },
    tastingNotes: {
      it: "Pera, mela, malto, miele, vaniglia e rovere leggero.",
      en: "Pear, apple, malt, honey, vanilla and light oak.",
    },
    price: 130,
    tags: ["Whisky", "Single Malt", "Speyside", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 20,
  },
  {
    id: "fallback-johnnie-walker-blue",
    name: "Johnnie Walker Blue Label",
    slug: "johnnie-walker-blue-label",
    description: {
      it: "Blended Scotch profondo e setoso, con miele, frutta, cioccolato e un fumo elegante che accompagna il lungo finale.",
      en: "A deep, silky blended Scotch with honey, fruit, chocolate and elegant smoke carrying through a long finish.",
    },
    story: {
      it: "È la selezione di vertice della casa Johnnie Walker, costruita assemblando whisky scelti per rarità e carattere.",
      en: "Johnnie Walker's prestige selection, assembled from whiskies chosen for rarity and character.",
    },
    tastingNotes: {
      it: "Miele, nocciola, cioccolato fondente, frutta secca, spezie e fumo.",
      en: "Honey, hazelnut, dark chocolate, dried fruit, spice and smoke.",
    },
    price: 320,
    tags: ["Whisky", "Blended Scotch", "Prestige", "Nessun allergene"],
    alcoholLevel: "40% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 21,
  },
  {
    id: "fallback-hibiki-harmony",
    name: "Hibiki Japanese Harmony",
    slug: "hibiki-japanese-harmony",
    description: {
      it: "Blended whisky giapponese armonioso e raffinato, con fiori, miele, agrumi e un legno delicatamente speziato.",
      en: "A harmonious, refined Japanese blended whisky with flowers, honey, citrus and delicately spiced oak.",
    },
    story: {
      it: "Creato da Suntory, riunisce whisky di malto e cereale delle distillerie Yamazaki, Hakushu e Chita.",
      en: "Created by Suntory, it brings together malt and grain whiskies from Yamazaki, Hakushu and Chita.",
    },
    tastingNotes: {
      it: "Rosa, litchi, miele, scorza d'arancia, cioccolato bianco e quercia.",
      en: "Rose, lychee, honey, orange peel, white chocolate and oak.",
    },
    price: 230,
    tags: ["Whisky", "Giappone", "Blended", "Nessun allergene"],
    alcoholLevel: "43% vol.",
    servingFormat: "Bottiglia 70 cl",
    sortOrder: 22,
  },
];
