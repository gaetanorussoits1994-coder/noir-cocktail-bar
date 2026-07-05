"use client";

import { createContext, useContext } from "react";

import type {
  CookieConsent,
  CookiePreferences,
} from "@/lib/cookies/types";

export type CookieConsentContextValue = {
  consent: CookieConsent | null;
  isHydrated: boolean;
  isPreferencesOpen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (preferences: CookiePreferences) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

export const CookieConsentContext =
  createContext<CookieConsentContextValue | null>(null);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error(
      "useCookieConsent deve essere usato dentro CookieConsentProvider.",
    );
  }

  return context;
}
