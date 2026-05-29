export type Project = {
  id: string
  title: string
  domain: string
  url: string
  tagline: string
  description: string
  client: string
  outcome: string
  pain: string
  contribution: string
  decisions: string[]
  tags: string[]
  imageScene?: 'hero' | 'apartment'
}

export const site = {
  name: 'Marcin Bochen',
  role: 'Produkty cyfrowe · web · automatyzacja',
  valueProp:
    'Projektuję i wdrażam strony, panele i automatyzacje dla firm — od direct bookingu apartamentów po faktury i agentów AI z pełnym audytem.',
  aboutLead:
    'Pracuję jak małe studio produktowe: najpierw proces i liczby, potem interfejs. Astro, React, Next.js — bez obietnic, których nie da się zmierzyć po wdrożeniu.',
  aboutAside:
    'Polska, zdalnie i on-site w Trójmieście. Odpowiadam w jeden dzień roboczy. Projekty od 25 000 PLN, gdy ma sens ROI po obu stronach.',
  ctaPrimary: 'Napisz do mnie',
  ctaSecondary: 'Zobacz prace',
  email: 'kontakt@example.com',
  calendly: import.meta.env.VITE_CALENDLY_URL || '',
  github: 'https://github.com/BochenMint',
  location: 'Polska · zdalnie',
  responseTime: 'Odpowiedź w 1 dzień roboczy',
}

export const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export const projects: Project[] = [
  {
    id: 'mint',
    title: 'Mint Apartments',
    domain: 'mintapartments.pl',
    url: 'https://mintapartments.pl',
    tagline: 'Apartamenty premium · direct booking',
    description:
      'Platforma dla operatora short-term: wielojęzyczna oferta, rezerwacja bez pośrednika, concierge AI i integracje smart lock.',
    client: 'Operator najmu krótkoterminowego',
    outcome:
      'Gość rezerwuje po polsku (i w 6 innych językach) na własnej domenie; zespół ma jeden panel zamiast arkuszy.',
    pain: 'Wysoka marża OTA, ręczne procesy, niespójny UX w wielu locale, brak jednego źródła prawdy o apartamencie.',
    contribution:
      'Migracja z legacy PHP, architektura treści, booking, panel social/AI, automatyzacja dostępu (Tedee/Nuki), SEO techniczne.',
    decisions: [
      'Astro + React — szybki front, interaktywny booking tam, gdzie trzeba',
      'Previo jako PMS — bez przepisywania silnika rezerwacji',
      'Concierge z kontekstem oferty, nie generyczny chatbot',
    ],
    tags: ['Hospitality', 'Previo', 'AI Concierge'],
    imageScene: 'hero',
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: 'Faktury i JPK bez tarcia',
    description:
      'SaaS księgowy: wystawianie faktur, eksporty CSV/JPK z przewidywalną logiką, integracja z MINTAX.',
    client: 'Biura rachunkowe · operatorzy najmu',
    outcome:
      'Zamknięcie miesiąca bez ręcznego przeklejania faktur — eksport JPK i CSV w jednym, sprawdzonym flow.',
    pain: 'Ręczne przenoszenie dokumentów, błędy w JPK, brak jednego panelu dla wielu podmiotów.',
    contribution:
      'Aplikacja webowa TypeScript, adaptery eksportu w przeglądarce, walidacja przed wysyłką, UX pod księgową i właściciela.',
    decisions: [
      'Logika eksportu deterministyczna — ten sam input, ten sam plik',
      'Przygotowanie pod KSeF bez obietnic „magicznej integracji”',
      'Panel w przeglądarce — bez instalacji u klienta',
    ],
    tags: ['SaaS', 'FinTech', 'KSeF-ready'],
    imageScene: 'hero',
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars.pl',
    url: 'https://idrivecars.pl',
    tagline: 'Blog motoryzacyjny · testy i galerie',
    description:
      'Autorski dziennik motoryzacyjny: testy, pierwsze jazdy, archiwum galerii WEBP — Next.js, MDX, pipeline treści.',
    client: 'Własny produkt medialny',
    outcome:
      'Setki artykułów i galerii w jednej, szybkiej witrynie z sensownym SEO — bez WordPressa i pluginów.',
    pain: 'Rozproszone pliki Word, ciężkie galerie JPG, brak spójnego szablonu publikacji.',
    contribution:
      'Next.js 15, import MDX, konwersja galerii Sharp → WEBP, sitemap/robots, layout pod długie teksty.',
    decisions: [
      'Treść w repozytorium (MDX), nie w CMS na start',
      'Galerie kuratorowane — jakość ważniejsza niż liczba zdjęć',
      'Kanoniczny URL idrivecars.pl — gotowe pod indeksację',
    ],
    tags: ['Media', 'Next.js', 'MDX'],
    imageScene: 'hero',
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'system wewnętrzny · B2B',
    url: '#agentic',
    tagline: 'Orkiestracja agentów dla firm',
    description:
      'System zarządzania agentami AI: workflow, narzędzia, pamięć kontekstu i pełny audyt — automatyzacja procesów SMB z kontrolą człowieka.',
    client: 'Produkt wewnętrzny · automatyzacja B2B',
    outcome:
      'Powtarzalne procesy (zapytania, raporty, synchronizacje) z logiem kroków — wiadomo, kto, co i dlaczego.',
    pain: 'Chaos promptów w czacie, brak odpowiedzialności, niemożność wdrożenia u klienta bez audytu.',
    contribution:
      'Silnik workflow, tool calling, kolejki zadań, human-in-the-loop, szacowanie kosztów modeli.',
    decisions: [
      'Każdy krok agenta zapisany — nie tylko odpowiedź końcowa',
      'Narzędzia ograniczone whitelistą — mniej ryzyka niż dowolny shell',
      'Fallback na operatora przy niskiej pewności',
    ],
    tags: ['AI', 'Workflow', 'SMB'],
    imageScene: 'hero',
  },
]

export const contactFields = [
  { id: 'name', label: 'Imię', type: 'text' as const, required: true },
  { id: 'email', label: 'E-mail', type: 'email' as const, required: true },
  { id: 'message', label: 'Wiadomość', type: 'textarea' as const, required: true },
]
