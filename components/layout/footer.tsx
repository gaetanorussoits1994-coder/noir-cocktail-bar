"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { footerLinks } from "@/lib/data/static-content";
import { useCookieConsent } from "@/lib/cookies/use-cookie-consent";
import { useTranslation } from "@/lib/i18n/use-translation";

const quickLinkKeys = {
  "/#home": "nav.home",
  "/#experience": "nav.experience",
  "/#gallery": "nav.gallery",
  "/#events": "nav.events",
  "/#contact": "nav.contact",
} as const;

const legalLinkKeys = {
  "/privacy-policy": "footer.privacy",
  "/cookie-policy": "footer.cookies",
  "/terms": "footer.terms",
} as const;

export function Footer() {
  const { t } = useTranslation();
  const { openPreferences } = useCookieConsent();

  return (
    <motion.footer
      className="w-full max-w-full overflow-hidden border-t border-border bg-background-secondary px-4 pt-20 pb-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.1, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_0.8fr]">
          <div>
            <Link
              className="font-display text-4xl font-semibold tracking-[0.08em] text-gold-light"
              href="/#home"
            >
              Noir
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-noir-gray">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              {t("footer.quickLinks")}
            </h2>
            <nav
              aria-label={t("a11y.footerNavigation")}
              className="mt-5 grid gap-3"
            >
              {footerLinks.quick.map((link) => (
                <Link
                  className="text-sm text-noir-gray transition-colors duration-300 hover:text-gold-light"
                  href={link.href}
                  key={link.href}
                >
                  {t(
                    quickLinkKeys[
                      link.href as keyof typeof quickLinkKeys
                    ],
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              {t("footer.follow")}
            </h2>
            <div className="mt-5 grid gap-3">
              {footerLinks.social.map((link) => (
                <a
                  className="text-sm text-noir-gray transition-colors duration-300 hover:text-gold-light"
                  href={link.href}
                  key={link.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-border pt-7 text-xs text-noir-gray sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.rights")}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.legal.map((link) => (
              <a
                className="transition-colors duration-300 hover:text-gold-light"
                href={link.href}
                key={link.href}
              >
                {t(legalLinkKeys[link.href as keyof typeof legalLinkKeys])}
              </a>
            ))}
            <button
              aria-controls="cookie-preferences"
              className="transition-colors duration-300 hover:text-gold-light"
              onClick={openPreferences}
              type="button"
            >
              {t("footer.cookieSettings")}
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
