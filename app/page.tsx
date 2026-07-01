import { Footer } from "@/components/layout/footer";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Events } from "@/components/sections/events";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { MeetTheArtists } from "@/components/sections/meet-the-artists";
import { Menu } from "@/components/sections/menu";
import { OurStory } from "@/components/sections/our-story";
import { SignaturePhilosophy } from "@/components/sections/signature-philosophy";
import { TestimonialsAwards } from "@/components/sections/testimonials-awards";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Experience />
        <Menu />
        <Gallery />
        <Events />
        <OurStory />
        <MeetTheArtists />
        <SignaturePhilosophy />
        <TestimonialsAwards />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
