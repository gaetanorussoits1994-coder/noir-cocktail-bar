"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { SectionTitle } from "@/components/ui/section-title";
import {
  fallbackMenu,
  type PublicMenuCategory,
} from "@/lib/data/static-content";
import { getSupabaseClient } from "@/lib/supabase";
import type {
  MenuCategoryRow,
  MenuItemRow,
} from "@/lib/supabase/types";

function formatPrice(price: number | null) {
  if (price === null) {
    return "Su richiesta";
  }

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function buildPublicMenu(
  categories: MenuCategoryRow[],
  items: MenuItemRow[],
): PublicMenuCategory[] {
  const itemsByCategory = new Map<string, MenuItemRow[]>();

  for (const item of items) {
    if (!item.category_id) continue;
    const categoryItems = itemsByCategory.get(item.category_id) ?? [];
    categoryItems.push(item);
    itemsByCategory.set(item.category_id, categoryItems);
  }

  return categories
    .sort((first, second) => first.sort_order - second.sort_order)
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description?.trim() || "",
      sortOrder: category.sort_order,
      items: (itemsByCategory.get(category.id) ?? [])
        .sort((first, second) => first.sort_order - second.sort_order)
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description?.trim() || "",
          ingredients: item.ingredients?.trim() || "",
          price: item.price,
          imageUrl: item.image_url?.trim() || null,
          tags: item.tags,
          isFeatured: item.is_featured,
          sortOrder: item.sort_order,
        })),
    }));
}

type MenuStatus = "loading" | "live" | "fallback";

export function Menu() {
  const [categories, setCategories] =
    useState<PublicMenuCategory[]>(fallbackMenu);
  const [status, setStatus] = useState<MenuStatus>("loading");
  const [fallbackMessage, setFallbackMessage] = useState("");

  const loadMenu = useCallback(async (isCurrent: () => boolean) => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      if (isCurrent()) {
        setStatus("fallback");
        setFallbackMessage(
          "Menu online non disponibile: mostriamo la selezione Noir.",
        );
      }
      return;
    }

    try {
      const [categoriesResult, itemsResult] = await Promise.all([
        supabase
          .from("menu_categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true)
          .order("sort_order", { ascending: true }),
      ]);

      if (!isCurrent()) return;

      const queryError = categoriesResult.error || itemsResult.error;
      if (queryError) {
        setCategories(fallbackMenu);
        setStatus("fallback");
        setFallbackMessage(
          "Il menu live è momentaneamente non disponibile. Ti mostriamo la selezione Noir.",
        );
        return;
      }

      const publicMenu = buildPublicMenu(
        categoriesResult.data ?? [],
        itemsResult.data ?? [],
      );
      const hasItems = publicMenu.some((category) => category.items.length > 0);

      if (!hasItems) {
        setCategories(fallbackMenu);
        setStatus("fallback");
        setFallbackMessage(
          "Il nuovo menu è in preparazione. Nel frattempo, scopri la selezione Noir.",
        );
        return;
      }

      setCategories(publicMenu);
      setStatus("live");
      setFallbackMessage("");
    } catch {
      if (!isCurrent()) return;
      setCategories(fallbackMenu);
      setStatus("fallback");
      setFallbackMessage(
        "Il menu live è momentaneamente non disponibile. Ti mostriamo la selezione Noir.",
      );
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let isMounted = true;
    const isCurrent = () => isMounted;

    void loadMenu(isCurrent);

    const channel = supabase
      ?.channel("public-menu")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_categories" },
        () => void loadMenu(isCurrent),
      )
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
  }, [loadMenu]);

  return (
    <section
      className="w-full max-w-full overflow-hidden bg-background-primary px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      id="menu"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.5, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionTitle
            description="Creazioni esclusive, ingredienti ricercati e carattere deciso: scopri il menu che racconta l'anima di Noir."
            label="La nostra selezione"
            title="Menu Noir"
          />
        </motion.div>

        {status === "loading" ? (
          <div
            aria-label="Caricamento menu"
            className="mt-14 grid gap-6 md:grid-cols-2"
            role="status"
          >
            {[0, 1, 2, 3].map((item) => (
              <div
                className="h-44 animate-pulse rounded-card border border-border bg-card/60"
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

            <div className="mt-14 space-y-16">
              {categories.map((category, categoryIndex) => (
                <motion.section
                  aria-labelledby={`menu-category-${category.id}`}
                  id={category.slug}
                  initial={{ opacity: 0, y: 24 }}
                  key={category.id}
                  transition={{
                    delay: Math.min(categoryIndex * 0.06, 0.24),
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ amount: 0.12, once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-7 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-gold uppercase">
                        {String(categoryIndex + 1).padStart(2, "0")}
                      </p>
                      <h3
                        className="mt-2 font-display text-3xl font-medium text-gold-light sm:text-4xl"
                        id={`menu-category-${category.id}`}
                      >
                        {category.name}
                      </h3>
                    </div>
                    {category.description && (
                      <p className="max-w-xl text-sm leading-6 text-noir-gray sm:text-right">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {category.items.length === 0 ? (
                    <p className="rounded-card border border-border bg-card/40 px-6 py-8 text-sm text-noir-gray">
                      La selezione di questa categoria è in aggiornamento.
                    </p>
                  ) : (
                    <div className="grid gap-x-10 gap-y-5 md:grid-cols-2">
                      {category.items.map((item) => (
                        <article
                          className="group rounded-card border border-border bg-card/70 p-5 shadow-soft backdrop-blur-sm transition-colors hover:border-gold/30 sm:p-6"
                          key={item.id}
                        >
                          <div className="flex items-start justify-between gap-5">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-display text-2xl text-gold-light">
                                  {item.name}
                                </h4>
                                {item.isFeatured && (
                                  <Star
                                    aria-label="In evidenza"
                                    className="shrink-0 text-gold"
                                    fill="currentColor"
                                    size={13}
                                  />
                                )}
                              </div>
                              {item.description && (
                                <p className="mt-2 text-sm leading-6 text-noir-gray">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <span className="shrink-0 pt-1 text-sm font-semibold text-gold">
                              {formatPrice(item.price)}
                            </span>
                          </div>

                          {item.ingredients && (
                            <p className="mt-3 text-xs leading-5 text-noir-gray">
                              <span className="font-semibold tracking-[0.08em] text-gold uppercase">
                                Ingredienti:
                              </span>{" "}
                              {item.ingredients}
                            </p>
                          )}

                          {item.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.tags.map((tag) => (
                                <span
                                  className="rounded-full border border-gold/20 px-2.5 py-1 text-[0.6rem] tracking-[0.12em] text-gold-light uppercase"
                                  key={`${item.id}-${tag}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </motion.section>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
