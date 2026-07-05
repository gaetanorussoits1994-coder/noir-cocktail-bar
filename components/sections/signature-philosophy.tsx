"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/use-translation";

const contentVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function SignaturePhilosophy() {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const keywords = t("philosophy.keywords").split("|");

  return (
    <section
      className="relative isolate flex min-h-[88svh] w-full max-w-full items-center justify-center overflow-hidden border-t border-border bg-background-primary px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      id="signature-philosophy"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] bg-[length:26px_26px] opacity-[0.025]"
      />
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.35, 0.65, 0.35],
              }
        }
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[28rem] w-[80vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-20 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl text-center"
        initial="hidden"
        variants={contentVariants}
        viewport={{ amount: 0.35, once: true }}
        whileInView="visible"
      >
        <motion.div
          className="flex items-center justify-center gap-4"
          variants={revealVariants}
        >
          <span className="h-px w-10 bg-gold/70" />
          <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold uppercase">
            {t("philosophy.label")}
          </p>
          <span className="h-px w-10 bg-gold/70" />
        </motion.div>

        <motion.h2
          className="mt-10 font-display text-[clamp(4rem,10vw,9rem)] leading-[0.88] font-medium tracking-[-0.045em] text-gold-light drop-shadow-[0_0_48px_rgba(200,169,106,0.12)]"
          variants={revealVariants}
        >
          {t("philosophy.title")}
        </motion.h2>

        <motion.p
          className="mx-auto mt-9 max-w-2xl text-sm leading-7 text-noir-gray sm:text-base sm:leading-8"
          variants={revealVariants}
        >
          {t("philosophy.description")}
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-0"
          variants={contentVariants}
        >
          {keywords.map((keyword, index) => (
            <motion.div
              className="flex items-center"
              key={keyword}
              variants={revealVariants}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-8 hidden size-1 rounded-full bg-gold/60 sm:block"
                />
              )}
              <span className="font-display text-xl tracking-[0.08em] text-noir-white sm:text-2xl">
                {keyword}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
