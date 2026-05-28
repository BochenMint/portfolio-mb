export type Project = {
  id: string
  title: string
  domain: string
  url: string
  tagline: string
  description: string
  tags: string[]
  accent: string
  metrics: string[]
}

export type Service = {
  title: string
  subtitle: string
  points: string[]
}

export const site = {
  name: 'Marcin B.',
  role: 'Architekt produktów cyfrowych',
  headline: ['Produkty, które', 'robią wrażenie'],
  subhead:
    'Projektuję i wdrażam strony, systemy i automatyzacje — z integracją AI tam, gdzie realnie oszczędza czas małej firmie. Bez korporacyjnego bełkotu.',
  ctaPrimary: 'Zobacz realizacje',
  ctaSecondary: 'Porozmawiajmy',
  email: 'kontakt@example.com',
  location: 'Polska · zdalnie i on-site',
}

export const services: Service[] = [
  {
    title: 'Web & produkt',
    subtitle: 'Od landing page po pełny system rezerwacji',
    points: [
      'Szybkie, SEO-ready strony (Astro, React)',
      'Design system i spójny UX na każdym urządzeniu',
      'Integracje płatności, PMS, CRM',
    ],
  },
  {
    title: 'Automatyzacja',
    subtitle: 'Mniej ręcznej pracy, więcej marży',
    points: [
      'Workflowy fakturowania i księgowości',
      'Synchronizacja kalendarzy i zamków',
      'Raporty i alerty bez Excela o północy',
    ],
  },
  {
    title: 'AI w biznesie',
    subtitle: 'Asystenci, nie zabawki',
    points: [
      'Concierge i support z wiedzą o Twojej ofercie',
      'Agentic workflows z kontrolą i audytem',
      'Bezpieczne wdrożenia — RODO, koszty, fallback',
    ],
  },
]

export const projects: Project[] = [
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: 'Księgowość i faktury bez tarcia',
    description:
      'Platforma dla małych firm: faktury, eksporty, JPK — przejrzysty interfejs zamiast legacy desktopu. Projekt pod deterministyczne dane i zero „magicznych” błędów w rozliczeniach.',
    tags: ['SaaS', 'Fintech', 'TypeScript'],
    accent: '#3ee8c4',
    metrics: ['Eksport JPK', 'Panel web', 'Integracje księgowe'],
  },
  {
    id: 'mint',
    title: 'Mint Apartments',
    domain: 'mintapartments.pl',
    url: 'https://mintapartments.pl',
    tagline: 'Apartamenty premium w Trójmieście',
    description:
      'Wielojęzyczna strona z rezerwacją, AI concierge i automatyzacją dostępu (Tedee/Nuki). Konkurencja w regionie ma OLX w hero — tu jest poziom globalnych brandów najmu krótkoterminowego.',
    tags: ['Hospitality', 'Previo', 'AI Concierge'],
    accent: '#7ee0ff',
    metrics: ['7 języków', 'Smart lock', 'Direct booking'],
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars',
    url: '#',
    tagline: 'Mobilność pod klucz — flota i wynajem',
    description:
      'Cyfrowa warstwa wokół wynajmu aut: oferta, dostępność, proces rezerwacji i komunikacja z klientem. Skalowalna architektura pod rosnącą flotę.',
    tags: ['Mobility', 'Booking', 'CRM'],
    accent: '#c9a962',
    metrics: ['Flota online', 'Rezerwacje', 'Panel operacyjny'],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'agentic OS',
    url: '#',
    tagline: 'System operacyjny dla agentów AI',
    description:
      'Warstwa orkiestracji zadań, pamięci i narzędzi — żeby automatyzacje w firmie były przewidywalne, audytowalne i pod kontrolą właściciela, nie czarnej skrzynki.',
    tags: ['AI', 'Agents', 'Automation'],
    accent: '#a78bfa',
    metrics: ['Workflow', 'Memory', 'Tooling'],
  },
]

export const process = [
  { step: '01', title: 'Diagnoza', text: 'Cel biznesowy, nie lista funkcji z Pinteresta.' },
  { step: '02', title: 'Szkic & ruch', text: 'Interaktywny prototyp — czujesz produkt przed kodem.' },
  { step: '03', title: 'Build', text: 'Produkcyjny stack, testy, monitoring.' },
  { step: '04', title: 'Wzrost', text: 'Iteracje na danych — nie na domysłach.' },
]

export const marqueeItems = [
  'Web Development',
  'Automatyzacja',
  'Integracje AI',
  'Małe firmy',
  'Produkty premium',
  'GSAP · React · Astro',
]
