import type { Metadata } from "next";

import {
  LegalPage,
  type LegalDocument,
} from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa privacy di Noir Cocktail Bar.",
  alternates: { canonical: "/privacy-policy" },
};

const document: LegalDocument = {
  it: {
    title: "Privacy Policy",
    intro:
      "Noir Cocktail Bar tratta i dati personali secondo i principi di liceità, correttezza, trasparenza e minimizzazione previsti dal GDPR.",
    sections: [
      {
        title: "Titolare e dati trattati",
        paragraphs: [
          "Il titolare è Noir Cocktail Bar. Possiamo trattare nome, telefono, email, dettagli della prenotazione, note inviate volontariamente e dati tecnici necessari al funzionamento del sito.",
        ],
      },
      {
        title: "Prenotazioni e contatti",
        paragraphs: [
          "I dati del form vengono usati per gestire la richiesta, verificare disponibilità e comunicare conferma o rifiuto. Le note non devono contenere informazioni non necessarie.",
          "I contatti via email o WhatsApp sono trattati per rispondere alle richieste e fornire il servizio richiesto.",
        ],
      },
      {
        title: "Base giuridica e conservazione",
        paragraphs: [
          "Il trattamento è necessario per misure precontrattuali richieste dall'interessato, esecuzione del servizio, obblighi legali e legittimo interesse alla sicurezza.",
          "I dati sono conservati per il tempo necessario alla gestione della richiesta e agli obblighi amministrativi, poi eliminati o anonimizzati.",
        ],
      },
      {
        title: "Fornitori e trasferimenti",
        paragraphs: [
          "Il database e l'autenticazione sono forniti da Supabase; hosting e distribuzione del sito da Vercel. Questi fornitori operano secondo i propri accordi sul trattamento e misure di sicurezza.",
          "Eventuali trasferimenti fuori dallo Spazio Economico Europeo avvengono mediante garanzie riconosciute dal GDPR.",
        ],
      },
      {
        title: "WhatsApp ed email",
        paragraphs: [
          "Quando l'admin usa il link WhatsApp dopo una decisione sulla prenotazione, il trattamento prosegue sulla piattaforma WhatsApp/Meta. Le comunicazioni email dipendono dal provider utilizzato dall'utente e dal locale.",
        ],
      },
      {
        title: "Sicurezza",
        paragraphs: [
          "Adottiamo controlli di accesso, policy database e misure organizzative proporzionate. Nessun sistema online può tuttavia garantire sicurezza assoluta.",
        ],
      },
      {
        title: "Diritti GDPR",
        paragraphs: [
          "Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, oltre a revocare il consenso quando applicabile. Puoi inoltre presentare reclamo al Garante per la protezione dei dati personali.",
        ],
      },
      {
        title: "Contatti",
        paragraphs: [
          "Per esercitare i diritti o ricevere chiarimenti, usa i recapiti pubblicati nella sezione Contatti indicando nell'oggetto “Privacy”.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro:
      "Noir Cocktail Bar processes personal data in accordance with the GDPR principles of lawfulness, fairness, transparency and data minimisation.",
    sections: [
      {
        title: "Controller and processed data",
        paragraphs: [
          "The controller is Noir Cocktail Bar. We may process your name, phone, email, booking details, voluntarily submitted notes and technical data required for website operation.",
        ],
      },
      {
        title: "Bookings and contact forms",
        paragraphs: [
          "Form data is used to manage your request, check availability and communicate confirmation or rejection. Notes should not include unnecessary information.",
          "Email and WhatsApp contacts are processed to answer enquiries and provide the requested service.",
        ],
      },
      {
        title: "Legal basis and retention",
        paragraphs: [
          "Processing is necessary for pre-contractual measures requested by you, service delivery, legal obligations and our legitimate security interest.",
          "Data is kept only as long as needed to manage the request and meet administrative obligations, then deleted or anonymised.",
        ],
      },
      {
        title: "Providers and transfers",
        paragraphs: [
          "Database and authentication services are provided by Supabase; hosting and distribution by Vercel. These providers operate under their own data processing terms and security measures.",
          "Transfers outside the European Economic Area, if any, use safeguards recognised by the GDPR.",
        ],
      },
      {
        title: "WhatsApp and email",
        paragraphs: [
          "When an administrator uses WhatsApp after a booking decision, processing continues on the WhatsApp/Meta platform. Email communications also involve the providers used by you and the venue.",
        ],
      },
      {
        title: "Security",
        paragraphs: [
          "We use access controls, database policies and proportionate organisational safeguards. No online system can guarantee absolute security.",
        ],
      },
      {
        title: "Your GDPR rights",
        paragraphs: [
          "You may request access, correction, deletion, restriction, portability and object to processing, and withdraw consent where applicable. You may also lodge a complaint with your competent data protection authority.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "To exercise your rights or ask a question, use the details in the Contact section and include “Privacy” in the subject.",
        ],
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  return <LegalPage document={document} />;
}
