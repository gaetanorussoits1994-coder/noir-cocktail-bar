"use client";

import { motion, type Variants } from "framer-motion";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { PremiumButton } from "@/components/ui/premium-button";
import { SectionTitle } from "@/components/ui/section-title";
import { contactInfo } from "@/lib/data/static-content";

const contactIcons = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  hours: Clock,
};

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Contact() {
  return (
    <section
      className="relative w-full max-w-full overflow-hidden bg-background-primary px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      id="contatti"
    >
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 size-72 max-w-full rounded-full bg-gold/5 blur-3xl sm:size-96"
      />

      <div
        className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"
        id="prenotazioni"
      >
        <motion.div
          initial="hidden"
          variants={staggerVariants}
          viewport={{ amount: 0.2, once: true }}
          whileInView="visible"
        >
          <motion.div variants={itemVariants}>
            <SectionTitle
              align="left"
              description="Prenota il tuo tavolo o contattaci per eventi privati, serate esclusive e richieste speciali."
              label="Contact Experience"
              title="Reserve Your Night"
            />
          </motion.div>

          <motion.div className="mt-10 grid gap-5" variants={staggerVariants}>
            {contactInfo.details.map(({ icon, label, href }) => {
              const Icon = contactIcons[icon];
              const content = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 text-gold">
                    <Icon aria-hidden="true" size={17} strokeWidth={1.5} />
                  </span>
                  <span className="text-sm text-noir-gray">{label}</span>
                </>
              );

              return (
                <motion.div
                  className="flex items-center gap-4"
                  key={label}
                  variants={itemVariants}
                >
                  {href ? (
                    <a
                      className="flex items-center gap-4 transition-colors duration-300 hover:text-gold-light"
                      href={href}
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <PremiumButton href={contactInfo.bookingHref}>
              Prenota un Tavolo
            </PremiumButton>
            <PremiumButton
              className="gap-2"
              href={contactInfo.whatsappHref}
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              <MessageCircle aria-hidden="true" size={17} strokeWidth={1.5} />
              Scrivici su WhatsApp
            </PremiumButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative min-h-[30rem] overflow-hidden rounded-card border border-gold/20 bg-background-secondary shadow-gold"
          initial={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.2, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.12),transparent_55%)]"
          />
          <div
            aria-hidden="true"
            className="absolute top-[22%] left-0 h-px w-[70%] rotate-12 bg-gold/15"
          />
          <div
            aria-hidden="true"
            className="absolute right-0 bottom-[25%] h-px w-[70%] -rotate-12 bg-gold/15"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <span className="flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold shadow-gold backdrop-blur-sm">
                <MapPin aria-hidden="true" size={25} strokeWidth={1.5} />
              </span>
              <p className="mt-5 font-display text-3xl text-gold-light">
                {contactInfo.location.street}
              </p>
              <p className="mt-1 text-xs font-medium tracking-[0.2em] text-noir-gray uppercase">
                {contactInfo.location.city}
              </p>
            </div>
          </div>

          <div className="absolute right-5 bottom-5 left-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-[0.6rem] font-medium tracking-[0.18em] text-noir-gray uppercase">
              Noir Location
            </span>
            <span className="size-1.5 rounded-full bg-gold" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
