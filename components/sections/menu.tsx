"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PremiumButton } from "@/components/ui/premium-button";
import { SectionTitle } from "@/components/ui/section-title";
import { fallbackMenu } from "@/lib/data/static-content";
import { getSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type PublicCocktail = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  ingredients: string | null;
  alcohol_level: string | null;
  is_featured: boolean;
  is_available: boolean;
  display_order: number;
};

type MenuStatus = "loading" | "live" | "fallback";

const fallbackCocktails: PublicCocktail[] = fallbackMenu.flatMap((category) =>
  category.items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.id.replace(/^fallback-/, ""),
    category: category.name,
    description: item.description || null,
    price: item.price,
    image_url: item.imageUrl,
    ingredients: item.ingredients || null,
    alcohol_level: null,
    is_featured: item.isFeatured,
    is_available: true,
    display_order: item.sortOrder,
  })),
);

function formatPrice(price: number | null) {
  if (price === null) return "Su richiesta";

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function logMenuError(error: {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}) {
  console.error("[PublicMenu] Supabase select error", {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
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
  const [items, setItems] = useState<PublicCocktail[]>(fallbackItems);
  const [status, setStatus] = useState<MenuStatus>("loading");
  const [fallbackMessage, setFallbackMessage] = useState("");

  const loadMenu = useCallback(
    async (isCurrent: () => boolean) => {
      const supabase = getSupabaseClient();

      if (!supabase) {
        if (isCurrent()) {
          setItems(fallbackItems);
          setStatus("fallback");
          setFallbackMessage(
            "Menu online non disponibile: mostriamo la selezione Noir.",
          );
        }
        return;
      }

      try {
        let query = supabase
          .from("menu_items")
          .select(
            "id, name, slug, category, description, price, image_url, ingredients, alcohol_level, is_featured, is_available, display_order",
          )
          .eq("is_available", true)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (featuredOnly) {
          query = query.eq("is_featured", true);
        }

        const { data, error } = await query;
        if (!isCurrent()) return;

        if (error) {
          logMenuError(error);
          setItems(fallbackItems);
          setStatus("fallback");
          setFallbackMessage(
            "Il menu live è momentaneamente non disponibile. Ti mostriamo la selezione Noir.",
          );
          return;
        }

        if (!data?.length) {
          setItems(fallbackItems);
          setStatus("fallback");
          setFallbackMessage(
            featuredOnly
              ? "Le nuove creazioni Noir sono in arrivo."
              : "Il nuovo menu è in preparazione. Nel frattempo, scopri la selezione Noir.",
          );
          return;
        }

        setItems(data as PublicCocktail[]);
        setStatus("live");
        setFallbackMessage("");
      } catch (unexpectedError) {
        console.error("[PublicMenu] Unexpected error", unexpectedError);
        if (!isCurrent()) return;
        setItems(fallbackItems);
        setStatus("fallback");
        setFallbackMessage(
          "Il menu live è momentaneamente non disponibile. Ti mostriamo la selezione Noir.",
        );
      }
    },
    [fallbackItems, featuredOnly],
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

  const groupedItems = useMemo(() => {
    const groups = new Map<string, PublicCocktail[]>();
    for (const item of items) {
      const category = item.category?.trim() || "Cocktail";
      groups.set(category, [...(groups.get(category) ?? []), item]);
    }
    return Array.from(groups.entries());
  }, [items]);

  const renderCard = (item: PublicCocktail) => (
    <motion.article
      className="group overflow-hidden rounded-card border border-border bg-card shadow-soft backdrop-blur-sm"
      initial={{ opacity: 0, y: 24 }}
      key={item.id}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.15, once: true }}
      whileHover={{ y: -5 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {item.image_url && (
        <div
          aria-label={`Cocktail ${item.name}`}
          className="h-56 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
          role="img"
          style={{ backgroundImage: `url("${item.image_url}")` }}
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-gold uppercase">
              {item.category}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <h3 className="font-display text-3xl text-gold-light">
                {item.name}
              </h3>
              {item.is_featured && (
                <Star
                  aria-label="Cocktail in evidenza"
                  className="shrink-0 text-gold"
                  fill="currentColor"
                  size={13}
                />
              )}
            </div>
          </div>
          <span className="shrink-0 pt-6 text-sm font-semibold text-gold">
            {formatPrice(item.price)}
          </span>
        </div>

        {item.description && (
          <p className="mt-4 text-sm leading-7 text-noir-gray">
            {item.description}
          </p>
        )}
        {item.ingredients && (
          <p className="mt-3 text-xs leading-6 text-noir-gray">
            <span className="font-semibold tracking-[0.08em] text-gold uppercase">
              Ingredienti:
            </span>{" "}
            {item.ingredients}
          </p>
        )}
        {item.alcohol_level && (
          <p className="mt-3 text-xs tracking-[0.08em] text-noir-gray uppercase">
            {item.alcohol_level}
          </p>
        )}
      </div>
    </motion.article>
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
          description={
            featuredOnly
              ? "Le creazioni scelte dai nostri bartender: carattere Noir, ingredienti ricercati e dettagli inattesi."
              : "Cocktail signature, grandi classici e proposte Noir: scopri la selezione completa."
          }
          label={featuredOnly ? "In evidenza" : "La nostra selezione"}
          title={featuredOnly ? "Cocktail Signature" : "Menu Noir"}
        />

        {status === "loading" ? (
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
            {fallbackMessage && (
              <p
                className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-noir-gray"
                role="status"
              >
                {fallbackMessage}
              </p>
            )}

            {featuredOnly ? (
              <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {items.map(renderCard)}
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
                      {categoryItems.map(renderCard)}
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
