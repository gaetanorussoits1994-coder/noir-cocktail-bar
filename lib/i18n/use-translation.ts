"use client";

import { createContext, useContext } from "react";

import { translations, type TranslationKey } from "./translations";
import type { Locale } from "./types";

export type TranslationContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

export const TranslationContext =
  createContext<TranslationContextValue>({
    locale: "it",
    setLocale: () => undefined,
    t: (key) => translations.it[key],
  });

export function useTranslation() {
  return useContext(TranslationContext);
}
