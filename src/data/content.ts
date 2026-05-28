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
  pullQuote: string
  tags: string[]
  stat: { value: string; label: string }
  metrics: string[]
  imageScene?: 'hero' | 'apartment'
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

export const site = {
  name: 'Marcin Bochen',
  brand: 'Marcin Bochen',
  role: 'Produkty cyfrowe · PropTech · FinTech · AI',
  headline: ['Buduję systemy,', 'które zostają w produkcji.'],
  subhead:
    'Cztery własne produkty — od apartamentów po faktury i agentów AI. Nie sprzedaję „strony na wczoraj”, tylko rzeczy, które Twój zespół faktycznie odpala każdego dnia.',
  aboutLead:
    'Pracuję samotnie jak studio, ale myślę jak product owner: najpierw proces i pieniądz, potem kod. Astro, React, integracje API — bez magii w slajdach.',
  aboutAside:
    'Polska, zdalnie i on-site w Trójmieście. Odpowiadam w jeden dzień roboczy. Projekty od 25 000 PLN — bo inaczej nie ma sensu robić tego porządnie.',
  ctaPrimary: 'Napisz, co Cię blokuje',
  ctaSecondary: 'Przewiń do realizacji',
  ctaSticky: 'Kontakt',
  email: 'kontakt@example.com',
  calendly: import.meta.env.VITE_CALENDLY_URL || '',
  github: 'https://github.com/BochenMint',
  linkedin: '',
  location: 'Polska · zdalnie',
  responseTime: 'Odpowiedź w 1 dzień roboczy',
  minBudget: 'od 25 000 PLN',
}

export const navLinks = [
  { href: '#o-mnie', label: 'O mnie' },
  { href: '#realizacje', label: 'Realizacje' },
  { href: '#case-studies', label: 'Case studies' },
  { href: '#uslugi', label: 'Zakres' },
  { href: '#kontakt', label: 'Kontakt' },
]

export const services: Service[] = [
  {
    title: 'Platforma i booking',
    subtitle: 'Direct revenue zamiast samej wizytówki',
    points: [
      'SEO wielojęzyczne, schema, Core Web Vitals',
      'Previo / PMS, płatności, panel operacyjny',
      'UX pod gościa i pod recepcję — jeden system',
    ],
  },
  {
    title: 'Automatyzacja i FinTech',
    subtitle: 'Excel o północy → jeden pipeline',
    points: [
      'Eksporty Plumm, JPK_FA, przygotowanie pod KSeF',
      'Synchronizacja kalendarzy, zamków, CRM',
      'Raporty deterministyczne — bez „AI zgaduje”',
    ],
  },
  {
    title: 'AI z kontrolą',
    subtitle: 'Agent, którego da się audytować',
    points: [
      'Concierge z wiedzą o ofercie, nie halucynacje',
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
    tagline: 'Apartamenty premium · direct booking',
    description:
      'Migracja z legacy PHP na nowoczesny stack. Siedem języków, rezerwacja bez pośrednika, concierge AI i integracje Tedee/Nuki — poziom, którego w Trójmieście szuka się na Airbnb, nie na OLX.',
    client: 'Operator short-term rental',
    pain: 'OTAs zjadały marżę, procesy były ręczne, UX nie trzymał się w 7 locale.',
    approach: 'Astro + React, Previo, panel social/AI, automatyzacja dostępu do apartamentu.',
    result: 'Direct booking, SEO locale, concierge 24/7 — gotowe pod skalowanie portfela.',
    pullQuote: '„W końcu jeden system zamiast pięciu arkuszy — gość rezerwuje po polsku, my widzimy wszystko w panelu.”',
    tags: ['Hospitality', 'Previo', 'AI Concierge'],
    stat: { value: '7', label: 'języków · jeden ekosystem' },
    metrics: ['Direct booking', 'Smart lock', 'CWV'],
    imageScene: 'apartment',
    flagship: true,
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: 'Faktury i JPK bez tarcia',
    description:
      'Oprogramowanie księgowe dla małych firm — eksporty CSV/JPK z logiką, której nie trzeba tłumaczyć księgowej. Integracja z MINTAX i pipeline pod KSeF.',
    client: 'Biura rachunkowe · operatorzy najmu',
    pain: 'Ręczne przenoszenie faktur, błędy w JPK, brak jednego panelu.',
    approach: 'TypeScript, adaptery eksportu w przeglądarce, walidacja przed wysyłką.',
    result: 'Godziny pracy przeniesione z Excela do jednego kliknięcia.',
    pullQuote: '„Eksport działa deterministycznie — nie boimy się zamknięcia miesiąca.”',
    tags: ['SaaS', 'FinTech', 'KSeF'],
    stat: { value: 'JPK', label: 'jednym flow' },
    metrics: ['Panel web', 'MINTAX', 'Integracje'],
    imageScene: 'hero',
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars',
    url: '#',
    tagline: 'Wynajem aut · flota online',
    description:
      'Warstwa cyfrowa wokół wynajmu: oferta, dostępność, lead gen i panel operacyjny pod rosnącą flotę.',
    client: 'Wynajem / automotive',
    pain: 'Rozproszone zapytania, brak jednego źródła prawdy o flocie.',
    approach: 'Booking + CRM + automatyczne follow-upy.',
    result: 'Krótszy czas obsługi zapytania, więcej zamkniętych rezerwacji.',
    pullQuote: '„Klient widzi dostępność od razu — my nie dzwonimy w kółko z tym samym pytaniem.”',
    tags: ['Mobility', 'CRM', 'Lead gen'],
    stat: { value: '24/7', label: 'oferta online' },
    metrics: ['Rezerwacje', 'Panel floty', 'Automatyzacje'],
    imageScene: 'hero',
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'agentic OS',
    url: '#',
    tagline: 'Orkiestracja agentów AI',
    description:
      'System operacyjny dla agentów: zadania, pamięć, narzędzia, audyt. Automatyzacje przewidywalne — nie czarna skrzynka promptów.',
    client: 'Produkt wewnętrzny · klienci B2B',
    pain: 'Chaos promptów bez logów i odpowiedzialności.',
    approach: 'Workflow engine, tool calling, human-in-the-loop.',
    result: 'Powtarzalne procesy z pełnym śladem decyzji.',
    pullQuote: '„Wreszcie wiemy, co agent zrobił i dlaczego — nie tylko co odpowiedział.”',
    tags: ['AI', 'Agents', 'Automation'],
    stat: { value: '100%', label: 'audytowalne kroki' },
    metrics: ['Workflow', 'Memory', 'Tooling'],
    imageScene: 'hero',
  },
]

export const pricing: PricingTier[] = [
  {
    name: 'Launch',
    from: 'od 25 000 PLN',
    description: 'Landing z integracjami i podstawową automatyzacją — gdy cel jest jasny.',
    includes: ['UX/UI', 'SEO techniczne', 'Formularz + CRM', '2 iteracje'],
  },
  {
    name: 'Platforma',
    from: 'od 55 000 PLN',
    description: 'Booking, panel, wielojęzyczność, API — produkt, nie wizytówka.',
    includes: [
      'Wszystko z Launch',
      'Rezerwacje / PMS',
      'Panel admina',
      'Monitoring i testy',
    ],
    highlight: true,
  },
  {
    name: 'AI Ops',
    from: 'od 15 000 PLN / mies.',
    description: 'Agenci, automatyzacje, utrzymanie — gdy proces już istnieje.',
    includes: ['Workflow agentów', 'Concierge / support AI', 'SLA', 'Raport kosztów AI'],
  },
]

export const testimonials = [
  {
    quote:
      'W końcu mamy jeden system zamiast pięciu arkuszy. Gość rezerwuje po polsku, my widzimy wszystko w panelu.',
    author: 'Właściciel',
    role: 'Mint Apartments',
    year: '2026',
  },
  {
    quote:
      'Eksport do Plumm działa deterministycznie — nie boimy się zamknięcia miesiąca.',
    author: 'Operator najmu',
    role: 'integracja MINTAX',
    year: '2026',
  },
]

export const faq = [
  {
    q: 'Dlaczego minimum 25 000 PLN?',
    a: 'Bo robię produkty produkcyjne — z testami, SEO i utrzymaniem. To filtr, który chroni obie strony przed „zrobimy szybko i tanio”.',
  },
  {
    q: 'Czy robisz same strony wizytówki?',
    a: 'Tak, jeśli są częścią większego celu — booking, automatyzacja, konkretne KPI. Sam landing bez biznesowego sensu — tylko w pakiecie Launch.',
  },
  {
    q: 'Jak wygląda współpraca z AI?',
    a: 'Najpierw proces i dane, potem agent. Zawsze: logi, fallback na człowieka, szacunek kosztów tokenów.',
  },
  {
    q: 'NDA i umowa?',
    a: 'Standardowo. Hosting w EU, RODO w scope od pierwszego dnia.',
  },
]

export const process = [
  { step: '01', title: 'Rozmowa 20 min', text: 'Sprawdzam, czy ROI ma sens — bez pitch decka.' },
  { step: '02', title: 'Prototyp', text: 'Czujesz produkt zanim powstanie backend.' },
  { step: '03', title: 'Build', text: 'Produkcja, testy, dokumentacja dla zespołu.' },
  { step: '04', title: 'Po wdrożeniu', text: 'Metryki i iteracje — nie „projekt zamknięty”.' },
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
    options: ['25–50 tys.', '50–100 tys.', '100+ tys.', 'Retainer AI Ops'],
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
