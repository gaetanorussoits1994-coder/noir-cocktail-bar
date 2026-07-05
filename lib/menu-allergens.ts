export type MenuAllergen = {
  icon: string;
  label: string;
};

const allergenDefinitions: Array<
  MenuAllergen & { keywords: string[] }
> = [
  { icon: "☕", label: "Caffeina", keywords: ["caffeina", "caffè", "coffee", "espresso"] },
  { icon: "🥛", label: "Latte", keywords: ["latte", "milk", "panna", "cream"] },
  { icon: "🧀", label: "Lattosio", keywords: ["lattosio", "lactose", "formaggio"] },
  { icon: "🌾", label: "Glutine", keywords: ["glutine", "gluten", "pane", "crostino", "farina"] },
  { icon: "🥚", label: "Uova", keywords: ["uova", "uovo", "egg", "albume"] },
  {
    icon: "🥜",
    label: "Frutta a guscio",
    keywords: ["frutta a guscio", "nocciola", "pistacchio", "noce", "noci"],
  },
  { icon: "🥜", label: "Mandorla", keywords: ["mandorla", "mandorle", "orgeat"] },
  { icon: "🦐", label: "Crostacei", keywords: ["crostacei", "gambero", "gamberi"] },
  { icon: "🐟", label: "Pesce", keywords: ["pesce", "acciuga", "tonno", "salmone"] },
  { icon: "🌱", label: "Soia", keywords: ["soia", "soy"] },
  {
    icon: "🍷",
    label: "Solfiti",
    keywords: ["solfiti", "sulfites", "vermouth", "vino", "prosecco", "champagne"],
  },
  { icon: "🌿", label: "Senape", keywords: ["senape", "mustard"] },
  { icon: "🍯", label: "Sesamo", keywords: ["sesamo", "tahina", "tahini"] },
  {
    icon: "✓",
    label: "Nessuno",
    keywords: ["nessun allergene", "no declared allergens"],
  },
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("it-IT");
}

export function getMenuAllergens({
  tags,
  ingredients,
}: {
  tags: string[] | null | undefined;
  ingredients: string | null | undefined;
}) {
  const source = [...(tags ?? []), ingredients ?? ""]
    .map(normalize)
    .join(" ");

  return allergenDefinitions
    .filter(({ keywords }) =>
      keywords.some((keyword) => source.includes(normalize(keyword))),
    )
    .map(({ icon, label }) => ({ icon, label }));
}

export function getDisplayTags(tags: string[] | null | undefined) {
  return (tags ?? []).filter((tag) => {
    const normalizedTag = normalize(tag).replace(/^allergene:\s*/, "");
    return !allergenDefinitions.some(
      ({ label, keywords }) =>
        normalize(label) === normalizedTag ||
        keywords.some((keyword) => normalize(keyword) === normalizedTag),
    );
  });
}
