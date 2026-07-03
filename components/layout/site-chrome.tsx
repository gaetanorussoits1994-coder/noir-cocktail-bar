"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";
import { ReservationModalProvider } from "@/components/providers/reservation-modal-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ScrollProgress } from "@/components/ui/scroll-progress";

type SiteChromeProps = {
  children: ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <SmoothScrollProvider>
      <ReservationModalProvider>
        <ScrollProgress />
        <Navbar />
        {children}
      </ReservationModalProvider>
    </SmoothScrollProvider>
  );
}
