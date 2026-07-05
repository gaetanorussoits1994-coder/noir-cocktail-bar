"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  CookieConsent,
  CookiePreferences,
} from "@/lib/cookies/types";
import { CookieConsentContext } from "@/lib/cookies/use-cookie-consent";

const storageKey = "noir-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(consent: CookieConsent) {
  window.gtag?.("consent", "update", {
    functionality_storage: consent.preferences ? "granted" : "denied",
    personalization_storage: consent.preferences ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
}

function isStoredConsent(value: unknown): value is CookieConsent {
  if (!value || typeof value !== "object") return false;
  const consent = value as Partial<CookieConsent>;

  return (
    consent.version === 1 &&
    consent.essential === true &&
    typeof consent.preferences === "boolean" &&
    typeof consent.analytics === "boolean" &&
    typeof consent.marketing === "boolean" &&
    typeof consent.updatedAt === "string"
  );
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      const parsed: unknown = stored ? JSON.parse(stored) : null;

      if (isStoredConsent(parsed)) {
        setConsent(parsed);
        updateGoogleConsent(parsed);
      }
    } catch (error) {
      console.error("[CookieConsent] Impossibile leggere il consenso:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const persist = useCallback((preferences: CookiePreferences) => {
    const nextConsent: CookieConsent = {
      version: 1,
      essential: true,
      ...preferences,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(storageKey, JSON.stringify(nextConsent));
    setConsent(nextConsent);
    setIsPreferencesOpen(false);
    updateGoogleConsent(nextConsent);
    window.dispatchEvent(
      new CustomEvent("noir:consent-updated", { detail: nextConsent }),
    );
  }, []);

  const value = useMemo(
    () => ({
      consent,
      isHydrated,
      isPreferencesOpen,
      acceptAll: () =>
        persist({ preferences: true, analytics: true, marketing: true }),
      rejectOptional: () =>
        persist({ preferences: false, analytics: false, marketing: false }),
      savePreferences: persist,
      openPreferences: () => setIsPreferencesOpen(true),
      closePreferences: () => setIsPreferencesOpen(false),
    }),
    [consent, isHydrated, isPreferencesOpen, persist],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}
