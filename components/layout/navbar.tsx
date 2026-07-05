"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PremiumButton } from "@/components/ui/premium-button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useReservationModal } from "@/components/providers/reservation-modal-provider";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "nav.home" as const, href: "/#home" },
  { label: "nav.menu" as const, href: "/menu" },
  { label: "nav.experience" as const, href: "/#experience" },
  { label: "nav.events" as const, href: "/#events" },
  { label: "nav.gallery" as const, href: "/#gallery" },
  { label: "nav.story" as const, href: "/about" },
  { label: "nav.contact" as const, href: "/#contact" },
];

export function Navbar() {
  const { openReservation } = useReservationModal();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full max-w-full overflow-x-hidden border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          isScrolled
            ? "border-border bg-background-primary/90 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label={t("a11y.mainNavigation")}
          className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <Link
            className="font-display text-3xl font-semibold tracking-[0.08em] text-gold-light"
            href="/#home"
          >
            Noir
          </Link>

          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navigation.map((item) => (
              <Link
                className="text-xs font-medium tracking-[0.12em] text-noir-gray uppercase transition-colors duration-300 hover:text-gold-light"
                href={item.href}
                key={item.href}
              >
                {t(item.label)}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <PremiumButton
              className="rounded-card border border-gold bg-gold px-4 py-2.5 text-xs font-semibold tracking-[0.08em] text-background-primary uppercase shadow-gold transition-colors duration-300 hover:bg-gold-light xl:px-5"
              href="/#booking"
              onClick={(event) => {
                event.preventDefault();
                openReservation();
              }}
            >
              {t("nav.booking")}
            </PremiumButton>
          </div>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={t("a11y.openMenu")}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-noir-white lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            type="button"
          >
            <MenuIcon aria-hidden="true" size={21} strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label={t("a11y.closeMenu")}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={closeMenu}
              type="button"
            />

            <motion.aside
              animate={{ x: 0 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,380px)] max-w-full flex-col overflow-x-hidden border-l border-border bg-background-secondary px-5 py-6 shadow-soft sm:px-7 lg:hidden"
              exit={{ x: "100%" }}
              id="mobile-navigation"
              initial={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <Link
                  className="font-display text-3xl font-semibold tracking-[0.08em] text-gold-light"
                  href="/#home"
                  onClick={closeMenu}
                >
                  Noir
                </Link>
                <div className="flex items-center gap-3">
                  <LanguageSwitcher />
                  <button
                    aria-label={t("a11y.closeMenu")}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-noir-white"
                    onClick={closeMenu}
                    type="button"
                  >
                    <X aria-hidden="true" size={21} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="mt-16 flex flex-col">
                {navigation.map((item) => (
                  <Link
                    className="border-b border-border py-5 font-display text-3xl text-noir-white"
                    href={item.href}
                    key={item.href}
                    onClick={closeMenu}
                  >
                    {t(item.label)}
                  </Link>
                ))}
              </div>

              <PremiumButton
                className="mt-auto rounded-card border border-gold bg-gold px-6 py-4 text-center text-sm font-semibold tracking-[0.08em] text-background-primary uppercase shadow-gold"
                href="/#booking"
                onClick={(event) => {
                  event.preventDefault();
                  closeMenu();
                  openReservation();
                }}
              >
                {t("nav.booking")}
              </PremiumButton>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
