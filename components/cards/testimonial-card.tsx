"use client";

import { motion, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export type TestimonialCardProps = {
  name: string;
  text: string;
  rating: number;
};

export function TestimonialCard({
  name,
  text,
  rating,
}: TestimonialCardProps) {
  const { t } = useTranslation();

  return (
    <motion.article
      className="relative overflow-hidden rounded-card border border-border bg-card p-6 shadow-soft backdrop-blur-sm sm:p-7"
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      variants={cardVariants}
      whileHover={{
        y: -4,
        borderColor: "rgba(200, 169, 106, 0.25)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-3 right-6 font-display text-7xl leading-none text-gold/10"
      >
        “
      </span>

      <div
        aria-label={`${rating} ${t("testimonials.rating")}`}
        className="relative flex gap-1 text-gold"
      >
        {Array.from({ length: rating }, (_, index) => (
          <Star
            aria-hidden="true"
            fill="currentColor"
            key={index}
            size={14}
            strokeWidth={1.5}
          />
        ))}
      </div>

      <blockquote className="relative mt-5 font-display text-2xl leading-8 text-noir-white">
        {text}
      </blockquote>

      <div className="relative mt-6 flex items-center gap-3">
        <span className="h-px w-8 bg-gold/70" />
        <p className="text-xs font-semibold tracking-[0.14em] text-noir-gray uppercase">
          {name}
        </p>
      </div>
    </motion.article>
  );
}
