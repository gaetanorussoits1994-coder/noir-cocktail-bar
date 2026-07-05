"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { ReservationForm } from "@/components/sections/reservation-form";
import { useTranslation } from "@/lib/i18n/use-translation";

type ReservationModalContextValue = {
  openReservation: () => void;
};

const ReservationModalContext =
  createContext<ReservationModalContextValue | null>(null);

export function useReservationModal() {
  const context = useContext(ReservationModalContext);

  if (!context) {
    throw new Error(
      "useReservationModal deve essere usato dentro ReservationModalProvider.",
    );
  }

  return context;
}

type ReservationModalProviderProps = {
  children: ReactNode;
};

export function ReservationModalProvider({
  children,
}: ReservationModalProviderProps) {
  const { t } = useTranslation();
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  useEffect(() => {
    if (!isReservationOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsReservationOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isReservationOpen]);

  function closeReservation() {
    setIsReservationOpen(false);
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) closeReservation();
  }

  return (
    <ReservationModalContext.Provider
      value={{ openReservation: () => setIsReservationOpen(true) }}
    >
      {children}

      <AnimatePresence>
        {isReservationOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-labelledby="reservation-modal-title"
            aria-modal="true"
            className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-4 backdrop-blur-md sm:p-8"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onMouseDown={handleBackdropClick}
            role="dialog"
          >
            <div className="flex min-h-full items-start justify-center py-4 sm:items-center">
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl"
                exit={{ opacity: 0, scale: 0.97, y: 16 }}
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="sr-only" id="reservation-modal-title">
                  {t("nav.booking")}
                </h2>
                <button
                  aria-label={t("a11y.closeBooking")}
                  className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/10 bg-background-primary/90 text-noir-white transition hover:border-gold/50 hover:text-gold"
                  onClick={closeReservation}
                  type="button"
                >
                  <X aria-hidden="true" size={19} />
                </button>
                <ReservationForm id="reservation-modal-form" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReservationModalContext.Provider>
  );
}
