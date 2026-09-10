export type Project = {
  id: string
  title: string
  domain: string
  url: string
  tagline: string
  description: string
  client: string
  pain: string
  approach: string
  result: string
  tags: string[]
  accent: string
  stat: { value: string; label: string }
  metrics: string[]
  flagship?: boolean
}

export type Service = {
  title: string
  subtitle: string
  points: string[]
}

export type PricingTier = {
  name: string
  from: string
  description: string
  includes: string[]
  highlight?: boolean
}

/** Ignoruje placeholdery z .env.example — puste, sam root cal.com/calendly.com i YOUR-USER nie są prawdziwym linkiem audytu. */
function normalizeCalendlyUrl(raw: string | undefined): string {
  const url = (raw || '').trim()
  if (!url) return ''
  if (/YOUR-USER/i.test(url)) return ''

  try {
    const { hostname, pathname } = new URL(url)
    const isSchedulerHost =
      hostname === 'cal.com' ||
      hostname === 'www.cal.com' ||
      hostname === 'calendly.com' ||
      hostname === 'www.calendly.com'
    if (!isSchedulerHost) return url

    const bareRoot = pathname === '/' || pathname === ''
    if (bareRoot) return ''

    return url
  } catch {
    return ''
  }
}

export const site = {
  name: 'Marcin B.',
  brand: 'Marcin Bochenek',
  role: 'PropTech · FinTech · AI ops',
  icpBadge: 'Strony od 2 000 PLN · systemy od 8 000 PLN',
  headline: ['4 produkcyjne systemy.', 'Jeden standard jakości.'],
  headlineAccent: 'Mint · Plumm · iDrive · Agentic OS',
  subhead:
    'Buduję strony, platformy rezerwacji i automatyzacje z AI — dla właścicieli firm, którzy chcą mniej ręcznej pracy i więcej marży. Astro, React, integracje API, audytowalne agenty.',
  ctaPrimary: 'Umów 20-min audyt (bezpłatnie)',
  ctaSecondary: 'Zobacz case studies',
  ctaSticky: 'Audyt procesu · 20 min',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'kontakt@marcinbochenek.com',
  calendly: normalizeCalendlyUrl(import.meta.env.VITE_CALENDLY_URL),
  github: 'https://github.com/BochenMint',
  location: 'Polska · zdalnie i on-site',
  responseTime: 'Odpowiedź w 1 dzień roboczy',
  minBudget: '2 000 PLN',
}

export const services: Service[] = [
  {
    title: 'Platforma & booking',
    subtitle: 'Klienci rezerwują u Ciebie, nie u pośrednika',
    points: [
      'SEO wielojęzyczne, Core Web Vitals, schema.org',
      'Widget rezerwacji, Previo/PMS, płatności',
      'Panel operacyjny pod Twój zespół',
    ],
  },
  {
    title: 'Automatyzacja & FinTech',
    subtitle: 'Koniec z arkuszami po godzinach',
    points: [
      'Eksporty Plumm, JPK_FA, KSeF-ready flow',
      'Synchronizacja kalendarzy, zamków, CRM',
      'Raporty i alerty — deterministyczne dane',
    ],
  },
  {
    title: 'AI z kontrolą',
    subtitle: 'AI, które robi tylko to, na co się zgodziłeś',
    points: [
      'Concierge z wiedzą o ofercie (nie halucynacje)',
      'Agentic OS — workflow, pamięć, logi',
      'RODO, koszty tokenów, fallback na człowieka',
    ],
  },
]

export const projects: Project[] = [
  {
    id: 'mint',
    title: 'Mint Apartments',
    domain: 'mintapartments.pl',
    url: 'https://mintapartments.pl',
    tagline: 'Apartamenty w Gdańsku · rezerwacja online',
    description:
      'Produkcyjna strona Mint Apartments: katalog apartamentów w Trójmieście, wielojęzyczny direct booking, integracja Previo i concierge AI — zamiast uzależnienia od portali agregujących.',
    client: 'Short-term rental · Gdańsk i okolice',
    pain: 'Goście rezerwowali przez OTA — brak jednej marki, direct bookingu i spójnego UX w wielu językach',
    approach: 'Astro + React, SEO locale, widget Previo, panel operacyjny i automatyzacja dostępu (Tedee/Nuki)',
    result: 'mintapartments.pl jako kanał rezerwacji i marki premium — gotowe pod skalowanie portfela',
    tags: ['Gdańsk', 'Booking', 'Previo', 'AI Concierge'],
    accent: '#7ee0ff',
    stat: { value: '7', label: 'locale · 1 ekosystem' },
    metrics: ['Direct booking', 'Smart lock', 'Core Web Vitals'],
    flagship: true,
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: '16 silników deklaracji · 9 314 przetestowanych scenariuszy · jedna aplikacja',
    description:
      'Plumm to pełna platforma księgowości AI dla polskich firm: faktury, KSeF, VAT/PIT/CIT/ZUS, rozrachunki i asystent AI dla przedsiębiorcy oraz księgowego w jednym miejscu. Pod maską — 118 modeli danych i 456 endpointów API w ok. 545 tys. linii TypeScript, a 16 formatów deklaracji (PIT-28/36/36L, CIT-8/8E, JPK_V7/FA/PKPIR, KSeF FA(3)) jest walidowanych względem oficjalnych schematów XSD Ministerstwa Finansów i pokrytych 9 314 przypadkami testowymi.',
    client: 'Małe i średnie firmy · biura rachunkowe',
    pain: 'Faktury, VAT, PIT, CIT i ZUS rozjeżdżały się po arkuszach i osobnych narzędziach — ryzyko błędu przy każdym zamknięciu miesiąca i deklaracji do urzędu',
    approach: 'Next.js + TypeScript na 118 modelach Prisma, 16 silników eksportu XML walidowanych względem XSD Ministerstwa Finansów, obszar rozrachunków i AI asystent, wszystko pokryte 9 314 testami',
    result: 'Faktury, KSeF, podatki, ZUS i rozrachunki z jednej aplikacji na plumm.pl — bez nocnego Excela i bez zgadywania, co trafi do urzędu',
    tags: ['Księgowość AI', 'KSeF', 'VAT · PIT · CIT', 'ZUS'],
    accent: '#3ee8c4',
    stat: { value: '16', label: 'silników deklaracji XSD' },
    metrics: ['9 314 testów', '456 endpointów', '118 modeli'],
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars.pl',
    url: '#',
    tagline: 'Dziennikarstwo motoryzacyjne · testy aut · galerie',
    description:
      'Autorski portfolio i blog motoryzacyjny: testy aut, pierwsze jazdy i galerie zdjęć, oparte na Next.js 15 App Router, treści w MDX i pipeline WebP na bazie Sharp.',
    client: 'Dziennikarstwo motoryzacyjne · blog osobisty',
    pain: 'Treści redakcyjne wymagały szybkiego, zdjęciocentrycznego publikowania bez rozbudowanego CMS-a',
    approach: 'Next.js 15 App Router, MDX pod długie recenzje, pipeline Sharp generujący zoptymalizowane galerie WebP',
    result: 'Szybka, dobrze zindeksowana publikacja testów aut i galerii, pisana w całości w MDX',
    tags: ['Automotive', 'MDX', 'Next.js'],
    accent: '#c9a962',
    stat: { value: 'MDX', label: 'pipeline treści' },
    metrics: ['Testy aut', 'Galerie zdjęć', 'Pipeline WebP'],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'agentic-os',
    url: '#',
    tagline: 'Orkiestracja agentów AI',
    description:
      'System operacyjny dla agentów: zadania, pamięć, narzędzia, audyt. Automatyzacje przewidywalne — nie czarna skrzynka.',
    client: 'Wewnętrzny produkt · klienci B2B',
    pain: 'Chaos promptów bez logów i odpowiedzialności',
    approach: 'Workflow engine, tool calling, human-in-the-loop',
    result: 'Powtarzalne procesy z pełnym śladem decyzji',
    tags: ['AI', 'Agents', 'Automation'],
    accent: '#a78bfa',
    stat: { value: '100%', label: 'audytowalne kroki' },
    metrics: ['Workflow', 'Memory', 'Tooling'],
  },
]

export const pricing: PricingTier[] = [
  {
    name: 'Start',
    from: 'od 2 000 PLN',
    description: 'Strona wizytówka lub landing, który zbiera zapytania',
    includes: [
      'Do 5 podstron pod Twoją markę',
      'Formularz kontaktowy z powiadomieniami',
      'Szybkość na telefonie + SEO on-page',
      'Ścieżka rozbudowy do pakietu Launch',
    ],
  },
  {
    name: 'Launch',
    from: 'od 8 000 PLN',
    description: 'Strona firmowa + lejek konwersji + integracje',
    includes: ['Formularz → CRM', 'Kalendarz / booking', 'SEO techniczne', 'Pomiar konwersji'],
  },
  {
    name: 'Platforma',
    from: 'od 25 000 PLN',
    description: 'Booking, panel operacyjny, wielojęzyczność, API',
    includes: [
      'Wszystko z Launch',
      'Rezerwacje / PMS',
      'Panel admina',
      'Monitoring & testy',
    ],
    highlight: true,
  },
  {
    name: 'AI Ops',
    from: 'od 3 000 PLN / mies.',
    description: 'Agenci, automatyzacje, utrzymanie i rozwój',
    includes: ['Agentic workflows', 'Concierge / support AI', 'SLA response', 'Raport kosztów AI'],
  },
]

export const faq = [
  {
    q: 'Czy robisz też proste strony firmowe?',
    a: 'Tak. Pakiet Start (od 2 000 PLN) to solidna strona wizytówka lub landing z formularzem, szybkością na telefonie i podstawowym SEO — bez systemów pod spodem, ale zaprojektowana tak, żeby dało się ją rozbudować. Strona firmowa z lejkiem konwersji i integracjami zaczyna się od pakietu Launch (od 8 000 PLN).',
  },
  {
    q: 'Czy robisz same strony wizytówki?',
    a: 'Tak — w pakiecie Start. Jeśli od początku wiadomo, że celem są rezerwacje albo automatyzacja, projektuję wizytówkę jako pierwszy etap tej ścieżki, żeby nie budować jej dwa razy.',
  },
  {
    q: 'Jak wygląda współpraca z AI?',
    a: 'Najpierw proces i dane, potem agent. Zawsze: logi, fallback na człowieka, szacunek kosztów tokenów.',
  },
  {
    q: 'Czy podpisujesz NDA i umowę?',
    a: 'Tak — standardowo. Hosting w EU, RODO w scope od dnia zero.',
  },
]

export const process = [
  { step: '01', title: 'Audyt 20 min', text: 'Czy Twój case ma sens ROI — szczerze, bez pitch decka.' },
  { step: '02', title: 'Prototyp ruchu', text: 'Czujesz produkt przed napisaniem linii backendu.' },
  { step: '03', title: 'Build & wdrożenie', text: 'Produkcja, testy, dokumentacja dla zespołu.' },
  { step: '04', title: 'Wzrost', text: 'Metryki, iteracje — nie „projekt zamknięty”.' },
]

export const marqueeItems = [
  'PropTech',
  'FinTech',
  'Automotive',
  'AI Ops',
  'Astro · React',
  'Previo · Plumm · KSeF',
  'Małe firmy → duży efekt',
]

export const qualificationFields = [
  { id: 'name', label: 'Imię i nazwisko', type: 'text', required: true },
  { id: 'email', label: 'E-mail firmowy', type: 'email', required: true },
  { id: 'company', label: 'Firma / branża', type: 'text', required: true },
  {
    id: 'budget',
    label: 'Budżet orientacyjny',
    type: 'select',
    required: true,
    options: ['2–8 tys.', '8–25 tys.', '25+ tys.', 'Retainer AI Ops'],
  },
  {
    id: 'timeline',
    label: 'Termin startu',
    type: 'select',
    required: true,
    options: ['ASAP', '1–2 mies.', '3+ mies.', 'Eksploruję'],
  },
  { id: 'message', label: 'Co dziś boli? (2–3 zdania)', type: 'textarea', required: true },
]
