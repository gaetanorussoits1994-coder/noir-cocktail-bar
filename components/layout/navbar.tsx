"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PremiumButton } from "@/components/ui/premium-button";
import { useReservationModal } from "@/components/providers/reservation-modal-provider";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Menu", href: "/menu" },
  { label: "Experience", href: "/#experience" },
  { label: "Eventi", href: "/#events" },
  { label: "Gallery", href: "/#gallery" },
  { label: "La nostra storia", href: "/about" },
  { label: "Contatti", href: "/#contact" },
];

export function Navbar() {
  const { openReservation } = useReservationModal();
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
          aria-label="Navigazione principale"
          className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <Link
            className="font-display text-3xl font-semibold tracking-[0.08em] text-gold-light"
            href="/#home"
          >
            Noir
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                className="text-xs font-medium tracking-[0.12em] text-noir-gray uppercase transition-colors duration-300 hover:text-gold-light"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <PremiumButton
            className="hidden rounded-card border border-gold bg-gold px-5 py-2.5 text-xs font-semibold tracking-[0.08em] text-background-primary uppercase shadow-gold transition-colors duration-300 hover:bg-gold-light lg:inline-flex"
            href="/#booking"
            onClick={(event) => {
              event.preventDefault();
              openReservation();
            }}
          >
            Prenota un Tavolo
          </PremiumButton>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label="Apri il menu"
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
              aria-label="Chiudi il menu"
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
                <button
                  aria-label="Chiudi il menu"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-noir-white"
                  onClick={closeMenu}
                  type="button"
                >
                  <X aria-hidden="true" size={21} strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-16 flex flex-col">
                {navigation.map((item) => (
                  <Link
                    className="border-b border-border py-5 font-display text-3xl text-noir-white"
                    href={item.href}
                    key={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
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
                Prenota un Tavolo
              </PremiumButton>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
