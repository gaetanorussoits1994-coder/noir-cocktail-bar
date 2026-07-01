"use client";

import { motion, type Variants } from "framer-motion";
import { AtSign } from "lucide-react";
import Image from "next/image";

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

export type ArtistCardProps = {
  image: string;
  name: string;
  role: string;
  specialty: string;
  quote: string;
  instagramHandle: string;
  instagramHref: string;
};

export function ArtistCard({
  image,
  name,
  role,
  specialty,
  quote,
  instagramHandle,
  instagramHref,
}: ArtistCardProps) {
  return (
    <motion.article
      className="group relative aspect-[3/4] min-h-[34rem] overflow-hidden rounded-card border border-border bg-card shadow-soft"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      variants={cardVariants}
      whileHover={{
        y: -8,
        borderColor: "rgba(200, 169, 106, 0.25)",
        boxShadow: "0 24px 70px rgba(200, 169, 106, 0.1)",
      }}
    >
      <Image
        alt={`${name}, ${role} del Noir Cocktail Bar`}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        fill
        sizes="(max-width: 767px) 100vw, 33vw"
        src={image}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-gold/80 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/35 p-6 backdrop-blur-sm sm:p-7">
        <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold uppercase">
          {role}
        </p>
        <h3 className="mt-2 font-display text-3xl font-medium text-gold-light sm:text-4xl">
          {name}
        </h3>

        <p className="mt-3 text-xs font-medium tracking-[0.1em] text-noir-gray uppercase">
          {specialty}
        </p>
        <p className="mt-4 font-display text-lg leading-6 text-noir-white/90 italic">
          “{quote}”
        </p>

        <a
          aria-label={`Instagram di ${name}`}
          className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-gold-light opacity-70 transition-[opacity,transform] duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          href={instagramHref}
          rel="noreferrer"
          target="_blank"
        >
          <AtSign aria-hidden="true" size={16} strokeWidth={1.5} />
          {instagramHandle}
        </a>
      </div>
    </motion.article>
  );
}
