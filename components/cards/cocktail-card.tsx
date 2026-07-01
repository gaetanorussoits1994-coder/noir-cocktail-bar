"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { PremiumButton } from "@/components/ui/premium-button";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export type CocktailCardProps = {
  image: string;
  name: string;
  description: string;
  price: string;
  link: string;
};

export function CocktailCard({
  image,
  name,
  description,
  price,
  link,
}: CocktailCardProps) {
  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-card shadow-soft backdrop-blur-sm"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      variants={cardVariants}
      whileHover={{
        y: -8,
        boxShadow: "0 24px 70px rgba(200, 169, 106, 0.1)",
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          alt={`Cocktail ${name}`}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          src={image}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background-primary/70 via-transparent to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <h3 className="font-display text-3xl font-medium text-gold-light">
            {name}
          </h3>
          <span className="pt-1 text-sm font-semibold text-gold">{price}</span>
        </div>

        <p className="mt-4 text-sm leading-7 text-noir-gray">{description}</p>

        <PremiumButton className="mt-7" href={link} variant="link">
          Scopri il Cocktail
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </PremiumButton>
      </div>
    </motion.article>
  );
}
