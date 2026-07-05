"use client";

import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "@/lib/i18n/use-translation";

export function AboutStory() {
  const { t } = useTranslation();
  const story = t("about.story").split("|");

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-gold uppercase">
            {t("story.label")}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] text-gold-light sm:text-7xl">
            {t("about.title")}
          </h1>
          <div className="mt-8 space-y-5">
            {story.map((paragraph) => (
              <p
                className="max-w-2xl text-sm leading-7 text-noir-gray sm:text-base sm:leading-8"
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <Link
            className="mt-9 inline-flex items-center rounded-card border border-gold px-6 py-3.5 text-sm font-medium text-gold-light transition hover:bg-gold hover:text-background-primary"
            href="/menu"
          >
            {t("about.menuCta")}
          </Link>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-gold/20 shadow-gold">
          <Image
            alt={t("about.imageAlt")}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 55vw"
            src="/images/gallery-interior.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
          <div className="absolute right-6 bottom-6 left-6 border-t border-gold/35 pt-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              Noir Cocktail Bar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
