import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { SiteChrome } from "@/components/layout/site-chrome";

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
    <html className="max-w-full overflow-x-hidden" lang="it">
      <body
        className={`${inter.variable} ${cormorantGaramond.variable} w-full max-w-full overflow-x-hidden antialiased`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
