"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { PremiumButton } from "@/components/ui/premium-button";
import { SectionTitle } from "@/components/ui/section-title";

const revealTransition = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function Experience() {
  return (
    <section
      className="overflow-hidden bg-background-secondary px-6 py-24 sm:py-32 lg:px-8"
      id="experience"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-card border border-border shadow-soft"
          initial={{ opacity: 0, x: -48 }}
          transition={revealTransition}
          viewport={{ amount: 0.25, once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <Image
            alt="Cocktail artigianale servito sul bancone del Noir Cocktail Bar"
            className="object-cover"
            fill
            sizes="(max-width: 1023px) 100vw, 52vw"
            src="/images/experience-cocktail.png"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10"
          />
          <div
            aria-hidden="true"
            className="absolute right-5 bottom-5 left-5 h-px bg-gradient-to-r from-gold/70 to-transparent"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 48 }}
          transition={{ ...revealTransition, delay: 0.08 }}
          viewport={{ amount: 0.3, once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <SectionTitle
            align="left"
            description="Cocktail, atmosfera e dettagli pensati per offrire un'esperienza unica."
            label="Experience"
            title="The Art of Mixology"
          />

          <p className="mt-6 max-w-xl text-sm leading-7 text-noir-gray sm:text-base sm:leading-8">
            Ogni cocktail nasce da ingredienti selezionati, tecniche moderne e
            passione per la miscelazione. Noir Cocktail Bar è un luogo dove
            design, musica e sapori si fondono per creare un&apos;esperienza
            memorabile.
          </p>

          <PremiumButton
            className="mt-9"
            href="#contatti"
            variant="outline"
          >
            Scopri la nostra storia
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
          </PremiumButton>
        </motion.div>
      </div>
    </section>
  );
}
