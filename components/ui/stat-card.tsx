"use client";

import { motion, type Variants } from "framer-motion";

const statVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <motion.div
      className="rounded-card border border-border bg-card px-6 py-7 text-center shadow-soft backdrop-blur-sm"
      variants={statVariants}
      whileHover={{
        y: -4,
        borderColor: "rgba(200, 169, 106, 0.25)",
      }}
    >
      <p className="font-display text-4xl font-medium text-gold-light sm:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-xs font-medium tracking-[0.12em] text-noir-gray uppercase">
        {label}
      </p>
    </motion.div>
  );
}
