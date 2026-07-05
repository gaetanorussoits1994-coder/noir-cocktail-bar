import type { Metadata } from "next";

import {
  LegalPage,
  type LegalDocument,
} from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Informativa cookie di Noir Cocktail Bar.",
  alternates: { canonical: "/cookie-policy" },
};

const document: LegalDocument = {
  it: {
    title: "Cookie Policy",
    intro:
      "Questa informativa descrive in modo trasparente i cookie e le tecnologie analoghe utilizzati dal sito Noir Cocktail Bar.",
    sections: [
      {
        title: "Cosa sono i cookie",
        paragraphs: [
          "I cookie sono piccoli file salvati dal browser che permettono al sito di funzionare, ricordare preferenze e, previo consenso, raccogliere statistiche o supportare attività promozionali.",
        ],
      },
      {
        title: "Cookie tecnici",
        paragraphs: [
          "Sono indispensabili per sicurezza, navigazione, gestione del consenso e funzionamento dei moduli. Non richiedono consenso e restano sempre attivi.",
        ],
      },
      {
        title: "Preferenze",
        paragraphs: [
          "Memorizzano scelte come la lingua IT/EN e le impostazioni cookie. La lingua viene conservata nel localStorage del dispositivo finché non viene rimossa.",
        ],
      },
      {
        title: "Analytics",
        paragraphs: [
          "Se autorizzati, strumenti come Google Analytics possono raccogliere dati aggregati su visite, pagine consultate e interazioni. Il consenso viene comunicato tramite Google Consent Mode.",
        ],
      },
      {
        title: "Marketing",
        paragraphs: [
          "Sono disattivati per impostazione predefinita. Possono essere utilizzati esclusivamente dopo consenso per misurazione pubblicitaria o contenuti promozionali pertinenti.",
        ],
      },
      {
        title: "Durata e gestione",
        paragraphs: [
          "La durata varia in base alla finalità. Le preferenze locali restano fino alla cancellazione; eventuali cookie di terze parti seguono le durate indicate dai rispettivi fornitori.",
          "Puoi eliminare cookie e localStorage dalle impostazioni del browser. Dopo la cancellazione, il banner verrà mostrato nuovamente.",
        ],
      },
      {
        title: "Modificare il consenso",
        paragraphs: [
          "Puoi rivedere la scelta eliminando la voce “noir-cookie-consent” dal localStorage o cancellando i dati del sito dal browser.",
        ],
      },
      {
        title: "Contatti",
        paragraphs: [
          "Per domande sull'uso dei cookie puoi contattare Noir Cocktail Bar tramite i recapiti pubblicati nella sezione Contatti del sito.",
        ],
      },
    ],
  },
  en: {
    title: "Cookie Policy",
    intro:
      "This notice clearly describes the cookies and similar technologies used by the Noir Cocktail Bar website.",
    sections: [
      {
        title: "What cookies are",
        paragraphs: [
          "Cookies are small files stored by your browser. They enable website functions, remember preferences and, with consent, collect statistics or support promotional activities.",
        ],
      },
      {
        title: "Essential cookies",
        paragraphs: [
          "These are required for security, navigation, consent management and form operation. They do not require consent and are always active.",
        ],
      },
      {
        title: "Preferences",
        paragraphs: [
          "They remember choices such as the IT/EN language and cookie settings. Language is stored in the device localStorage until removed.",
        ],
      },
      {
        title: "Analytics",
        paragraphs: [
          "When authorised, tools such as Google Analytics may collect aggregated data about visits, pages and interactions. Consent is communicated through Google Consent Mode.",
        ],
      },
      {
        title: "Marketing",
        paragraphs: [
          "These cookies are disabled by default and may only be used after consent for advertising measurement or relevant promotional content.",
        ],
      },
      {
        title: "Duration and management",
        paragraphs: [
          "Duration depends on purpose. Local preferences remain until deleted; third-party cookies follow the retention periods set by their providers.",
          "You can delete cookies and localStorage from your browser settings. The banner will appear again after deletion.",
        ],
      },
      {
        title: "Changing consent",
        paragraphs: [
          "You can review your choice by deleting “noir-cookie-consent” from localStorage or clearing this website's browser data.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "For questions about cookies, contact Noir Cocktail Bar using the details published in the website Contact section.",
        ],
      },
    ],
  },
};

export default function CookiePolicyPage() {
  return <LegalPage document={document} />;
}
