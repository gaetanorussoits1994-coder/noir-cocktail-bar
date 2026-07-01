"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { PremiumButton } from "@/components/ui/premium-button";
import { getSupabaseClient } from "@/lib/supabase";

type HeroContent = {
  title: string;
  subtitle: string;
  description: string;
  backgroundUrl: string | null;
};

type SiteSettingsHero = {
  site_name: string | null;
  tagline: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_background_url: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  opening_hours: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
};

const initialHeroContent: HeroContent = {
  title: "",
  subtitle: "",
  description: "",
  backgroundUrl: null,
};

function getText(value: string | null) {
  return value?.trim() || "";
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.18,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Hero() {
  const [content, setContent] =
    useState<HeroContent>(initialHeroContent);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    let isMounted = true;

    async function loadHeroContent(client: SupabaseClient) {
      try {
        const { data, error } = await client
          .from("site_settings")
          .select(
            `
              site_name,
              tagline,
              hero_title,
              hero_subtitle,
              hero_description,
              hero_background_url,
              phone,
              email,
              whatsapp,
              address,
              opening_hours,
              instagram_url,
              facebook_url
            `,
          )
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error || !data || !isMounted) {
          return;
        }

        const settings = data as SiteSettingsHero;

        setContent({
          title:
            getText(settings.hero_title) ||
            getText(settings.site_name),
          subtitle:
            getText(settings.hero_subtitle) ||
            getText(settings.tagline),
          description: getText(settings.hero_description),
          backgroundUrl: settings.hero_background_url?.trim() || null,
        });
      } catch {
        // Mantiene la struttura della Hero se Supabase non è disponibile.
      }
    }

    void loadHeroContent(supabase);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="relative isolate flex min-h-svh w-full max-w-full items-center justify-center overflow-hidden bg-background-primary px-4 pt-20 text-noir-white sm:px-6 lg:px-8"
      id="home"
    >
      <div aria-hidden="true" className="absolute inset-0">
        {content.backgroundUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${content.backgroundUrl}")`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.11),transparent_48%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/75" />
        <div className="absolute top-1/2 left-1/2 h-48 w-3/4 max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute inset-x-8 top-28 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <motion.section
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-5xl overflow-hidden text-center"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div
          aria-hidden="true"
          className="mb-7 flex items-center justify-center gap-4"
          variants={itemVariants}
        >
          <span className="h-px w-10 bg-gold/70" />
          <span className="text-[0.65rem] font-medium tracking-[0.32em] text-gold uppercase">
            Est. 2026
          </span>
          <span className="h-px w-10 bg-gold/70" />
        </motion.div>

        <motion.h1
          className="break-words font-display text-5xl leading-[0.9] font-medium tracking-[-0.04em] text-gold-light drop-shadow-[0_0_36px_rgba(200,169,106,0.18)] [overflow-wrap:anywhere] min-[360px]:text-6xl sm:text-8xl lg:text-9xl"
          variants={itemVariants}
        >
          {content.title}
        </motion.h1>

        <motion.p
          className="mt-7 text-xs font-medium tracking-[0.3em] text-noir-gray uppercase sm:text-sm"
          variants={itemVariants}
        >
          {content.subtitle}
        </motion.p>

        <motion.p
          className="mx-auto mt-5 max-w-xl text-sm leading-7 text-noir-gray sm:text-base"
          variants={itemVariants}
        >
          {content.description}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          variants={itemVariants}
        >
          <PremiumButton href="#menu">
            Scopri il Menu
          </PremiumButton>
          <PremiumButton href="#prenotazioni" variant="secondary">
            Prenota un Tavolo
          </PremiumButton>
        </motion.div>
      </motion.section>

      <motion.a
        animate={{ opacity: 1 }}
        aria-label="Scorri verso il contenuto"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] font-medium tracking-[0.25em] text-noir-gray uppercase"
        href="#menu"
        initial={{ opacity: 0 }}
        transition={{ delay: 1.35, duration: 0.8 }}
      >
        Scroll
        <span className="flex h-9 w-5 justify-center rounded-full border border-border pt-1.5">
          <motion.span
            animate={{ opacity: [0.35, 1, 0.35], y: [0, 9, 0] }}
            className="size-1 rounded-full bg-gold"
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
      </motion.a>
    </section>
  );
}
