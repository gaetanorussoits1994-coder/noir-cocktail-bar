"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export type EventCardProps = {
  title: string;
  schedule: string;
  description: string;
  number: string;
  delay?: number;
};

export function EventCard({
  title,
  schedule,
  description,
  number,
  delay = 0,
}: EventCardProps) {
  return (
    <motion.article
      className="relative flex min-h-72 flex-col overflow-hidden rounded-card border border-border bg-card p-7 shadow-soft backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0, y: 32 }}
      transition={{
        delay,
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ amount: 0.25, once: true }}
      whileHover={{
        y: -6,
        borderColor: "rgba(200, 169, 106, 0.3)",
        boxShadow: "0 24px 70px rgba(200, 169, 106, 0.08)",
      }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 size-48 rounded-full bg-gold/5 blur-3xl"
      />

      <div className="relative flex items-center gap-3 text-gold">
        <CalendarDays aria-hidden="true" size={17} strokeWidth={1.5} />
        <span className="text-xs font-semibold tracking-[0.16em] uppercase">
          {schedule}
        </span>
      </div>

      <h3 className="relative mt-8 font-display text-4xl font-medium text-gold-light">
        {title}
      </h3>

      <p className="relative mt-5 max-w-sm text-sm leading-7 text-noir-gray">
        {description}
      </p>

      <div className="relative mt-auto flex items-end justify-between pt-10">
        <span className="h-px w-12 bg-gold/60" />
        <span
          aria-hidden="true"
          className="font-display text-3xl text-noir-white/10"
        >
          {number}
        </span>
      </div>
    </motion.article>
  );
}
