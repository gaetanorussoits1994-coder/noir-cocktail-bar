import type { Metadata } from "next";

import {
  LegalPage,
  type LegalDocument,
} from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Termini di utilizzo",
  description: "Termini di utilizzo del sito Noir Cocktail Bar.",
  alternates: { canonical: "/terms" },
};

const document: LegalDocument = {
  it: {
    title: "Termini di utilizzo",
    intro:
      "Questi termini regolano l'accesso al sito, al menu digitale e al servizio di richiesta prenotazione.",
    sections: [
      {
        title: "Contenuti del sito",
        paragraphs: [
          "Testi, marchi, fotografie e grafica appartengono ai rispettivi titolari e non possono essere riutilizzati senza autorizzazione.",
        ],
      },
      {
        title: "Menu e disponibilità",
        paragraphs: [
          "Prezzi, ingredienti e disponibilità possono cambiare. In caso di allergie o intolleranze è necessario confrontarsi direttamente con lo staff prima dell'ordine.",
        ],
      },
      {
        title: "Prenotazioni",
        paragraphs: [
          "L'invio del form è una richiesta e non costituisce conferma. La prenotazione è valida soltanto dopo comunicazione dello staff.",
        ],
      },
      {
        title: "Uso corretto",
        paragraphs: [
          "È vietato interferire con il sito, tentare accessi non autorizzati o inviare contenuti illeciti, offensivi o automatizzati.",
        ],
      },
      {
        title: "Responsabilità e contatti",
        paragraphs: [
          "Facciamo il possibile per mantenere le informazioni accurate e il servizio disponibile, senza garantire assenza assoluta di interruzioni. Per chiarimenti usa la sezione Contatti.",
        ],
      },
    ],
  },
  en: {
    title: "Terms of Use",
    intro:
      "These terms govern access to the website, digital menu and booking request service.",
    sections: [
      {
        title: "Website content",
        paragraphs: [
          "Texts, trademarks, photographs and graphics belong to their respective owners and may not be reused without permission.",
        ],
      },
      {
        title: "Menu and availability",
        paragraphs: [
          "Prices, ingredients and availability may change. Guests with allergies or intolerances must speak directly with staff before ordering.",
        ],
      },
      {
        title: "Bookings",
        paragraphs: [
          "Submitting the form is a request, not a confirmation. A booking is valid only after staff confirmation.",
        ],
      },
      {
        title: "Acceptable use",
        paragraphs: [
          "You must not interfere with the website, attempt unauthorised access or submit unlawful, offensive or automated content.",
        ],
      },
      {
        title: "Liability and contact",
        paragraphs: [
          "We work to keep information accurate and the service available, but cannot guarantee uninterrupted operation. Use the Contact section for enquiries.",
        ],
      },
    ],
  },
};

export default function TermsPage() {
  return <LegalPage document={document} />;
}
