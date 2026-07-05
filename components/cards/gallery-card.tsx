"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

const aspectRatios = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  tall: "aspect-[3/4]",
};

export type GalleryCardProps = {
  image: string;
  alt: string;
  category: string;
  aspectRatio: keyof typeof aspectRatios;
  delay?: number;
  onClick?: () => void;
};

export function GalleryCard({
  image,
  alt,
  category,
  aspectRatio,
  delay = 0,
  onClick,
}: GalleryCardProps) {
  const { t } = useTranslation();

  return (
    <motion.article
      aria-label={
        onClick ? `${t("gallery.openImage")}: ${alt}` : undefined
      }
      className={cn(
        "group relative mb-6 min-w-0 break-inside-avoid overflow-hidden rounded-card border border-border bg-card shadow-soft",
        aspectRatios[aspectRatio],
        onClick && "cursor-pointer",
      )}
      initial={{ opacity: 0, y: 32 }}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      transition={{
        delay,
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Image
        alt={alt}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        fill
        loading="lazy"
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
        src={image}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/15"
      />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold" />
          <span className="min-w-0 break-words text-[0.65rem] font-semibold tracking-[0.24em] text-gold-light uppercase">
            {category}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
