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
  flagship?: boolean
}

export const site = {
  name: 'Marcin Bochenek',
  role: 'Produkty cyfrowe · web · automatyzacja',
  photo: '/images/marcin-bochenek.webp',
  photoAlt:
    'Marcin Bochenek — portret w okularach w oprawkach szylkretowych, uśmiech, biały t-shirt na jasnym tle',
  photoWidth: 1024,
  photoHeight: 1024,
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
  { href: '#about', label: 'O mnie' },
  { href: '#services', label: 'Usługi' },
  { href: '#work', label: 'Realizacje' },
  { href: '#contact', label: 'Kontakt' },
]

export const menuLinks = [
  { href: '#about', label: 'O mnie', num: '01' },
  { href: '#services', label: 'Usługi', num: '02' },
  { href: '#work', label: 'Realizacje', num: '03' },
  { href: '#contact', label: 'Kontakt', num: '04' },
]

export const services = [
  {
    num: '01',
    title: 'Produkty webowe',
    description:
      'Strony i panele pod realny ruch: Astro, React, Next.js — szybkość, SEO techniczne i booking bez pośredników tam, gdzie to zarabia.',
    tags: ['Astro', 'React', 'Direct booking'],
  },
  {
    num: '02',
    title: 'Automatyzacja procesów',
    description:
      'Integracje PMS, smart lock, eksporty JPK/CSV, workflow z logiem — mniej ręcznej pracy, więcej powtarzalności w niedzielę o 23:00.',
    tags: ['Previo', 'Integracje', 'Workflow'],
  },
  {
    num: '03',
    title: 'AI z audytem',
    description:
      'Concierge z kontekstem oferty, agenci z whitelistą narzędzi i human-in-the-loop — bez chaosu promptów w czacie.',
    tags: ['Concierge', 'Agentic', 'Audyt kroków'],
  },
]

export const projects: Project[] = [
  {
    id: 'mint',
    title: 'Mint Apartments',
    domain: 'mintapartments.pl',
    url: 'https://mintapartments.pl',
    tagline: '36 apartamentów w Gdańsku · direct booking · 7 języków',
    description:
      'Platforma direct bookingu dla operatora najmu krótkoterminowego: 36 apartamentów w trzech dzielnicach Gdańska, rezerwacja bez prowizji OTA, concierge AI i samodzielne zameldowanie przez Tedee/Nuki.',
    client: 'Mint Apartments — operator 36 apartamentów krótkoterminowych w Gdańsku (od 2017)',
    outcome:
      'Gość rezerwuje bezpośrednio o 10–15% taniej niż na portalach, melduje się sam o dowolnej godzinie, a zespół obsługuje 3 lokalizacje (Seaside, DOKI, Bastion Wałowa) z jednego panelu Previo.',
    pain: 'Prowizje OTA zjadały marżę, oferta była rozproszona między językami i kanałami, check-in wymagał recepcji, a legacy PHP nie nadążał za SEO i mobile-first bookingiem.',
    contribution:
      'Migracja na Astro + React, integracja Previo (PMS + booking), concierge AI w 7 językach z kontekstem oferty, smart locki Tedee/Nuki, moduł rozliczeń MINTAX dla właścicieli, SEO techniczne i treści wielojęzyczne.',
    decisions: [
      'Previo jako PMS — silnik rezerwacji i synchronizacja kalendarzy bez budowania własnego channel managera',
      'Concierge z narzędziami (dostępność, WhatsApp) — nie generyczny chatbot bez kontekstu apartamentów',
      'Direct booking jako USP — ta sama noc taniej, widoczna na każdej karcie apartamentu',
    ],
    tags: ['Hospitality', 'Previo', 'AI Concierge'],
    flagship: true,
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: 'AI księgowość online · JDG i spółki · KSeF od dnia 1',
    description:
      'Polska platforma SaaS łącząca faktury KSeF, rozliczenia PIT/VAT/ZUS, generowanie JPK-V7 i asystenta AI z wiedzą podatkową — dla JDG, freelancerów i spółek, bez tradycyjnego biura rachunkowego.',
    client: 'PLUMM Sp. z o.o. — własny produkt SaaS (twórca: Marcin Bochenek)',
    outcome:
      'Przedsiębiorca ma jeden panel zamiast Excela, programu do faktur i biura rachunkowego — KSeF gotowy od startu, terminy podatkowe w kalendarzu, zamknięcie miesiąca i JPK jednym kliknięciem.',
    pain: 'Faktury, KPiR, ZUS i JPK w osobnych narzędziach; biuro rachunkowe 300–600 zł/mies. za JDG bez natychmiastowej odpowiedzi; jedno przeoczone JPK to kara i stres.',
    contribution:
      'Platforma webowa Next.js/TypeScript od zera: landing, cennik, panel app.plumm.pl, integracja KSeF, AI asystent podatkowy, automatyczne naliczanie PIT/CIT/VAT/ZUS, pakiety od 0 zł do Enterprise.',
    decisions: [
      'Jedna aplikacja zamiast ekosystemu narzędzi — faktury, rozliczenia i AI w jednym UX',
      'KSeF jako fundament, nie dodatek — wysyłanie i odbiór e-faktur bez konfiguracji',
      'AI z bazą wiedzy podatkowej + eskalacja do księgowej — szybkość bez rezygnacji z compliance',
    ],
    tags: ['SaaS', 'FinTech', 'KSeF', 'AI'],
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

export const caseNavLinks = projects.map((project, index) => ({
  href: `#project-${project.id}`,
  label: project.title,
  num: String(index + 1).padStart(2, '0'),
}))

export const contactFields = [
  { id: 'name', label: 'Imię', type: 'text' as const, required: true },
  { id: 'email', label: 'E-mail', type: 'email' as const, required: true },
  { id: 'message', label: 'Wiadomość', type: 'textarea' as const, required: true },
]
