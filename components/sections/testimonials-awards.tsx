"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { AwardCard } from "@/components/cards/award-card";
import {
  TestimonialCard,
  type TestimonialCardProps,
} from "@/components/cards/testimonial-card";
import { SectionTitle } from "@/components/ui/section-title";
import { awards } from "@/lib/data/static-content";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getSupabaseClient } from "@/lib/supabase";

type TestimonialRow = {
  id: string;
  name: string;
  text: string;
  rating: number;
};

type TestimonialItem = TestimonialCardProps & {
  id: string;
};

const testimonialVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

export function TestimonialsAwards() {
  const { locale, t } = useTranslation();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    [],
  );
  const translatedFallbackTestimonials: TestimonialItem[] = [
    {
      id: "fallback-marco",
      name: "Marco Bellini",
      text: t("testimonials.marco"),
      rating: 5,
    },
    {
      id: "fallback-giulia",
      name: "Giulia Ferri",
      text: t("testimonials.giulia"),
      rating: 5,
    },
    {
      id: "fallback-davide",
      name: "Davide Romano",
      text: t("testimonials.davide"),
      rating: 5,
    },
  ];
  const displayedTestimonials =
    locale === "en" || testimonials.length === 0
      ? translatedFallbackTestimonials
      : testimonials;

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    let isMounted = true;

    async function loadTestimonials(client: SupabaseClient) {
      try {
        const { data, error } = await client
          .from("testimonials")
          .select("id, name, text, rating, sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (error || !data || !isMounted) {
          return;
        }

        const items = (data as TestimonialRow[]).map(
          (testimonial) => ({
            id: testimonial.id,
            name: testimonial.name,
            text: testimonial.text,
            rating: testimonial.rating,
          }),
        );

        setTestimonials(items);
      } catch {
        // Le testimonianze restano vuote se Supabase non è disponibile.
      }
    }

    void loadTestimonials(supabase);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="w-full max-w-full overflow-hidden bg-background-secondary px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      id="testimonials"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          description={t("testimonials.description")}
          label={t("testimonials.label")}
          title={t("testimonials.title")}
        />

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <motion.div
            className="grid gap-5"
            initial="hidden"
            variants={testimonialVariants}
            viewport={{ amount: 0.15, once: true }}
            whileInView="visible"
          >
            {displayedTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                rating={testimonial.rating}
                text={testimonial.text}
              />
            ))}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ amount: 0.25, once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-gold" />
              <h3 className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">
                {t("testimonials.awards")}
              </h3>
            </div>

            <div className="grid gap-5">
              {awards.map((award) => (
                <AwardCard {...award} key={award.title} />
              ))}
            </div>

            <div
              aria-hidden="true"
              className="mt-8 h-px bg-gradient-to-r from-gold/40 to-transparent"
            />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
