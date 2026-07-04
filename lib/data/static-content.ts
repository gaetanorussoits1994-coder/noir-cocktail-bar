export type Event = {
  title: string;
  schedule: string;
  description: string;
  number: string;
};

export type Artist = {
  image: string;
  name: string;
  role: string;
  specialty: string;
  quote: string;
  instagramHandle: string;
  instagramHref: string;
};

export type Testimonial = {
  name: string;
  text: string;
  rating: number;
};

export type Award = {
  title: string;
  number: string;
};

export type ContactDetail = {
  icon: "address" | "phone" | "email" | "hours";
  label: string;
  href?: string;
};

export type ContentLink = {
  label: string;
  href: string;
};

export type PublicMenuItem = {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  price: number | null;
  imageUrl: string | null;
  tags: string[];
  isFeatured: boolean;
  sortOrder: number;
};

export type PublicMenuCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  items: PublicMenuItem[];
};

export const fallbackMenu = [
  {
    id: "fallback-signature",
    name: "Cocktail Signature",
    slug: "cocktail-signature",
    description: "Le creazioni originali firmate Noir.",
    sortOrder: 1,
    items: [
      {
        id: "fallback-noir-negroni",
        name: "Noir Negroni",
        description:
          "Un classico intenso reinterpretato con note agrumate e una profondità vellutata.",
        ingredients: "",
        price: 18,
        imageUrl: "/images/noir-negroni.png",
        tags: ["Signature"],
        isFeatured: true,
        sortOrder: 1,
      },
      {
        id: "fallback-golden-smoke",
        name: "Golden Smoke",
        description:
          "Bourbon, sfumature affumicate e accenti aromatici in un equilibrio caldo e avvolgente.",
        ingredients: "",
        price: 20,
        imageUrl: "/images/golden-smoke.png",
        tags: ["Signature"],
        isFeatured: true,
        sortOrder: 2,
      },
      {
        id: "fallback-velvet-night",
        name: "Velvet Night",
        description:
          "Frutti scuri e delicate note floreali per un cocktail morbido, elegante e notturno.",
        ingredients: "",
        price: 17,
        imageUrl: "/images/velvet-night.png",
        tags: ["Signature"],
        isFeatured: true,
        sortOrder: 3,
      },
    ],
  },
  {
    id: "fallback-premium",
    name: "Alcolici Premium",
    slug: "alcolici-premium",
    description: "Una selezione di distillati ed etichette premium.",
    sortOrder: 2,
    items: [
      {
        id: "fallback-premium-selection",
        name: "Selezione Premium",
        description: "Etichette selezionate, servite lisce o con ghiaccio.",
        ingredients: "",
        price: null,
        imageUrl: null,
        tags: [],
        isFeatured: false,
        sortOrder: 1,
      },
    ],
  },
  {
    id: "fallback-aperitivi",
    name: "Aperitivi Noir",
    slug: "aperitivi-noir",
    description: "Aperitivi pensati per iniziare la serata.",
    sortOrder: 3,
    items: [
      {
        id: "fallback-aperitivo",
        name: "Aperitivo Noir",
        description: "La proposta della casa, accompagnata da piccoli assaggi.",
        ingredients: "",
        price: null,
        imageUrl: null,
        tags: [],
        isFeatured: false,
        sortOrder: 1,
      },
    ],
  },
  {
    id: "fallback-shots",
    name: "Cicchetti / Shottini",
    slug: "cicchetti-shottini",
    description: "Shot e piccoli assaggi dal carattere deciso.",
    sortOrder: 4,
    items: [
      {
        id: "fallback-shot-selection",
        name: "Selezione Noir",
        description: "Una scelta di cicchetti classici e creazioni della casa.",
        ingredients: "",
        price: null,
        imageUrl: null,
        tags: [],
        isFeatured: false,
        sortOrder: 1,
      },
    ],
  },
] satisfies PublicMenuCategory[];

export const events = [
  {
    title: "Jazz Night",
    schedule: "Ogni venerdì",
    description: "Live jazz, cocktail signature e atmosfera elegante.",
    number: "01",
  },
  {
    title: "Guest Bartender",
    schedule: "Una volta al mese",
    description: "Bartender ospiti e drink list speciali.",
    number: "02",
  },
  {
    title: "Private Lounge",
    schedule: "Su prenotazione",
    description:
      "Esperienze private per piccoli gruppi ed eventi aziendali.",
    number: "03",
  },
] satisfies Event[];

export const artists = [
  {
    image: "/images/artist-alessandro-ricci.png",
    name: "Alessandro Ricci",
    role: "Head Mixologist",
    specialty: "Botanical cocktails",
    quote: "Every cocktail tells a story.",
    instagramHandle: "@alessandro.noir",
    instagramHref: "https://www.instagram.com/",
  },
  {
    image: "/images/artist-sofia-martini.png",
    name: "Sofia Martini",
    role: "Bar Manager",
    specialty: "Classic revisited",
    quote: "Elegance is found in the smallest details.",
    instagramHandle: "@sofia.noir",
    instagramHref: "https://www.instagram.com/",
  },
  {
    image: "/images/artist-lorenzo-de-santis.png",
    name: "Lorenzo De Santis",
    role: "Creative Bartender",
    specialty: "Smoky signatures",
    quote: "Balance is the soul of every drink.",
    instagramHandle: "@lorenzo.noir",
    instagramHref: "https://www.instagram.com/",
  },
] satisfies Artist[];

export const testimonials = [
  {
    name: "Marco Bellini",
    text: "Un’esperienza raffinata, cocktail impeccabili e atmosfera incredibile.",
    rating: 5,
  },
  {
    name: "Giulia Ferri",
    text: "Noir è uno di quei luoghi che ricordi per dettagli, servizio e qualità.",
    rating: 5,
  },
  {
    name: "Davide Romano",
    text: "Eleganza, musica e drink list curata in modo eccellente.",
    rating: 5,
  },
] satisfies Testimonial[];

export const awards = [
  { title: "Best Cocktail Experience 2024", number: "01" },
  { title: "Luxury Mixology Selection 2025", number: "02" },
  { title: "Top Lounge Concept", number: "03" },
] satisfies Award[];

export const contactInfo = {
  details: [
    { icon: "address", label: "Via Roma 24, Milano" },
    {
      icon: "phone",
      label: "+39 333 123 4567",
      href: "tel:+393331234567",
    },
    {
      icon: "email",
      label: "info@noircocktailbar.it",
      href: "mailto:info@noircocktailbar.it",
    },
    {
      icon: "hours",
      label: "Martedì - Domenica, 18:00 - 02:00",
    },
  ] satisfies ContactDetail[],
  bookingHref: "#reservation-form",
  whatsappHref: "https://wa.me/393331234567",
  location: {
    street: "Via Roma 24",
    city: "Milano",
  },
};

export const footerLinks = {
  quick: [
    { label: "Home", href: "/#home" },
    { label: "Experience", href: "/#experience" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Eventi", href: "/#events" },
    { label: "Contatti", href: "/#contact" },
  ] satisfies ContentLink[],
  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
  ] satisfies ContentLink[],
  legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Cookie Policy", href: "#cookie" },
  ] satisfies ContentLink[],
};
