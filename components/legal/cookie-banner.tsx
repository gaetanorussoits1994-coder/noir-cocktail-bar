"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCookieConsent } from "@/lib/cookies/use-cookie-consent";
import { useTranslation } from "@/lib/i18n/use-translation";

export function CookieBanner() {
  const {
    consent,
    isHydrated,
    isPreferencesOpen,
    acceptAll,
    rejectOptional,
    savePreferences,
    openPreferences,
    closePreferences,
  } = useCookieConsent();
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (!consent) return;
    setPreferences({
      preferences: consent.preferences,
      analytics: consent.analytics,
      marketing: consent.marketing,
    });
  }, [consent]);

  const isVisible = isHydrated && (!consent || isPreferencesOpen);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          aria-live="polite"
          aria-modal={isPreferencesOpen || undefined}
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gold/30 bg-background-secondary/98 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
          exit={{ opacity: 0, y: 24 }}
          initial={{ opacity: 0, y: 32 }}
          id="cookie-preferences"
          role={isPreferencesOpen ? "dialog" : "region"}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isPreferencesOpen && consent && (
            <button
              aria-label={t("cookie.closePreferences")}
              className="absolute top-4 right-4 text-noir-gray transition hover:text-gold"
              onClick={closePreferences}
              type="button"
            >
              <X size={18} />
            </button>
          )}

          <div className="pr-7">
            <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-gold uppercase">
              Privacy
            </p>
            <h2 className="mt-2 font-display text-2xl text-gold-light sm:text-3xl">
              {t("cookie.title")}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-noir-gray">
              {t("cookie.description")}{" "}
              <Link className="text-gold underline-offset-4 hover:underline" href="/cookie-policy">
                {t("footer.cookies")}
              </Link>{" "}
              ·{" "}
              <Link className="text-gold underline-offset-4 hover:underline" href="/privacy-policy">
                {t("footer.privacy")}
              </Link>
            </p>
          </div>

          {isPreferencesOpen && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CookieChoice
                checked
                description={t("cookie.essentialDescription")}
                disabled
                label={t("cookie.essential")}
                status={t("cookie.alwaysActive")}
              />
              {(["preferences", "analytics", "marketing"] as const).map(
                (key) => (
                  <CookieChoice
                    checked={preferences[key]}
                    description={t(`cookie.${key}Description`)}
                    key={key}
                    label={t(`cookie.${key}`)}
                    onChange={(checked) =>
                      setPreferences((current) => ({
                        ...current,
                        [key]: checked,
                      }))
                    }
                  />
                ),
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5">
            {isPreferencesOpen ? (
              <button
                className="rounded-full bg-gold px-5 py-2.5 text-xs font-semibold tracking-wide text-background-primary transition hover:bg-gold-light"
                onClick={() => savePreferences(preferences)}
                type="button"
              >
                {t("cookie.save")}
              </button>
            ) : (
              <button
                className="rounded-full border border-gold/30 px-5 py-2.5 text-xs font-semibold text-gold-light transition hover:bg-gold/10"
                onClick={openPreferences}
                type="button"
              >
                {t("cookie.customize")}
              </button>
            )}
            <button
              className="rounded-full border border-white/10 px-5 py-2.5 text-xs font-semibold text-noir-gray transition hover:border-white/25 hover:text-noir-white"
              onClick={rejectOptional}
              type="button"
            >
              {t("cookie.reject")}
            </button>
            <button
              className="rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-background-primary transition hover:bg-gold-light"
              onClick={acceptAll}
              type="button"
            >
              {t("cookie.acceptAll")}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function CookieChoice({
  checked,
  description,
  disabled,
  label,
  onChange,
  status,
}: {
  checked: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
  status?: string;
}) {
  return (
    <label className="rounded-xl border border-white/10 bg-black/20 p-4">
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gold-light">{label}</span>
        {disabled ? (
          <span className="text-[0.58rem] tracking-wide text-gold uppercase">
            {status}
          </span>
        ) : (
          <input
            checked={checked}
            className="size-4 accent-[#c6a15b]"
            onChange={(event) => onChange?.(event.target.checked)}
            type="checkbox"
          />
        )}
      </span>
      <span className="mt-2 block text-xs leading-5 text-noir-gray">
        {description}
      </span>
    </label>
  );
}
