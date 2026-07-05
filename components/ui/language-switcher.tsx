"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { supportedLocales } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div
      aria-label={t("language.label")}
      className={cn(
        "inline-flex items-center rounded-full border border-gold/25 bg-black/25 p-1 backdrop-blur-md",
        className,
      )}
      role="group"
    >
      {supportedLocales.map((item) => (
        <button
          aria-pressed={locale === item}
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] uppercase transition-colors",
            locale === item
              ? "bg-gold text-background-primary"
              : "text-noir-gray hover:text-gold-light",
          )}
          key={item}
          onClick={() => setLocale(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
