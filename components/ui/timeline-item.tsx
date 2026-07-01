"use client";

import { motion, type Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export type TimelineItemProps = {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
};

export function TimelineItem({
  number,
  title,
  description,
  isLast = false,
}: TimelineItemProps) {
  return (
    <motion.li
      className="relative grid grid-cols-[2rem_1fr] gap-4"
      variants={itemVariants}
    >
      <div className="relative flex justify-center">
        <span className="relative z-10 flex size-7 items-center justify-center rounded-full border border-gold/40 bg-background-secondary text-[0.6rem] font-semibold text-gold">
          {number}
        </span>
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute top-7 bottom-0 w-px translate-y-1 bg-gradient-to-b from-gold/40 to-border"
          />
        )}
      </div>

      <div className={isLast ? undefined : "pb-8"}>
        <h3 className="font-display text-2xl font-medium text-gold-light">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-noir-gray">{description}</p>
      </div>
    </motion.li>
  );
}
