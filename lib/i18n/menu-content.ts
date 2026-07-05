import type { Locale } from "./types";

type MenuItemContent = {
  description?: string;
  ingredients?: string;
};

const englishCategories: Record<string, string> = {
  "cocktail signature": "Signature Cocktails",
  "cocktail classici": "Classic Cocktails",
  "negroni collection": "Negroni Collection",
  champagne: "Champagne",
  prosecco: "Prosecco",
  "vini bianchi": "White Wines",
  "vini rossi": "Red Wines",
  birre: "Beers",
  "cocktail analcolici": "Alcohol-Free Cocktails",
  analcolici: "Alcohol-Free Cocktails",
  "soft drinks": "Soft Drinks",
  acque: "Water",
  caffetteria: "Coffee",
  "food & cicchetti": "Food & Cicchetti",
  dolci: "Desserts",
  amari: "Italian Amari",
};

const englishCategoryIntroductions: Record<string, string> = {
  "cocktail signature":
    "Original Noir creations built around recognisable ingredients and a precise identity.",
  "cocktail classici":
    "The great codes of international mixology, prepared with respect for their recipes.",
  "negroni collection":
    "The Italian classic and its most compelling variations, from vermouth to mezcal.",
  champagne:
    "Iconic maisons and selected cuvées for aperitifs and special occasions.",
  prosecco:
    "Fresh Italian bubbles chosen to begin the evening with a lighter touch.",
  "vini bianchi":
    "Fresh, mineral and aromatic white wines served at their ideal temperature.",
  "vini rossi":
    "Italian red wines selected for structure, balance and gastronomic character.",
  birre:
    "Lagers, stouts and wheat beers from established Italian and international breweries.",
  "cocktail analcolici":
    "Alcohol-free drinks built with juices, botanicals and quality mixers.",
  analcolici:
    "Alcohol-free drinks built with juices, botanicals and quality mixers.",
  "soft drinks":
    "Classic soft drinks, tonics and premium mixers served well chilled.",
  acque: "Still and sparkling mineral waters in different formats.",
  caffetteria: "Espresso and hot drinks prepared to order.",
  "food & cicchetti":
    "Sharing plates and small bites designed around the cocktail list.",
  dolci: "Measured, indulgent finishes for the end of the evening.",
  amari:
    "A curated selection of Italian herbal liqueurs for a measured end to the evening.",
};

const englishMenuItems: Record<string, MenuItemContent> = {
  "mezcal negroni": {
    description:
      "Mezcal, Italian bitter and red vermouth replace gin botanicals with cooked agave and smoke. The result remains true to the Negroni's bittersweet structure.",
    ingredients:
      "Mezcal, Italian bitter, red vermouth, orange peel",
  },
  "noir negroni": {
    description:
      "Premium gin, bitter, red vermouth and cacao essence add depth to the classic equal-parts formula. Orange oils and botanicals lead into a long finish.",
    ingredients:
      "Cacao gin, Italian bitter, red vermouth, orange peel",
  },
  "velvet smoke": {
    description:
      "Mezcal, red vermouth and bitter create a smoky, vinous profile. Charred orange adds warmth and aromatic freshness.",
    ingredients:
      "Mezcal, red vermouth, bitter, charred orange",
  },
  "golden hour": {
    description:
      "Gin, bergamot, lemon and Champagne cordial create a bright citrus profile. The finish is dry, floral and gently vinous.",
    ingredients:
      "Gin, bergamot liqueur, lemon, Champagne cordial",
  },
  "golden smoke": {
    description:
      "Bourbon, spiced honey and gentle smoke shape a warm, structured cocktail. Lemon keeps the drink taut and balances its softer notes.",
    ingredients:
      "Bourbon, spiced honey, lemon, aromatic bitter, wood smoke",
  },
  "velvet night": {
    description:
      "Vodka, blackberry and violet create a floral, fruit-led profile without excess sweetness. Lemon adds precision to a smooth, silky texture.",
    ingredients:
      "Vodka, violet liqueur, blackberry, lemon, aquafaba",
  },
  "black orchid": {
    description:
      "Vodka, violet, blackberry and lemon shape a deep floral cocktail. Fresh acidity balances the fruit and its silky texture.",
    ingredients:
      "Vodka, violet liqueur, blackberry, lemon, foam",
  },
  "midnight boulevard": {
    description:
      "Bourbon, bitter, red vermouth and cinnamon create a warm, spiced profile. Whiskey sweetness supports a persistent bitter finish.",
    ingredients:
      "Bourbon, bitter, red vermouth, cinnamon",
  },
  "cocoa martini": {
    description:
      "Vodka, espresso, cold brew and cacao liqueur compose a dry, roasted after-dinner cocktail. Coffee and cacao remain clear without excessive sweetness.",
    ingredients:
      "Vodka, espresso, cacao liqueur, cold brew",
  },
  "martini cocktail": {
    description:
      "Gin and dry vermouth are chilled and diluted with precision for a clean profile. The garnish shifts the drink towards citrus or savoury notes.",
    ingredients: "Gin, dry vermouth, olive or lemon twist",
  },
  "dry martini": {
    description:
      "London dry gin and dry vermouth create a transparent, cold and rigorous cocktail. Botanicals and vinous notes remain under precise control.",
    ingredients: "London dry gin, dry vermouth",
  },
  "espresso martini": {
    description:
      "Vodka, coffee liqueur and fresh espresso produce a compact crema and roasted flavour. Sweetness supports the coffee without masking its bitterness.",
    ingredients:
      "Vodka, coffee liqueur, espresso, sugar syrup",
  },
  margarita: {
    description:
      "Blanco tequila, triple sec and lime combine agave, citrus and measured orange sweetness. A salted rim enhances freshness and savoury character.",
    ingredients: "Blanco tequila, triple sec, lime",
  },
  "negroni classico": {
    description:
      "Equal parts gin, Italian bitter and red vermouth balance botanicals, wine sweetness and bitterness. Dilution gradually opens the aromas.",
    ingredients: "Gin, Italian bitter, red vermouth",
  },
  "negroni sbagliato": {
    description:
      "Bitter and red vermouth are lengthened with brut sparkling wine instead of gin. Fine bubbles make the drink fresher and lighter.",
    ingredients: "Italian bitter, red vermouth, brut sparkling wine",
  },
  boulevardier: {
    description:
      "Bourbon or rye, bitter and red vermouth transfer the Negroni structure to whiskey. Spice, orange and wine notes create a warm finish.",
    ingredients: "Bourbon or rye, Italian bitter, red vermouth",
  },
  "old pal": {
    description:
      "Rye whiskey, bitter and dry vermouth produce a sharp, dry variation. It is leaner and less sweet than a Boulevardier.",
    ingredients: "Rye whiskey, Italian bitter, dry vermouth",
  },
  "moët & chandon brut impérial": {
    description:
      "An iconic brut Champagne with bright fruit, citrus freshness and fine bubbles. Its balanced structure makes it a versatile aperitif.",
    ingredients: "Champagne; contains sulphites",
  },
  "veuve clicquot brut": {
    description:
      "A structured, dry Champagne with ripe fruit, toast and persistent bubbles. It combines freshness with a recognisable vinous depth.",
    ingredients: "Champagne; contains sulphites",
  },
  "ruinart blanc de blancs": {
    description:
      "A luminous Chardonnay Champagne with citrus, white flowers and mineral precision. The texture is fine and elegant.",
    ingredients: "Blanc de Blancs Champagne; contains sulphites",
  },
  "franciacorta brut": {
    description:
      "An elegant Italian traditional-method sparkling wine with fresh fruit and fine bubbles. Its dry finish is distinctly gastronomic.",
    ingredients: "Franciacorta Brut; contains sulphites",
  },
  "tagliere noir": {
    description:
      "A selection of artisan cured meats, aged cheeses and accompaniments designed for sharing. Honey, preserves and crisp bread add sweet and savoury contrasts.",
    ingredients:
      "Selected cured meats, aged cheeses, honey, preserves, crisp bread",
  },
  "tartare mini toast": {
    description:
      "Hand-cut beef tartare served on toasted bread with delicate mustard and fresh herbs. Crisp bread balances the soft texture of the meat.",
    ingredients:
      "Selected raw beef, bread, mustard, aromatic herbs, extra virgin olive oil",
  },
  "bao pulled pork": {
    description:
      "Soft steamed bao filled with slow-cooked pulled pork, house sauce and crisp cabbage. Tenderness, richness and freshness stay in balance.",
    ingredients:
      "Bao bun, pulled pork, house sauce, crisp cabbage",
  },
  "crostone burrata & alici": {
    description:
      "Toasted bread, creamy burrata and savoury anchovies create a bold Mediterranean bite. Lemon and extra virgin olive oil brighten the finish.",
    ingredients:
      "Bread, burrata, anchovies, lemon, extra virgin olive oil",
  },
  "amaro montenegro": {
    description:
      "A smooth, aromatic Italian amaro with notes of orange, sweet spices and medicinal herbs. Its finish is balanced and gently bitter.",
    ingredients: "Aromatic herbs, spices and citrus peel infusion",
  },
  "amaro averna": {
    description:
      "A full-bodied Sicilian amaro layered with caramel, citrus and Mediterranean herbs. The finish is long, rounded and pleasantly bitter.",
    ingredients: "Herbs, roots, citrus peel and caramel",
  },
  "fernet-branca": {
    description:
      "An intense, balsamic fernet with a distinctive weave of herbs, spices and roots. Its dry, persistent profile makes it a classic digestif.",
    ingredients: "Aromatic herbs, spices and roots",
  },
  "vecchio amaro del capo": {
    description:
      "A fresh, aromatic Calabrian amaro shaped by local herbs, flowers and citrus. Served chilled, it offers a clean and fragrant finish.",
    ingredients: "Calabrian herbs, flowers and citrus peel",
  },
};

const englishAllergens: Record<string, string> = {
  Caffeina: "Caffeine",
  Latte: "Milk",
  Lattosio: "Lactose",
  Glutine: "Gluten",
  Uova: "Eggs",
  "Frutta a guscio": "Tree nuts",
  Mandorla: "Almond",
  Crostacei: "Crustaceans",
  Pesce: "Fish",
  Soia: "Soy",
  Solfiti: "Sulphites",
  Senape: "Mustard",
  Sesamo: "Sesame",
};

function normalize(value: string | null | undefined) {
  return (value || "").trim().toLocaleLowerCase("it-IT");
}

export function localizeMenuCategory(name: string, locale: Locale) {
  if (locale === "it") return name;
  return englishCategories[normalize(name)] || name;
}

export function localizeMenuCategoryIntroduction(
  name: string,
  locale: Locale,
) {
  if (locale === "it") return undefined;
  return englishCategoryIntroductions[normalize(name)];
}

export function localizeMenuItem(
  item: { name: string; description?: string | null; ingredients?: string | null },
  locale: Locale,
): MenuItemContent {
  if (locale === "it") {
    return {
      description: item.description?.trim() || undefined,
      ingredients: item.ingredients?.trim() || undefined,
    };
  }

  return englishMenuItems[normalize(item.name)] || {};
}

export function localizeAllergen(label: string, locale: Locale) {
  if (locale === "it") return label;
  return englishAllergens[label] || label;
}

export function localizeMenuTag(tag: string, locale: Locale) {
  if (locale === "it") return tag;

  const tags: Record<string, string> = {
    agrumato: "Citrus",
    affumicato: "Smoky",
    amaro: "Bitter",
    aperitivo: "Aperitif",
    caffè: "Coffee",
  };

  return tags[normalize(tag)] || tag;
}
