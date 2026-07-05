"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { SectionTitle } from "@/components/ui/section-title";
import { StatCard, type StatCardProps } from "@/components/ui/stat-card";
import {
  TimelineItem,
  type TimelineItemProps,
} from "@/components/ui/timeline-item";
import { useTranslation } from "@/lib/i18n/use-translation";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

export function OurStory() {
  const { t } = useTranslation();
  const timeline: TimelineItemProps[] = [
    {
      number: "01",
      title: "Selection",
      description: t("story.timeline.selection"),
    },
    {
      number: "02",
      title: "Creation",
      description: t("story.timeline.creation"),
    },
    {
      number: "03",
      title: "Experience",
      description: t("story.timeline.experience"),
    },
  ];
  const stats: StatCardProps[] = [
    { value: "40+", label: "Signature Drinks" },
    { value: "12", label: t("story.stats.events") },
    { value: "5", label: t("story.stats.years") },
  ];

  return (
    <section
      className="relative w-full max-w-full overflow-hidden bg-background-secondary px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      id="our-story"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px] opacity-[0.035]"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-0 size-96 rounded-full bg-gold/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <motion.div
            initial="hidden"
            variants={staggerVariants}
            viewport={{ amount: 0.2, once: true }}
            whileInView="visible"
          >
            <motion.div variants={revealVariants}>
              <SectionTitle
                align="left"
                label={t("story.label")}
                title={t("story.title")}
              />
            </motion.div>

            <motion.p
              className="mt-7 max-w-xl text-sm leading-7 text-noir-gray sm:text-base sm:leading-8"
              variants={revealVariants}
            >
              {t("story.description")}
            </motion.p>

            <motion.ol className="mt-10" variants={staggerVariants}>
              {timeline.map((item, index) => (
                <TimelineItem
                  {...item}
                  isLast={index === timeline.length - 1}
                  key={item.title}
                />
              ))}
            </motion.ol>
          </motion.div>

          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-card border border-border shadow-soft"
            initial={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ amount: 0.2, once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Image
              alt={t("story.imageAlt")}
              className="object-cover"
              fill
              sizes="(max-width: 1023px) 100vw, 55vw"
              src="/images/gallery-interior.png"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/20"
            />

            <div className="absolute right-6 bottom-6 left-6 rounded-card border border-white/10 bg-black/35 p-5 backdrop-blur-md">
              <p className="text-[0.65rem] font-semibold tracking-[0.24em] text-gold uppercase">
                Est. 2026
              </p>
              <p className="mt-2 font-display text-2xl text-noir-white">
                Noir Cocktail Bar
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 grid gap-5 sm:grid-cols-3 lg:mt-20"
          initial="hidden"
          variants={staggerVariants}
          viewport={{ amount: 0.25, once: true }}
          whileInView="visible"
        >
          {stats.map((stat) => (
            <StatCard {...stat} key={stat.label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
