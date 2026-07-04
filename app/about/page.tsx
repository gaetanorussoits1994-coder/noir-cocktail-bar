import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "La nostra storia | Noir Cocktail Bar",
  description:
    "La storia, la ricerca e la cultura della miscelazione di Noir Cocktail Bar.",
};

const story = [
  "Noir nasce dall'idea di trasformare il classico cocktail bar in un luogo dove eleganza, ricerca e convivialità convivono in perfetto equilibrio.",
  "Ogni ingrediente viene selezionato con attenzione, ogni drink racconta una storia e ogni dettaglio dell'ambiente è pensato per offrire un'esperienza raffinata ma autentica.",
  "Dal grande classico reinterpretato alle creazioni originali della casa, Noir celebra la cultura della miscelazione internazionale con uno stile contemporaneo e ricercato.",
  "Il nostro obiettivo non è semplicemente servire un cocktail, ma regalare un momento da ricordare.",
];

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-background-primary pt-20">
        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-gold uppercase">
                Our Story
              </p>
              <h1 className="mt-4 font-display text-5xl leading-[0.95] text-gold-light sm:text-7xl">
                L&apos;eleganza di un momento da ricordare
              </h1>
              <div className="mt-8 space-y-5">
                {story.map((paragraph) => (
                  <p
                    className="max-w-2xl text-sm leading-7 text-noir-gray sm:text-base sm:leading-8"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <Link
                className="mt-9 inline-flex items-center rounded-card border border-gold px-6 py-3.5 text-sm font-medium text-gold-light transition hover:bg-gold hover:text-background-primary"
                href="/menu"
              >
                Scopri il menu Noir
              </Link>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-gold/20 shadow-gold">
              <Image
                alt="Il bancone e gli interni eleganti di Noir Cocktail Bar"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 55vw"
                src="/images/gallery-interior.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
              <div className="absolute right-6 bottom-6 left-6 border-t border-gold/35 pt-4">
                <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                  Noir Cocktail Bar
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
