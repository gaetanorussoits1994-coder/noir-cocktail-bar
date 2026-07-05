import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { AboutStory } from "@/components/sections/about-story";

export const metadata: Metadata = {
  title: "La nostra storia | Noir Cocktail Bar",
  description:
    "La storia, la ricerca e la cultura della miscelazione di Noir Cocktail Bar.",
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-background-primary pt-20">
        <AboutStory />
      </main>
      <Footer />
    </>
  );
}
