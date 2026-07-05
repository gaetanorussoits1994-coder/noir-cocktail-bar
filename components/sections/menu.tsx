"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PremiumButton } from "@/components/ui/premium-button";
import { SectionTitle } from "@/components/ui/section-title";
import { fallbackMenu } from "@/lib/data/static-content";
import {
  getDisplayTags,
  getMenuAllergens,
} from "@/lib/menu-allergens";
import {
  localizeAllergen,
  localizeMenuCategory,
  localizeMenuCategoryIntroduction,
  localizeMenuItem,
  localizeMenuTag,
} from "@/lib/i18n/menu-content";
import {
  deduplicateMenuItems,
  getMenuItemSlug,
  slugifyMenuValue,
} from "@/lib/menu-items";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type PublicCocktail = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string | null;
  category: string | null;
  description: string | null;
  price: number | null;
  ingredients: string | null;
  alcohol_level: string | null;
  story?: string | null;
  glassware?: string | null;
  garnish?: string | null;
  preparation_technique?: string | null;
  staff_recommendation?: string | null;
  pairing?: string | null;
  product_style?: string | null;
  serving_format?: string | null;
  serving_temperature?: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_available: boolean;
  display_order: number | null;
};

type PublicMenuCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

const fallbackCocktails: PublicCocktail[] = fallbackMenu.flatMap((category) =>
  category.items.map((item) => ({
    id: item.id,
    category_id: category.id,
    name: item.name,
    slug: item.id.replace(/^fallback-/, ""),
    category: category.name,
    description: item.description || null,
    price: item.price,
    ingredients: item.ingredients || null,
    alcohol_level: null,
    tags: item.tags,
    is_featured: item.isFeatured,
    is_available: true,
    display_order: item.sortOrder,
  })),
);

const fallbackCategories: PublicMenuCategory[] = fallbackMenu.map(
  (category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    sort_order: category.sortOrder,
  }),
);

const categoryIntroductions: Record<string, string> = {
  "Cocktail Signature":
    "Creazioni originali firmate Noir, costruite con ingredienti riconoscibili e una precisa identità.",
  "Cocktail Classici":
    "I grandi codici della miscelazione internazionale, eseguiti nel rispetto delle ricette.",
  "Negroni Collection":
    "Il classico italiano e le sue variazioni più autorevoli, dal vermouth al mezcal.",
  Champagne:
    "Maison iconiche e cuvée selezionate per brindisi e occasioni speciali.",
  Prosecco:
    "Bollicine italiane fresche e immediate, ideali per aprire la serata.",
  "Vini Bianchi":
    "Etichette fresche, minerali o aromatiche servite alla temperatura ideale.",
  "Vini Rossi":
    "Rossi italiani scelti per struttura, equilibrio e vocazione gastronomica.",
  Birre:
    "Lager, stout e weiss tra grandi classici italiani e internazionali.",
  "Alcolici Premium":
    "Distillati selezionati per degustazioni pulite e cocktail essenziali dal carattere elegante.",
  "Cocktail Analcolici":
    "Miscelazioni alcohol free costruite con succhi, botaniche e mixer di qualità.",
  "Soft Drinks":
    "Bibite classiche, toniche e mixer premium serviti ben freddi.",
  Acque:
    "Acque minerali naturali e frizzanti in diversi formati.",
  Caffetteria:
    "Espresso e proposte calde preparate al momento.",
  "Food & Cicchetti":
    "Piatti da condividere e piccoli assaggi pensati per accompagnare la drink list.",
  Dolci:
    "Finali golosi in formato essenziale, preparati per chiudere la serata con misura.",
  Amari:
    "Una selezione italiana di amari da meditazione e fine pasto.",
};

const homeCategoryNames = [
  "Cocktail Signature",
  "Cocktail Classici",
  "Negroni Collection",
  "Champagne",
  "Food & Cicchetti",
];

const fullCategoryNames = [
  "Cocktail Signature",
  "Cocktail Classici",
  "Negroni Collection",
  "Champagne",
  "Prosecco",
  "Vini Bianchi",
  "Vini Rossi",
  "Birre",
  "Alcolici Premium",
  "Cocktail Analcolici",
  "Soft Drinks",
  "Acque",
  "Caffetteria",
  "Food & Cicchetti",
  "Dolci",
  "Amari",
];

function normalizeCategory(value: string | null | undefined) {
  return (value || "").trim().toLocaleLowerCase("it-IT");
}

function canonicalizeCategoryName(value: string) {
  const normalizedValue = normalizeCategory(value);

  if (normalizedValue === "champagne & bollicine") return "Champagne";
  if (normalizedValue === "analcolici") return "Cocktail Analcolici";
  return value;
}

function getCategoryIntroduction(
  category: PublicMenuCategory,
  locale: "it" | "en",
) {
  const translatedIntroduction = localizeMenuCategoryIntroduction(
    category.name,
    locale,
  );

  return (
    translatedIntroduction ||
    category.description?.trim() ||
    categoryIntroductions[category.name] ||
    `Una selezione Noir dedicata a ${category.name}, curata con equilibrio e personalità.`
  );
}

function logMenuError(error: {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}) {
  console.error("[PublicMenu] Supabase select error:", {
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    code: error?.code,
    fullError: JSON.stringify(error, null, 2),
  });
}

function formatPrice(
  price: number | null,
  locale: "it" | "en",
  onRequest: string,
) {
  if (price === null) return onRequest;

  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function formatTag(tag: string) {
  const normalizedTag = tag.toLowerCase();
  if (normalizedTag.includes("signature")) return `⭐ ${tag}`;
  if (
    normalizedTag.includes("citrus") ||
    normalizedTag.includes("agrum")
  ) {
    return `🍊 ${tag}`;
  }
  if (
    normalizedTag.includes("smoky") ||
    normalizedTag.includes("affum")
  ) {
    return `🥃 ${tag}`;
  }
  if (normalizedTag.includes("mezcal")) return `🔥 ${tag}`;
  if (
    normalizedTag.includes("bitter") ||
    normalizedTag.includes("amaro")
  ) {
    return `✦ ${tag}`;
  }
  return `◆ ${tag}`;
}

function PublicMenuCard({ cocktail }: { cocktail: PublicCocktail }) {
  const { locale, t } = useTranslation();
  const cocktailSlug = getMenuItemSlug(cocktail);
  const localizedItem = localizeMenuItem(cocktail, locale);
  const description = localizedItem.description;
  const ingredients = localizedItem.ingredients;
  const displayTags = getDisplayTags(cocktail.tags);
  const allergens = getMenuAllergens(cocktail);
  const displayedAllergens =
    allergens.length > 0
      ? allergens
      : normalizeCategory(cocktail.category).includes("food")
        ? [{ icon: "ℹ️", label: t("menu.askStaff") }]
        : [];

  return (
    <motion.article
      className="group relative h-full overflow-hidden rounded-card border border-border bg-[radial-gradient(circle_at_100%_0%,rgba(200,169,106,0.09),transparent_42%),rgba(255,255,255,0.025)] shadow-soft backdrop-blur-sm transition-[border-color,box-shadow] duration-500 hover:border-gold/45 hover:shadow-[0_28px_80px_rgba(200,169,106,0.14)]"
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.12, once: true }}
      whileHover={{ y: -6 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link
        aria-label={`${t("menu.discoverProduct")} ${cocktail.name}`}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold"
        href={`/cocktails/${encodeURIComponent(cocktailSlug)}`}
      >
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-gold uppercase">
            {localizeMenuCategory(
              cocktail.category || "Cocktail",
              locale,
            )}
          </p>
          <div className="mt-2 flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="break-words font-display text-3xl font-medium text-gold-light transition-colors group-hover:text-gold">
                {cocktail.name}
              </h3>
              {cocktail.is_featured && (
                <Star
                  aria-label={t("menu.featuredBadge")}
                  className="shrink-0 text-gold"
                  fill="currentColor"
                  size={13}
                />
              )}
            </div>
            <span className="shrink-0 pt-1 text-sm font-semibold text-gold">
              {formatPrice(cocktail.price, locale, t("menu.onRequest"))}
            </span>
          </div>

          {description && (
            <p className="mt-4 text-sm leading-7 text-noir-gray">
              {description}
            </p>
          )}

          {ingredients && (
            <p className="mt-3 text-xs leading-6 text-noir-gray">
              <span className="font-semibold tracking-[0.08em] text-gold uppercase">
                {t("menu.ingredients")}:
              </span>{" "}
              {ingredients}
            </p>
          )}

          {displayTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {displayTags.map((tag) => (
                <span
                  className="rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.08em] text-gold-light uppercase"
                  key={`${cocktail.id}-${tag}`}
                >
                  {formatTag(localizeMenuTag(tag, locale))}
                </span>
              ))}
            </div>
          )}

          {displayedAllergens.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-[0.6rem] font-semibold tracking-[0.14em] text-gold uppercase">
                {t("menu.allergens")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {displayedAllergens.map((allergen) => (
                  <span
                    className="rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-[0.62rem] font-semibold text-gold-light"
                    key={allergen.label}
                  >
                    <span aria-hidden="true">{allergen.icon}</span>{" "}
                    {localizeAllergen(allergen.label, locale)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <span className="mt-auto pt-6 text-xs font-semibold tracking-[0.12em] text-gold uppercase">
            {t("menu.discoverProduct")} →
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

type MenuProps = {
  featuredOnly?: boolean;
  standalone?: boolean;
};

export function Menu({
  featuredOnly = true,
  standalone = false,
}: MenuProps) {
  const { locale, t } = useTranslation();
  const categoryNames = featuredOnly
    ? homeCategoryNames
    : fullCategoryNames;
  const fallbackItems = fallbackCocktails;
  const [menuItems, setMenuItems] = useState<PublicCocktail[]>([]);
  const [menuCategories, setMenuCategories] = useState<
    PublicMenuCategory[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadMenu = useCallback(
    async (isCurrent: () => boolean) => {
      const supabase = getSupabaseClient();

      if (!supabase) {
        if (isCurrent()) {
          setMenuItems([]);
          setMenuCategories([]);
          setIsLoading(false);
          setLoadError(
            "Menu online non disponibile: mostriamo la selezione Noir.",
          );
        }
        return;
      }

      try {
        console.log("[PublicMenu] Loading menu_items from Supabase");

        const [itemsResult, categoriesResult] = await Promise.all([
          supabase
            .from("menu_items")
            .select("*")
            .eq("is_available", true),
          supabase
            .from("menu_categories")
            .select("id, name, slug, description, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
        ]);

        if (!isCurrent()) return;

        const error = itemsResult.error || categoriesResult.error;
        if (error) {
          logMenuError(error);
          setMenuItems([]);
          setMenuCategories([]);
          setIsLoading(false);
          setLoadError(
            "Il menu live è momentaneamente non disponibile. Ti mostriamo la selezione Noir.",
          );
          return;
        }

        console.log("[PublicMenu] Loaded menu_items:", itemsResult.data);

        const activeCategories = (
          (categoriesResult.data ?? []) as PublicMenuCategory[]
        )
          .map((category) => ({
            ...category,
            name: canonicalizeCategoryName(category.name),
          }))
          .sort((first, second) => first.sort_order - second.sort_order);
        const catalogCategories = categoryNames.map(
          (categoryName, index) =>
            activeCategories.find(
              (category) =>
                normalizeCategory(category.name) ===
                normalizeCategory(categoryName),
            ) || {
              id: `catalog-${slugifyMenuValue(categoryName)}`,
              name: categoryName,
              slug: slugifyMenuValue(categoryName),
              description: categoryIntroductions[categoryName] || null,
              sort_order: index + 1,
            },
        );
        const categoriesById = new Map(
          activeCategories.map((category) => [category.id, category]),
        );
        const categoriesByName = new Map(
          [...activeCategories, ...catalogCategories].map((category) => [
            normalizeCategory(category.name),
            category,
          ]),
        );

        const sortedItems = (
          [...(itemsResult.data ?? [])] as PublicCocktail[]
        ).sort(
          (first, second) =>
            (first.display_order ?? 0) - (second.display_order ?? 0),
        );
        const categorizedItems = sortedItems.flatMap((item) => {
          const category =
            (item.category_id
              ? categoriesById.get(item.category_id)
              : undefined) ||
            categoriesByName.get(normalizeCategory(item.category));

          if (!category) return [];

          return [
            {
              ...item,
              category_id: category.id,
              category: category.name,
            },
          ];
        });
        const visibleItems = deduplicateMenuItems(categorizedItems);

        setMenuItems(visibleItems);
        setMenuCategories(catalogCategories);
        setIsLoading(false);

        if (visibleItems.length === 0) {
          setLoadError(
            featuredOnly
              ? "Le nuove creazioni Noir sono in arrivo."
              : "Il nuovo menu è in preparazione. Nel frattempo, scopri la selezione Noir.",
          );
          return;
        }

        setLoadError("");
      } catch (unexpectedError) {
        console.error("[PublicMenu] Unexpected error", unexpectedError);
        if (!isCurrent()) return;
        setMenuItems([]);
        setMenuCategories([]);
        setIsLoading(false);
        setLoadError(
          "Il menu live è momentaneamente non disponibile. Ti mostriamo la selezione Noir.",
        );
      }
    },
    [categoryNames, featuredOnly],
  );

  useEffect(() => {
    const supabase = getSupabaseClient();
    let isMounted = true;
    const isCurrent = () => isMounted;

    void loadMenu(isCurrent);

    const channel = supabase
      ?.channel(featuredOnly ? "home-featured-menu" : "public-full-menu")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => void loadMenu(isCurrent),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_categories" },
        () => void loadMenu(isCurrent),
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (supabase && channel) void supabase.removeChannel(channel);
    };
  }, [featuredOnly, loadMenu]);

  const supplementalCategoryNames = [
    "Birre",
    "Alcolici Premium",
    "Amari",
  ];
  const supplementalFallbackItems = fallbackItems.filter((item) =>
    supplementalCategoryNames.some(
      (categoryName) =>
        normalizeCategory(item.category) === normalizeCategory(categoryName),
    ),
  );
  const displayedItems = deduplicateMenuItems(
    menuItems.length > 0
      ? [...menuItems, ...supplementalFallbackItems]
      : fallbackItems,
  );
  const displayedCategories =
    menuCategories.length > 0 ? menuCategories : fallbackCategories;

  const groupedSections = useMemo(
    () =>
      displayedCategories
        .filter((category) =>
          categoryNames.some(
            (name) =>
              normalizeCategory(name) ===
              normalizeCategory(category.name),
          ),
        )
        .map((category) => ({
          category,
          items: displayedItems.filter(
            (item) =>
              item.category_id === category.id ||
              normalizeCategory(item.category) ===
                normalizeCategory(category.name),
          ),
        }))
        .filter((section) => section.items.length > 0),
    [categoryNames, displayedCategories, displayedItems],
  );

  return (
    <section
      className={cn(
        "w-full max-w-full overflow-hidden bg-background-primary px-4 py-24 sm:px-6 sm:py-32 lg:px-8",
        standalone && "pt-36 sm:pt-40",
      )}
      id="menu"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          description={t(
            featuredOnly
              ? "menu.featuredDescription"
              : "menu.fullDescription",
          )}
          label={t(
            featuredOnly ? "menu.featuredLabel" : "menu.fullLabel",
          )}
          title={t(
            featuredOnly ? "menu.featuredTitle" : "menu.fullTitle",
          )}
        />

        {isLoading ? (
          <div
            aria-label={t("menu.loading")}
            className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            role="status"
          >
            {[0, 1, 2].map((item) => (
              <div
                className="h-72 animate-pulse rounded-card border border-border bg-card/60"
                key={item}
              />
            ))}
          </div>
        ) : (
          <>
            {loadError && (
              <p
                className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-noir-gray"
                role="status"
              >
                {locale === "en" ? t("menu.liveFallback") : loadError}
              </p>
            )}

            <div className="mt-16 space-y-16">
              {groupedSections.map(({ category, items }, index) => {
                const sectionItems = featuredOnly
                  ? items.slice(0, 4)
                  : items;

                return (
                  <section id={category.slug} key={category.id}>
                    <div className="mb-8 border-b border-border pb-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold uppercase">
                            {t("menu.section")}{" "}
                            {String(index + 1).padStart(2, "0")}
                          </p>
                          <h2 className="mt-2 font-display text-4xl text-gold-light sm:text-5xl">
                            {localizeMenuCategory(category.name, locale)}
                          </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-7 text-noir-gray sm:text-right">
                          {getCategoryIntroduction(category, locale)}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                      {sectionItems.map((item) => (
                        <PublicMenuCard cocktail={item} key={item.id} />
                      ))}
                    </div>
                    {featuredOnly && (
                      <div className="mt-8 flex justify-center">
                        <PremiumButton href="/menu" variant="outline">
                          {t("menu.discoverAll")}
                          <ArrowUpRight aria-hidden="true" size={16} />
                        </PremiumButton>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
