import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Menu } from "@/components/sections/menu";

export const metadata: Metadata = {
  title: "Menu | Noir Cocktail Bar",
  description:
    "Scopri il menu completo di cocktail signature e proposte Noir.",
};

export default function PublicMenuPage() {
  return (
    <>
      <main className="w-full max-w-full overflow-hidden">
        <Menu featuredOnly={false} standalone />
      </main>
      <Footer />
    </>
  );
}
