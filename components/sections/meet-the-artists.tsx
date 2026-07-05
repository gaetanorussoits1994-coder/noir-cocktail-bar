"use client";

import { motion, type Variants } from "framer-motion";

import { ArtistCard } from "@/components/cards/artist-card";
import { SectionTitle } from "@/components/ui/section-title";
import { artists } from "@/lib/data/static-content";
import { useTranslation } from "@/lib/i18n/use-translation";

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

export function MeetTheArtists() {
  const { t } = useTranslation();
  const artistTranslations = [
    {
      specialty: t("artists.alessandro.specialty"),
      quote: t("artists.alessandro.quote"),
    },
    {
      specialty: t("artists.sofia.specialty"),
      quote: t("artists.sofia.quote"),
    },
    {
      specialty: t("artists.lorenzo.specialty"),
      quote: t("artists.lorenzo.quote"),
    },
  ];
  const localizedArtists = artists.map((artist, index) => ({
    ...artist,
    ...(artistTranslations[index] || artistTranslations[0]),
  }));

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
            description={t("artists.description")}
            label={t("artists.label")}
            title={t("artists.title")}
          />
        </motion.div>

        <motion.div
          className="mt-14 grid min-w-0 gap-7 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          variants={gridVariants}
          viewport={{ amount: 0.12, once: true }}
          whileInView="visible"
        >
          {localizedArtists.map((artist) => (
            <ArtistCard {...artist} key={artist.name} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
