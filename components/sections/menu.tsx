"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PremiumButton } from "@/components/ui/premium-button";
import { SectionTitle } from "@/components/ui/section-title";
import { fallbackMenu } from "@/lib/data/static-content";
import { getSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type PublicCocktail = {
  id: string;
  name: string;
  slug: string | null;
  category: string | null;
  description: string | null;
  price: number | null;
  ingredients: string | null;
  alcohol_level: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_available: boolean;
  display_order: number | null;
};

const fallbackCocktails: PublicCocktail[] = fallbackMenu.flatMap((category) =>
  category.items.map((item) => ({
    id: item.id,
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

function formatPrice(price: number | null) {
  if (price === null) return "Su richiesta";

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function createCocktailSlug(slug: string | null | undefined, name: string) {
  return (slug?.trim() || name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const cocktailSlug = createCocktailSlug(cocktail.slug, cocktail.name);

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
        aria-label={`Scopri il cocktail ${cocktail.name}`}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold"
        href={`/cocktails/${encodeURIComponent(cocktailSlug)}`}
      >
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-gold uppercase">
            {cocktail.category || "Cocktail"}
          </p>
          <div className="mt-2 flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="break-words font-display text-3xl font-medium text-gold-light transition-colors group-hover:text-gold">
                {cocktail.name}
              </h3>
              {cocktail.is_featured && (
                <Star
                  aria-label="Cocktail in evidenza"
                  className="shrink-0 text-gold"
                  fill="currentColor"
                  size={13}
                />
              )}
            </div>
            <span className="shrink-0 pt-1 text-sm font-semibold text-gold">
              {formatPrice(cocktail.price)}
            </span>
          </div>

          {cocktail.description && (
            <p className="mt-4 text-sm leading-7 text-noir-gray">
              {cocktail.description}
            </p>
          )}

          {cocktail.ingredients && (
            <p className="mt-3 text-xs leading-6 text-noir-gray">
              <span className="font-semibold tracking-[0.08em] text-gold uppercase">
                Ingredienti:
              </span>{" "}
              {cocktail.ingredients}
            </p>
          )}

          {(cocktail.tags ?? []).length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {(cocktail.tags ?? []).map((tag) => (
                <span
                  className="rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.08em] text-gold-light uppercase"
                  key={`${cocktail.id}-${tag}`}
                >
                  {formatTag(tag)}
                </span>
              ))}
            </div>
          )}
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
  const fallbackItems = useMemo(
    () =>
      featuredOnly
        ? fallbackCocktails.filter((item) => item.is_featured)
        : fallbackCocktails,
    [featuredOnly],
  );
  const [menuItems, setMenuItems] = useState<PublicCocktail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadMenu = useCallback(
    async (isCurrent: () => boolean) => {
      const supabase = getSupabaseClient();

      if (!supabase) {
        if (isCurrent()) {
          setMenuItems([]);
          setIsLoading(false);
          setLoadError(
            "Menu online non disponibile: mostriamo la selezione Noir.",
          );
        }
        return;
      }

      try {
        console.log("[PublicMenu] Loading menu_items from Supabase");

        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true);

        if (!isCurrent()) return;

        if (error) {
          logMenuError(error);
          setMenuItems([]);
          setIsLoading(false);
          setLoadError(
            "Il menu live è momentaneamente non disponibile. Ti mostriamo la selezione Noir.",
          );
          return;
        }

        console.log("[PublicMenu] Loaded menu_items:", data);

        const sortedItems = ([...(data ?? [])] as PublicCocktail[]).sort(
          (first, second) =>
            (first.display_order ?? 0) - (second.display_order ?? 0),
        );
        const visibleItems = featuredOnly
          ? sortedItems.filter((item) => item.is_featured)
          : sortedItems;

        setMenuItems(visibleItems);
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
        setIsLoading(false);
        setLoadError(
          "Il menu live è momentaneamente non disponibile. Ti mostriamo la selezione Noir.",
        );
      }
    },
    [featuredOnly],
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
      .subscribe();

    return () => {
      isMounted = false;
      if (supabase && channel) void supabase.removeChannel(channel);
    };
  }, [featuredOnly, loadMenu]);

  const displayedItems =
    menuItems.length > 0 ? menuItems : fallbackItems;

  const groupedItems = useMemo(() => {
    const groups = new Map<string, PublicCocktail[]>();
    for (const item of displayedItems) {
      const category = item.category?.trim() || "Cocktail";
      groups.set(category, [...(groups.get(category) ?? []), item]);
    }
    return Array.from(groups.entries());
  }, [displayedItems]);

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
          description={
            featuredOnly
              ? "Le creazioni scelte dai nostri bartender: carattere Noir, ingredienti ricercati e dettagli inattesi."
              : "Cocktail signature, grandi classici e proposte Noir: scopri la selezione completa."
          }
          label={featuredOnly ? "In evidenza" : "La nostra selezione"}
          title={featuredOnly ? "Cocktail Signature" : "Menu Noir"}
        />

        {isLoading ? (
          <div
            aria-label="Caricamento menu"
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
                {loadError}
              </p>
            )}

            {featuredOnly ? (
              <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {displayedItems.map((item) => (
                  <PublicMenuCard cocktail={item} key={item.id} />
                ))}
              </div>
            ) : (
              <div className="mt-16 space-y-16">
                {groupedItems.map(([category, categoryItems], index) => (
                  <section key={category}>
                    <div className="mb-7 border-b border-border pb-5">
                      <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-2 font-display text-4xl text-gold-light">
                        {category}
                      </h2>
                    </div>
                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                      {categoryItems.map((item) => (
                        <PublicMenuCard cocktail={item} key={item.id} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {featuredOnly && (
              <div className="mt-12 flex justify-center">
                <PremiumButton href="/menu" variant="outline">
                  Scopri il menu completo
                  <ArrowUpRight aria-hidden="true" size={16} />
                </PremiumButton>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
