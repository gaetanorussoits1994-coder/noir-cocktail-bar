"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";

import {
  getDisplayTags,
  getMenuAllergens,
} from "@/lib/menu-allergens";
import { cn } from "@/lib/utils";

export type PublicCocktail = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | null;
  image_url?: string | null;
  ingredients: string | null;
  alcohol_level: string | null;
  tags: string[];
  is_featured: boolean;
  is_available: boolean;
  display_order: number;
};

const badgeIcons: Array<{
  matches: string[];
  icon: string;
  label?: string;
}> = [
  { matches: ["smoky", "affumicato"], icon: "🥃", label: "Smoky" },
  { matches: ["citrus", "agrumato", "agrumi"], icon: "🍊", label: "Agrumato" },
  { matches: ["signature"], icon: "⭐", label: "Signature" },
  { matches: ["bitter", "amaro"], icon: "✦", label: "Bitter" },
  { matches: ["mezcal"], icon: "🔥", label: "Mezcal" },
];

export function formatCocktailPrice(price: number | null) {
  if (price === null) return "Su richiesta";

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function decorateTag(tag: string) {
  const normalizedTag = tag.trim().toLowerCase();
  const preset = badgeIcons.find(({ matches }) =>
    matches.some((match) => normalizedTag.includes(match)),
  );

  return {
    icon: preset?.icon || "◆",
    label: preset?.label || tag.trim(),
  };
}

type CocktailBadgesProps = {
  tags: string[];
  className?: string;
};

export function CocktailBadges({
  tags,
  className,
}: CocktailBadgesProps) {
  const uniqueTags = Array.from(
    new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
  );

  if (uniqueTags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {uniqueTags.map((tag) => {
        const decoratedTag = decorateTag(tag);

        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.1em] text-gold-light uppercase backdrop-blur-sm"
            key={tag}
          >
            <span aria-hidden="true">{decoratedTag.icon}</span>
            {decoratedTag.label}
          </span>
        );
      })}
    </div>
  );
}

type MenuCocktailCardProps = {
  cocktail: PublicCocktail;
};

export function MenuCocktailCard({ cocktail }: MenuCocktailCardProps) {
  const displayTags = getDisplayTags(cocktail.tags);
  const allergens = getMenuAllergens(cocktail);

  return (
    <motion.article
      className="group relative h-full overflow-hidden rounded-card border border-border bg-card shadow-soft backdrop-blur-sm transition-[border-color,box-shadow] duration-500 hover:border-gold/45 hover:shadow-[0_28px_80px_rgba(200,169,106,0.16)]"
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.12, once: true }}
      whileHover={{ y: -6 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link
        aria-label={`Scopri il cocktail ${cocktail.name}`}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold"
        href={`/cocktails/${encodeURIComponent(cocktail.slug)}`}
      >
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-gold uppercase">
            {cocktail.category}
          </p>
          <div className="flex min-w-0 items-start justify-between gap-5">
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
              {formatCocktailPrice(cocktail.price)}
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

          <CocktailBadges className="mt-5" tags={displayTags} />

          {allergens.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-[0.6rem] font-semibold tracking-[0.14em] text-gold uppercase">
                Allergeni
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {allergens.map((allergen) => (
                  <span
                    className="rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-[0.62rem] font-semibold text-gold-light"
                    key={allergen.label}
                  >
                    <span aria-hidden="true">{allergen.icon}</span>{" "}
                    {allergen.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <span className="mt-auto pt-6 text-xs font-semibold tracking-[0.12em] text-gold uppercase">
            Scopri il cocktail →
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
