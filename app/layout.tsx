import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ScrollProgress } from "@/components/ui/scroll-progress";

import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Noir Cocktail Bar",
  description: "Premium Cocktail Experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${inter.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <SmoothScrollProvider>
          <ScrollProgress />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
