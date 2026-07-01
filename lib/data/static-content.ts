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
  bookingHref: "#prenotazioni",
  whatsappHref: "https://wa.me/393331234567",
  location: {
    street: "Via Roma 24",
    city: "Milano",
  },
};

export const footerLinks = {
  quick: [
    { label: "Home", href: "#home" },
    { label: "Experience", href: "#experience" },
    { label: "Gallery", href: "#gallery" },
    { label: "Eventi", href: "#eventi" },
    { label: "Contatti", href: "#contatti" },
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
