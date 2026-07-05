"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import type { Locale } from "@/lib/i18n/types";
import { useTranslation } from "@/lib/i18n/use-translation";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalDocument = Record<
  Locale,
  {
    title: string;
    intro: string;
    sections: LegalSection[];
  }
>;

export function LegalPage({ document }: { document: LegalDocument }) {
  const { locale, t } = useTranslation();
  const content = document[locale] ?? document.it;

  return (
    <>
      <main className="min-h-screen bg-background-primary px-4 pt-36 pb-24 text-noir-white sm:px-6 lg:px-8">
        <motion.article
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
            Noir Cocktail Bar
          </p>
          <h1 className="mt-4 font-display text-5xl leading-none text-gold-light sm:text-6xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-noir-gray">
            {content.intro}
          </p>
          <p className="mt-3 text-xs tracking-wide text-gold/80">
            {t("legal.lastUpdated")}
          </p>

          <div className="mt-12 grid gap-6">
            {content.sections.map((section, index) => (
              <section
                className="rounded-2xl border border-white/10 bg-background-secondary/60 p-6 sm:p-8"
                key={section.title}
              >
                <div className="flex gap-4">
                  <span className="font-display text-xl text-gold/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl text-gold-light sm:text-3xl">
                      {section.title}
                    </h2>
                    <div className="mt-4 grid gap-3">
                      {section.paragraphs.map((paragraph) => (
                        <p
                          className="text-sm leading-7 text-noir-gray"
                          key={paragraph}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <Link
            className="mt-10 inline-flex rounded-full border border-gold/30 px-5 py-2.5 text-xs font-semibold text-gold-light transition hover:bg-gold/10"
            href="/#home"
          >
            {t("legal.backHome")}
          </Link>
        </motion.article>
      </main>
      <Footer />
    </>
  );
}
