"use client";

import { motion } from "framer-motion";

import { footerLinks } from "@/lib/data/static-content";

export function Footer() {
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
            <a
              className="font-display text-4xl font-semibold tracking-[0.08em] text-gold-light"
              href="#home"
            >
              Noir
            </a>
            <p className="mt-5 max-w-md text-sm leading-7 text-noir-gray">
              Cocktail d’autore, atmosfera ricercata e dettagli pensati per
              trasformare ogni notte in un’esperienza da ricordare.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              Link rapidi
            </h2>
            <nav aria-label="Navigazione footer" className="mt-5 grid gap-3">
              {footerLinks.quick.map((link) => (
                <a
                  className="text-sm text-noir-gray transition-colors duration-300 hover:text-gold-light"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              Follow Noir
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
          <p>© 2026 Noir Cocktail Bar. Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <a
                className="transition-colors duration-300 hover:text-gold-light"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
