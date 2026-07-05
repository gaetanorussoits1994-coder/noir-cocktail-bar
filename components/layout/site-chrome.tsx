"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";
import { CookieBanner } from "@/components/legal/cookie-banner";
import { CookieConsentProvider } from "@/components/providers/cookie-consent-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { ReservationModalProvider } from "@/components/providers/reservation-modal-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ScrollProgress } from "@/components/ui/scroll-progress";

type SiteChromeProps = {
  children: ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  return (
    <LanguageProvider>
      {pathname.startsWith("/admin") ? (
        children
      ) : (
        <CookieConsentProvider>
          <SmoothScrollProvider>
            <ReservationModalProvider>
              <ScrollProgress />
              <Navbar />
              {children}
              <CookieBanner />
            </ReservationModalProvider>
          </SmoothScrollProvider>
        </CookieConsentProvider>
      )}
    </LanguageProvider>
  );
}
