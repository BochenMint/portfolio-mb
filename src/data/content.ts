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

export const site = {
  name: 'Marcin B.',
  brand: 'Bochen Studio',
  role: 'PropTech · FinTech · AI ops',
  icpBadge: 'Projekty od 25 000 PLN · decydent w firmie',
  headline: ['4 produkcyjne systemy.', 'Jeden standard jakości.'],
  headlineAccent: 'Mint · Plumm · iDrive · Agentic OS',
  subhead:
    'Buduję strony, platformy rezerwacji i automatyzacje z AI — dla właścicieli firm, którzy chcą mniej ręcznej pracy i więcej marży. Astro, React, integracje API, audytowalne agenty.',
  proofLine: '4 produkcyjne produkty · hospitality · księgowość · mobility · AI ops',
  ctaPrimary: 'Umów 20-min audyt (bezpłatnie)',
  ctaSecondary: 'Zobacz case studies',
  ctaSticky: 'Audyt procesu · 20 min',
  email: 'kontakt@example.com',
  calendly: import.meta.env.VITE_CALENDLY_URL || '',
  github: 'https://github.com/BochenMint',
  location: 'Polska · zdalnie i on-site',
  responseTime: 'Odpowiedź w 1 dzień roboczy',
  minBudget: '25 000 PLN',
}

export const results = [
  { value: '7', label: 'języków na Mint Apartments', suffix: '' },
  { value: '4', label: 'produkcyjne ekosystemy', suffix: '' },
  { value: '−12h', label: 'potencjał oszczędności / mies. przy fakturach', suffix: '*' },
  { value: '24/7', label: 'rezerwacje & concierge AI', suffix: '' },
]

export const services: Service[] = [
  {
    title: 'Platforma & booking',
    subtitle: 'Direct revenue, nie tylko wizytówka',
    points: [
      'SEO wielojęzyczne, Core Web Vitals, schema.org',
      'Widget rezerwacji, Previo/PMS, płatności',
      'Panel operacyjny pod Twój zespół',
    ],
  },
  {
    title: 'Automatyzacja & FinTech',
    subtitle: 'Excel o północy → pipeline',
    points: [
      'Eksporty Plumm, JPK_FA, KSeF-ready flow',
      'Synchronizacja kalendarzy, zamków, CRM',
      'Raporty i alerty — deterministyczne dane',
    ],
  },
  {
    title: 'AI z kontrolą',
    subtitle: 'Agent, który znasz i audytujesz',
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
    tagline: 'Księgowość · faktury · eksport JPK',
    description:
      'Plumm — panel do faktur i księgowości dla małych firm: wystawianie dokumentów, deterministyczne eksporty CSV/JPK i przygotowanie pod KSeF, z integracją MINTAX.',
    client: 'Małe firmy · biura rachunkowe',
    pain: 'Ręczne faktury i przenoszenie danych do księgowości — błędy przy zamknięciu miesiąca',
    approach: 'TypeScript w przeglądarce, adaptery eksportu, walidacja przed wysyłką do urzędu',
    result: 'Faktury i JPK z jednego panelu na plumm.pl — bez nocnego Excela',
    tags: ['Księgowość', 'Faktury', 'KSeF'],
    accent: '#3ee8c4',
    stat: { value: 'JPK', label: 'eksport jednym flow' },
    metrics: ['Faktury', 'JPK / KSeF', 'MINTAX'],
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
    pain: 'Rozproszone zapytania, brak jednego źródła prawdy o flocie',
    approach: 'Booking + CRM + automatyczne follow-upy',
    result: 'Krótszy czas obsługi zapytania, więcej zamkniętych rezerwacji',
    tags: ['Mobility', 'CRM', 'Lead gen'],
    accent: '#c9a962',
    stat: { value: '24/7', label: 'dostępność oferty' },
    metrics: ['Rezerwacje', 'Panel floty', 'Automatyzacje'],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'agentic OS',
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
    name: 'Launch',
    from: 'od 25 000 PLN',
    description: 'Landing + integracje + podstawowa automatyzacja',
    includes: ['UX/UI premium', 'SEO techniczne', 'Formularz + CRM', '2 iteracje'],
  },
  {
    name: 'Platforma',
    from: 'od 55 000 PLN',
    description: 'Booking, panel, wielojęzyczność, API',
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
    from: 'od 15 000 PLN / mies.',
    description: 'Agenci, automatyzacje, utrzymanie i rozwój',
    includes: ['Agentic workflows', 'Concierge / support AI', 'SLA response', 'Raport kosztów AI'],
  },
]

export const testimonials = [
  {
    quote:
      'Strona w końcu wygląda jak produkt premium, a nie ogłoszenie z OLX. Rezerwacja po polsku, angielsku i niemiecku bez dzwonienia — gość sam wybiera termin.',
    author: 'Marcin K.',
    role: 'właściciel · Mint Apartments (placeholder — wymaga zgody)',
    year: '2026',
  },
  {
    quote:
      'Jeden panel zamiast pięciu arkuszy. Widzę rezerwacje, concierge AI i social w jednym miejscu — zespół nie gubi wątków między WhatsAppem a mailem.',
    author: 'Zespół operacyjny',
    role: 'Mint Apartments · panel admin (placeholder)',
    year: '2026',
  },
  {
    quote:
      'Eksport JPK z Plumm kończy się w minutę, nie w weekend. Logika jest przewidywalna — wiem, co trafi do księgowej, zanim kliknę wyślij.',
    author: 'Anna M.',
    role: 'operator najmu · integracja MINTAX (placeholder)',
    year: '2026',
  },
]

export const faq = [
  {
    q: 'Dlaczego minimum 25 000 PLN?',
    a: 'Bo robię produkty produkcyjne — z testami, SEO i utrzymaniem — nie „stronę na wczoraj”. To filtr, który chroni obie strony.',
  },
  {
    q: 'Czy robisz same strony wizytówki?',
    a: 'Tak, jeśli są częścią większego celu (booking, automatyzacja). Sam landing bez biznesowego KPI — tylko w pakiecie Launch.',
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
