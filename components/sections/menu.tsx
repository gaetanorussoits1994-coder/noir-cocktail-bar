"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  CocktailCard,
  type CocktailCardProps,
} from "@/components/cards/cocktail-card";
import { SectionTitle } from "@/components/ui/section-title";
import { getSupabaseClient } from "@/lib/supabase";

type CocktailCategoryRow = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

type CocktailRow = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  ingredients: string | null;
  price: number | string | null;
  image_url: string | null;
  is_signature: boolean;
  sort_order: number;
};

type MenuCocktail = CocktailCardProps & {
  id: string;
};

function formatPrice(price: CocktailRow["price"]) {
  if (price === null) {
    return "";
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "";
  }

  return `${numericPrice.toLocaleString("it-IT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}€`;
}

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

export function Menu() {
  const [cocktails, setCocktails] = useState<MenuCocktail[]>([]);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    let isMounted = true;

    async function loadCocktails(client: SupabaseClient) {
      try {
        const [categoriesResult, cocktailsResult] = await Promise.all([
          client
            .from("cocktail_categories")
            .select("id, name, slug, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
          client
            .from("cocktails")
            .select(
              `
                id,
                category_id,
                name,
                description,
                ingredients,
                price,
                image_url,
                is_signature,
                sort_order
              `,
            )
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
        ]);

        if (
          categoriesResult.error ||
          cocktailsResult.error ||
          !isMounted
        ) {
          return;
        }

        const categories =
          (categoriesResult.data ?? []) as CocktailCategoryRow[];
        const cocktailRows =
          (cocktailsResult.data ?? []) as CocktailRow[];
        const categoriesById = new Map(
          categories.map((category) => [
            category.id,
            category,
          ]),
        );

        const activeCocktails = cocktailRows
          .filter(
            (
              cocktail,
            ): cocktail is CocktailRow & {
              category_id: string;
            } =>
              Boolean(
                cocktail.category_id &&
                  categoriesById.has(cocktail.category_id),
              ),
          )
          .sort((first, second) => {
            const firstCategoryOrder =
              categoriesById.get(first.category_id)?.sort_order;
            const secondCategoryOrder =
              categoriesById.get(second.category_id)?.sort_order;

            return (
              (firstCategoryOrder ?? 0) -
                (secondCategoryOrder ?? 0) ||
              first.sort_order - second.sort_order
            );
          })
          .map((cocktail) => {
            const category = categoriesById.get(cocktail.category_id);

            return {
              id: cocktail.id,
              image: cocktail.image_url?.trim() || null,
              name: cocktail.name,
              description: cocktail.description?.trim() || "",
              ingredients: cocktail.ingredients?.trim() || "",
              price: formatPrice(cocktail.price),
              tag:
                category?.name.trim() ||
                (cocktail.is_signature ? "Signature" : ""),
              link: "#prenotazioni",
            };
          });

        setCocktails(activeCocktails);
      } catch {
        // La sezione resta vuota se Supabase non è disponibile.
      }
    }

    void loadCocktails(supabase);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="bg-background-primary px-6 py-24 sm:py-32 lg:px-8"
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
            description="Creazioni esclusive, ingredienti ricercati e carattere deciso: scopri i cocktail che raccontano l'anima di Noir."
            label="La nostra selezione"
            title="Cocktail Menu"
          />
        </motion.div>

        <motion.div
          className="mt-14 grid gap-7 md:grid-cols-3"
          initial="hidden"
          variants={gridVariants}
          viewport={{ amount: 0.15, once: true }}
          whileInView="visible"
        >
          {cocktails.map((cocktail) => (
            <CocktailCard
              description={cocktail.description}
              image={cocktail.image}
              ingredients={cocktail.ingredients}
              key={cocktail.id}
              link={cocktail.link}
              name={cocktail.name}
              price={cocktail.price}
              tag={cocktail.tag}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
