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

export type ResultMetric = {
  value: string
  label: string
  hint?: string
}

export type ProcessStep = {
  num: string
  title: string
  description: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type Testimonial = {
  quote: string
  role: string
  company: string
  placeholder?: boolean
}

export const site = {
  name: 'Marcin Bochenek',
  role: 'Systemy dla MŚP · web · AI w codziennej pracy',
  photo: '/images/marcin-bochenek.webp',
  photoAlt:
    'Marcin Bochenek — portret w okularach w oprawkach szylkretowych, uśmiech, biały t-shirt na jasnym tle',
  photoWidth: 1024,
  photoHeight: 1024,
  headline: ['Marcin', 'Bochenek'],
  subhead:
    'Wdrażam strony, panele i AI, które odciążają Twój zespół — mniej telefonów, szybsze faktury, rezerwacje bez prowizji Booking.',
  valueProp:
    'Buduję produkcyjne systemy dla właścicieli firm: direct booking, księgowość w jednym panelu, concierge 24/7 i automatyzacje z audytem każdego kroku.',
  aboutQuote:
    'Nie sprzedaję slajdów — wdrażam to, co działa w niedzielę o 23:00, gdy nikt z biura nie odbiera.',
  aboutLead:
    'Jestem builderem: najpierw liczę godziny i PLN, potem kod. Astro, React, Next.js — mierzalne efekty po wdrożeniu, nie obietnice z pitch decka.',
  aboutAside:
    'Polska, zdalnie i on-site w Trójmieście. Odpowiadam w jeden dzień roboczy. Projekty od 25 000 PLN, gdy ROI ma sens po obu stronach — zwykle gdy odzyskujesz 8+ godzin miesięcznie lub realnie obniżasz koszt obsługi.',
  ctaPrimary: 'Umów 20-min audyt',
  ctaSecondary: 'Zobacz realizacje',
  ctaCalendly: 'Umów 20-min audyt',
  footerCta: {
    line1: '20 minut audytu',
    line2: 'ile godzin oddajesz sobie?',
  },
  email: 'kontakt@example.com',
  calendly: import.meta.env.VITE_CALENDLY_URL || '',
  github: 'https://github.com/BochenMint',
  location: 'Polska · zdalnie',
  responseTime: 'Odpowiedź w 1 dzień roboczy',
  icpBadge: 'Dla właścicieli MŚP · projekty od 25 000 PLN',
}

export const navLinks = [
  { href: '#about', label: 'O mnie' },
  { href: '#services', label: 'Co robię' },
  { href: '#work', label: 'Realizacje' },
  { href: '#contact', label: 'Kontakt' },
]

export const menuLinks = [
  { href: '#about', label: 'O mnie', num: '01' },
  { href: '#services', label: 'Co robię', num: '02' },
  { href: '#work', label: 'Realizacje', num: '03' },
  { href: '#contact', label: 'Kontakt', num: '04' },
]

export const sections = {
  about: {
    num: '01',
    title: 'O mnie',
    lead: 'Jeden człowiek, pełne wdrożenie — od audytu procesu po produkcję.',
  },
  services: {
    num: '02',
    title: 'Co robię dla Twojej firmy',
    lead: 'Trzy filary: więcej przychodu z własnej strony, mniej ręcznej roboty, AI pod kontrolą.',
  },
  work: {
    num: '03',
    title: 'Realizacje w produkcji',
    lead: 'Cztery systemy, które już pracują — z liczbami godzin i PLN tam, gdzie da się to uczciwie policzyć.',
  },
  process: {
    num: '05',
    title: 'Jak wygląda współpraca',
    lead: 'Bez „discovery” na pół roku. Od audytu do pierwszego mierzalnego efektu.',
  },
  testimonials: {
    num: '06',
    title: 'Co mówią po wdrożeniu',
    lead: 'Konkretne efekty — nie „współpraca na najwyższym poziomie”.',
  },
  faq: {
    num: '07',
    title: 'Pytania właścicieli firm',
    lead: 'To, o co pytasz przed pierwszą rozmową — odpowiedzi bez ściemy.',
  },
  contact: {
    num: '04',
    title: 'Kontakt',
    lead: 'Napisz, co dziś zjada czas — w audycie policzymy, czy da się to odzyskać w 90 dni.',
  },
}

export const resultsDisclaimer =
  '* Szacunki orientacyjne — zależą od wolumenu firmy, liczby kanałów i tego, co już masz wdrożone. Na 20-min audycie podam zakres dla Twojego przypadku.'

export const results: ResultMetric[] = [
  {
    value: '8–15 h',
    label: 'mniej na mailach i WhatsApp od gości / mies.*',
    hint: 'Concierge + direct booking (operator STR)',
  },
  {
    value: '10–15%',
    label: 'taniej dla gościa vs Booking/Airbnb',
    hint: 'Mint Apartments — direct booking',
  },
  {
    value: '12–20 h',
    label: 'mniej na fakturach i JPK / mies.*',
    hint: 'JDG z Plumm vs Excel + osobne programy',
  },
  {
    value: '300–600 zł',
    label: 'mies. mniej niż tradycyjne biuro (JDG)',
    hint: 'Plumm od 149 zł vs biuro rachunkowe',
  },
]

export const proofProducts = ['Mint Apartments', 'Plumm', 'iDrive Cars', 'Agentic OS']

export const services = [
  {
    num: '01',
    title: 'Sprzedaż i rezerwacje na Twojej stronie',
    description:
      'Strona, która zarabia: direct booking bez prowizji OTA, szybkie płatności, SEO pod realne zapytania. Gość rezerwuje u Ciebie — nie płacisz 15% portalowi za tę samą noc.',
    tags: ['Direct booking', 'Astro', 'Previo'],
  },
  {
    num: '02',
    title: 'Panel i integracje zamiast Excela',
    description:
      'Faktury, kalendarze, smart locki, eksporty JPK — jeden przepływ zamiast pięciu kartek i pięciu logowań. Zespół robi to samo w 10 minut, nie w 2 godziny w niedzielę.',
    tags: ['KSeF', 'PMS', 'Workflow'],
  },
  {
    num: '03',
    title: 'AI, które zna Twoją ofertę',
    description:
      'Concierge 24/7, asystent księgowy, agenci z whitelistą narzędzi i pełnym audytem kroków. Mniej telefonów „gdzie jest kod?” — eskalacja do człowieka, gdy trzeba.',
    tags: ['Concierge', 'Asystent', 'Audyt'],
  },
]

export const projects: Project[] = [
  {
    id: 'mint',
    title: 'Mint Apartments',
    domain: 'mintapartments.pl',
    url: 'https://mintapartments.pl',
    tagline: '36 apartamentów · direct booking · concierge 24/7',
    description:
      'System dla operatora najmu krótkoterminowego: rezerwacja na własnej domenie (10–15% taniej niż OTA), samodzielny check-in Tedee/Nuki, concierge AI w 7 językach. Szacunek: 8–15 h/mies.* mniej na powtarzalnych pytaniach gości.',
    client: 'Mint Apartments — operator 36 apartamentów w Gdańsku (od 2017)',
    outcome:
      'Gość płaci mniej niż na Booking, melduje się o dowolnej porze, zespół prowadzi 3 dzielnice z jednego Previo. Prowizja OTA zostaje u Ciebie — jako marża, nie koszt portalu.',
    pain: 'Prowizje OTA zjadały marżę. Oferta rozproszona po językach. Check-in wymagał recepcji. Legacy PHP nie nadążał za mobile i SEO.',
    contribution:
      'Astro + React, Previo (PMS + booking), concierge z dostępnością i WhatsApp, Tedee/Nuki, MINTAX dla właścicieli, SEO wielojęzyczne.',
    decisions: [
      'Direct booking na każdej karcie — ta sama noc taniej, bez ukrytej prowizji',
      'Concierge z kontekstem apartamentu — nie generyczny chat',
      'Previo zamiast budowy własnego channel managera',
    ],
    tags: ['Hospitality', 'Direct booking', 'AI Concierge'],
    flagship: true,
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: 'Księgowość JDG w jednym panelu · KSeF · AI 24/7',
    description:
      'Polska platforma SaaS: faktury KSeF, PIT/VAT/ZUS, JPK-V7, asystent podatkowy po polsku. Dla JDG i spółek — zamiast Excela + biura 300–600 zł/mies. Benchmark produktu: ~80% mniej czasu na papierologii*; typowo 12–20 h/mies.* przy regularnym wolumenie faktur.',
    client: 'PLUMM Sp. z o.o. — własny produkt SaaS',
    outcome:
      'Jeden panel po zalogowaniu: KSeF od dnia 1, terminy w kalendarzu, zamknięcie miesiąca i JPK jednym kliknięciem. Odpowiedź podatkowa w minutach — nie po 2 dniach od biura.',
    pain: 'Faktury, KPiR, ZUS i JPK w osobnych narzędziach. Biuro drogie i wolne. Jedno przeoczone JPK = kara.',
    contribution:
      'Next.js/TypeScript: landing, cennik, app.plumm.pl, KSeF, AI z wiedzą podatkową + eskalacja do księgowej, plany 0–2000+ zł/mies.',
    decisions: [
      'Jedna aplikacja — faktury, rozliczenia, AI w jednym UX',
      'KSeF jako fundament — nie „dodatek za dopłatą”',
      'AI + człowiek przy compliance — szybkość bez ryzyka',
    ],
    tags: ['SaaS', 'KSeF', 'JDG'],
    imageScene: 'hero',
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars.pl',
    url: 'https://idrivecars.pl',
    tagline: 'Blog motoryzacyjny · publikacja bez WordPressa',
    description:
      'Autorski dziennik: testy, galerie WEBP, Next.js + MDX. Szybsza publikacja i lepsze SEO = więcej wejść z wyszukiwarki na ten sam wysiłek redakcyjny (bez obietnicy „10× leadów”).',
    client: 'Własny produkt medialny',
    outcome:
      'Setki artykułów w jednej szybkiej witrynie. Publikacja z repozytorium — bez pluginów, które psują się po aktualizacji.',
    pain: 'Word, ciężkie JPG, brak szablonu. Każdy tekst trwał za długo od pomysłu do URL.',
    contribution:
      'Next.js 15, MDX, Sharp → WEBP, sitemap, layout pod długie testy i galerie.',
    decisions: [
      'Treść w repo (MDX) — kontrola wersji jak w kodzie produktu',
      'WEBP i kuratorowane galerie — szybkość mobile',
      'Kanoniczny idrivecars.pl — jeden adres pod indeksację',
    ],
    tags: ['Media', 'SEO', 'Next.js'],
    imageScene: 'hero',
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'system wewnętrzny · B2B',
    url: '#agentic',
    tagline: 'Powtarzalne procesy · audyt każdego kroku',
    description:
      'Orkiestracja agentów AI dla MŚP: workflow, narzędzia na whitelistcie, human-in-the-loop. Szacunek: 5–10 h/tydz.* mniej na raportach, synchronizacjach i powtarzalnych zapytaniach — z logiem kto/co/dlaczego.',
    client: 'Produkt wewnętrzny · automatyzacja B2B',
    outcome:
      'Zespół odpuszcza ręczne kopiuj-wklej. Każdy krok agenta zapisany — audyt bez „czarnej skrzynki” ChatGPT.',
    pain: 'Prompty w czacie bez odpowiedzialności. Klient nie wdroży tego u siebie bez logów i limitów.',
    contribution:
      'Silnik workflow, tool calling, kolejki, human-in-the-loop, szacowanie kosztów modeli.',
    decisions: [
      'Log każdego kroku — nie tylko końcowa odpowiedź',
      'Whitelist narzędzi — mniej ryzyka niż dowolny shell',
      'Operator przejmuje przy niskiej pewności',
    ],
    tags: ['AI', 'Workflow', 'MŚP'],
    imageScene: 'hero',
  },
]

export const process: ProcessStep[] = [
  {
    num: '01',
    title: '20-min audyt (bezpłatnie)',
    description:
      'Rozmawiamy o tym, co dziś zjada czas: telefony, faktury, rezerwacje, raporty. Na koniec: szacunek godzin do odzyskania i czy projekt ma sens od 25 000 PLN.',
  },
  {
    num: '02',
    title: 'Plan na 90 dni',
    description:
      'Jeden dokument: zakres, integracje, pierwszy mierzalny efekt (np. direct booking live albo KSeF wysyłający faktury). Bez „fazy discovery” na kwartał.',
  },
  {
    num: '03',
    title: 'Wdrożenie w produkcji',
    description:
      'Krótkie iteracje, dostęp do stagingu, szkolenie 1–2 h dla Twojego zespołu. Nie zostawiam Cię z PDF-em „jak obsługiwać”.',
  },
  {
    num: '04',
    title: 'Pomiar po starcie',
    description:
      'Porównujemy „przed/po”: czas na obsługę, liczba maili, konwersja ze strony. Jeśli liczby nie siadają — poprawiamy, nie znikam.',
  },
]

export const faq: FaqItem[] = [
  {
    question: 'Ile to kosztuje i od czego zależy cena?',
    answer:
      'Projekty produkcyjne zaczynam od ok. 25 000 PLN netto — gdy ROI ma sens (zwykle odzysk 8+ h/mies. lub realna oszczędność na prowizjach / biurze). Po audycie dostajesz widełki i jedną rekomendację, nie trzy wyceny „na wyczucie”.',
  },
  {
    question: 'Czy podpisujemy NDA i kto jest właścicielem kodu?',
    answer:
      'Tak — NDA standardowo. Kod i konfiguracja po opłaceniu faktur należą do Ciebie, chyba że ustalimy inaczej (np. licencja na komponent open-source).',
  },
  {
    question: 'AI zastąpi mój zespół?',
    answer:
      'Nie. AI przejmuje powtarzalne pytania i kroki (concierge, draft faktury, raport). Człowiek zostaje przy decyzjach, sporach i compliance. Każdy agent ma audyt kroków — wiesz, skąd wzięła się odpowiedź.',
  },
  {
    question: 'Jak długo trwa pierwsze wdrożenie?',
    answer:
      'Landing + formularz: 2–4 tygodnie. Direct booking / panel z integracjami: zwykle 6–12 tygodni, zależnie od API (Previo, KSeF, smart lock). Na audycie podam konkret dla Twojego stosu.',
  },
  {
    question: 'Co jeśli już mam agencję / innego developera?',
    answer:
      'Mogę wejść w istniejący kod (Astro, React, Next) albo zbudować moduł obok — np. concierge albo eksport JPK. Bez przepisywania wszystkiego „bo tak ładniej”.',
  },
  {
    question: 'Czy obsługujesz firmy spoza Trójmiasta?',
    answer:
      'Tak — zdalnie w całej Polsce. On-site w Gdańsku/Gdyni/Sopocie, gdy potrzebujesz warsztatu z zespołem na miejscu.',
  },
]

export const testimonials: Testimonial[] = [
  {
    quote:
      'Concierge przejął większość pytań o dojazd i kod — nie siedzę już na WhatsApp do północy. Szacuję 10 godzin miesięcznie mniej na tym samym wolumenie gości.',
    role: 'Operator najmu krótkoterminowego',
    company: '36 apartamentów, Gdańsk',
    placeholder: true,
  },
  {
    quote:
      'Faktury i JPK w jednym miejscu zamiast Excela i trzech programów. Zamknięcie miesiąca to klik, nie weekend.',
    role: 'Właściciel JDG',
    company: 'Usługi B2B',
    placeholder: true,
  },
  {
    quote:
      'Wreszcie widać, co agent zrobił krok po kroku — mogę to pokazać księgowej i nie tłumaczyć się z „ChatGPT coś napisał”.',
    role: 'Właściciel firmy usługowej',
    company: 'Zespół 8 osób',
    placeholder: true,
  },
]

export const caseNavLinks = projects.map((project, index) => ({
  href: `#project-${project.id}`,
  label: project.title,
  num: String(index + 1).padStart(2, '0'),
}))

export const contactFields = [
  { id: 'name', label: 'Imię', type: 'text' as const, required: true },
  { id: 'email', label: 'E-mail firmowy', type: 'email' as const, required: true },
  {
    id: 'message',
    label: 'Co dziś zjada najwięcej czasu?',
    type: 'textarea' as const,
    required: true,
  },
]

export const leadForm = {
  title: 'Krótki brief',
  placeholder: 'Np. 40 maili dziennie od gości, faktury w Excelu, brak rezerwacji na stronie…',
  submit: 'Wyślij brief',
  submitting: 'Wysyłam…',
  thanksTitle: 'Dzięki — mam kontekst',
  thanksBody: 'Odezwę się w jeden dzień roboczy z propozycją audytu i widełkami czasu.',
}
