"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { translations, type TranslationKey } from "@/lib/i18n/translations";
import {
  TranslationContext,
  type TranslationContextValue,
} from "@/lib/i18n/use-translation";
import { isLocale, type Locale } from "@/lib/i18n/types";

const storageKey = "noir-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("it");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(storageKey);
    if (isLocale(storedLocale)) setLocale(storedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(storageKey, locale);
  }, [locale]);

  const contextValue = useMemo<TranslationContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key: TranslationKey) => translations[locale][key],
    }),
    [locale],
  );

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}
