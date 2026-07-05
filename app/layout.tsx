import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { SiteChrome } from "@/components/layout/site-chrome";
import { siteUrl } from "@/lib/site";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Noir Cocktail Bar | Premium Cocktail Experience",
    template: "%s | Noir Cocktail Bar",
  },
  description:
    "Cocktail d'autore, atmosfera elegante ed esperienze Noir. Scopri il menu e prenota il tuo tavolo.",
  keywords: [
    "cocktail bar",
    "mixology",
    "cocktail signature",
    "aperitivo",
    "Noir Cocktail Bar",
  ],
  applicationName: "Noir Cocktail Bar",
  authors: [{ name: "Noir Cocktail Bar" }],
  creator: "Noir Cocktail Bar",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: ["en_GB"],
    url: "/",
    siteName: "Noir Cocktail Bar",
    title: "Noir Cocktail Bar | Premium Cocktail Experience",
    description:
      "Cocktail d'autore, atmosfera elegante ed esperienze pensate per rendere ogni notte memorabile.",
    images: [
      {
        url: "/images/gallery-interior.png",
        width: 1200,
        height: 630,
        alt: "Gli interni eleganti di Noir Cocktail Bar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noir Cocktail Bar | Premium Cocktail Experience",
    description:
      "Signature cocktails, elegant atmosphere and memorable Noir experiences.",
    images: ["/images/gallery-interior.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
