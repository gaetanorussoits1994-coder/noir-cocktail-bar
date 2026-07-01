"use client";

import { motion, type Variants } from "framer-motion";

import { ArtistCard } from "@/components/cards/artist-card";
import { SectionTitle } from "@/components/ui/section-title";
import { artists } from "@/lib/data/static-content";

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

export function MeetTheArtists() {
  return (
    <section
      className="w-full max-w-full overflow-hidden bg-background-primary px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      id="meet-the-artists"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.5, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionTitle
            description="Dietro ogni creazione ci sono sensibilità, tecnica e ricerca: incontra gli artisti che danno forma all'esperienza Noir."
            label="The People Behind Noir"
            title="Meet the Artists"
          />
        </motion.div>

        <motion.div
          className="mt-14 grid min-w-0 gap-7 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          variants={gridVariants}
          viewport={{ amount: 0.12, once: true }}
          whileInView="visible"
        >
          {artists.map((artist) => (
            <ArtistCard {...artist} key={artist.name} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
