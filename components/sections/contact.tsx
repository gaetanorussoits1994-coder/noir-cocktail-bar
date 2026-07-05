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
import { useReservationModal } from "@/components/providers/reservation-modal-provider";
import { contactInfo } from "@/lib/data/static-content";
import { useTranslation } from "@/lib/i18n/use-translation";
import { ReservationForm } from "./reservation-form";

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
  const { openReservation } = useReservationModal();
  const { t } = useTranslation();
  return (
    <section
      className="relative w-full max-w-full overflow-hidden bg-background-primary px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      id="contact"
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
              description={t("contact.description")}
              label={t("contact.label")}
              title={t("contact.title")}
            />
          </motion.div>

          <motion.div className="mt-10 grid gap-5" variants={staggerVariants}>
            {contactInfo.details.map(({ icon, label, href }) => {
              const Icon = contactIcons[icon];
              const localizedLabel =
                icon === "hours" ? t("contact.hours") : label;
              const content = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 text-gold">
                    <Icon aria-hidden="true" size={17} strokeWidth={1.5} />
                  </span>
                  <span className="text-sm text-noir-gray">
                    {localizedLabel}
                  </span>
                </>
              );

              return (
                <motion.div
                  className="flex items-center gap-4"
                  key={localizedLabel}
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
            <PremiumButton
              href={contactInfo.bookingHref}
              onClick={(event) => {
                event.preventDefault();
                openReservation();
              }}
            >
              {t("nav.booking")}
            </PremiumButton>
            <PremiumButton
              className="gap-2"
              href={contactInfo.whatsappHref}
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              <MessageCircle aria-hidden="true" size={17} strokeWidth={1.5} />
              {t("cta.whatsapp")}
            </PremiumButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="scroll-mt-28"
          id="booking"
          initial={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.2, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <ReservationForm />
        </motion.div>
      </div>
    </section>
  );
}
