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
  /** UV/CSS zoom when hero WebP is a letterboxed full-page screenshot */
  heroMediaFill?: { zoom: number; centerY: number }
  flagship?: boolean
  /** Stack i integracje — chipsy w case study (technologie + narzędzia zewnętrzne) */
  stack?: string[]
  /** Jak to działa — 3-5 kroków z perspektywy użytkownika/właściciela, w kolejności przepływu */
  howItWorks?: string[]
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

export type PricingPackage = {
  name: string
  range: string
  qualifier: string
  bestFor: string
  deliverables: string[]
  proof: string
  featured?: boolean
}

export type ContactField = {
  id: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
}

export const site = {
  name: 'Marcin Bochenek',
  role: 'Premium IT studio · systemy, automatyzacje, strony konwertujące',
  photo: '/images/marcin-bochenek.webp',
  photoAlt:
    'Marcin Bochenek — portret w okularach w oprawkach szylkretowych, uśmiech, biały t-shirt na jasnym tle',
  photoWidth: 1024,
  photoHeight: 1024,
  headline: ['Marcin', 'Bochenek'],
  subhead:
    'Projektuję i wdrażam systemy, które zdejmują pracę z właściciela: nowoczesna strona, która sprzedaje, mniej ręcznej obsługi, automatyzacje z kontrolą.',
  valueProp:
    'Buduję nowoczesne strony, które sprzedają — i narzędzia, które za nimi pracują w produkcji: direct booking, panele operacyjne, AI z kontrolą, pomiar przed/po.',
  aboutQuote:
    'Nie sprzedaję slajdów — wdrażam to, co działa w niedzielę o 23:00, gdy nikt z biura nie odbiera.',
  aboutLead:
    'Jestem builderem: najpierw liczę godziny i PLN, potem kod. React, Next.js, Astro, integracje i AI — mierzalne efekty po wdrożeniu, nie obietnice z pitch decka.',
  aboutAside:
    'Polska, zdalnie i on-site w Trójmieście. Odpowiadam w jeden dzień roboczy. Projekty od 25 000 PLN, gdy ROI ma sens po obu stronach — zwykle gdy odzyskujesz 8+ godzin miesięcznie lub realnie obniżasz koszt obsługi.',
  ctaPrimary: 'Umów 20-min audyt',
  ctaSecondary: 'Zobacz realizacje',
  ctaCalendly: 'Umów 20-min audyt',
  footerCta: {
    line1: '20 minut audytu',
    line2: 'ile godzin oddajesz sobie?',
  },
  email: import.meta.env.VITE_CONTACT_EMAIL || 'kontakt@bochen.studio',
  calendly: import.meta.env.VITE_CALENDLY_URL || '',
  github: 'https://github.com/BochenMint',
  location: 'Polska · zdalnie',
  responseTime: 'Odpowiedź w 1 dzień roboczy',
  icpBadge: 'Projekty od 25 000 PLN · właściciele i operatorzy',
}

export const navLinks = [
  { href: '#about', label: 'O mnie' },
  { href: '#services', label: 'Co robię' },
  { href: '#work', label: 'Realizacje' },
  { href: '#pricing', label: 'Pakiety' },
  { href: '#contact', label: 'Kontakt' },
]

export const menuLinks = [
  { href: '#about', label: 'O mnie', num: '01' },
  { href: '#services', label: 'Co robię', num: '02' },
  { href: '#work', label: 'Realizacje', num: '03' },
  { href: '#pricing', label: 'Pakiety', num: '04' },
  { href: '#contact', label: 'Kontakt', num: '05' },
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
    lead: 'Trzy filary: nowoczesna strona, która sprzedaje, mniej ręcznej roboty, AI pod kontrolą.',
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
  pricing: {
    num: '04',
    title: 'Pakiety i próg wejścia',
    lead: 'Widełki przed rozmową, żeby odsiać projekty bez sensu ekonomicznego i wejść od razu w liczby.',
  },
  testimonials: {
    num: '06',
    title: 'Dowód, nie deklaracje',
    lead: 'Zamiast wklejonych opinii — żywe wdrożenia, które klikniesz, i zasady, na jakich pracuję.',
  },
  faq: {
    num: '07',
    title: 'Pytania właścicieli firm',
    lead: 'To, o co pytasz przed pierwszą rozmową — odpowiedzi bez ściemy.',
  },
  contact: {
    num: '08',
    title: 'Kontakt',
    lead: 'Napisz, co dziś zjada czas — w audycie sprawdzimy, czy da się to odzyskać w 90 dni i czy budżet ma sens.',
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

export type ProofProduct = { name: string; url: string; live: boolean }

export const proofProducts: ProofProduct[] = [
  { name: 'Mint Apartments', url: 'https://mintapartments.pl', live: true },
  { name: 'Plumm', url: 'https://plumm.pl', live: true },
  // idrivecars.pl serwuje obecnie stronę parkingową (SEOHOST) — nie linkujemy jako „live", dopóki iDrive 2.0 nie wyjdzie na produkcję
  { name: 'iDrive Cars', url: '', live: false },
  { name: 'Agentic OS', url: '', live: false },
]

export const services = [
  {
    num: '01',
    title: 'Nowoczesna strona, która sprzedaje',
    description:
      'Landing lub strona firmowa pod konwersję: szybkość, techniczne SEO, formularze kwalifikujące leady zamiast ogólnego „napisz do nas”. Dla hoteli i najmu krótkoterminowego dochodzi direct booking jako specjalizacja — np. rezerwacja bez prowizji OTA (Previo).',
    tags: ['Konwersja', 'Astro / Next.js', 'SEO'],
    outcome: 'Strona, która realnie sprzedaje — nie wizytówka',
    timeline: '2–6 tygodni',
    from: 'od 25 000 PLN',
    deliverables: [
      'Projekt i wdrożenie strony (React / Astro / Next.js)',
      'Formularz kwalifikujący leady zamiast ogólnego kontaktu',
      'SEO techniczne i wydajność (Core Web Vitals)',
      'Pomiar konwersji po starcie i pierwsze poprawki',
    ],
  },
  {
    num: '02',
    title: 'Panel i integracje zamiast Excela',
    description:
      'Faktury, kalendarze, smart locki, eksporty JPK — jeden przepływ zamiast pięciu kartek i pięciu logowań. Zespół robi to samo w 10 minut, nie w 2 godziny w niedzielę.',
    tags: ['KSeF', 'PMS', 'Workflow'],
    outcome: 'Koniec z Excelem i pięcioma logowaniami',
    timeline: '6–12 tygodni',
    from: 'wycena po audycie',
    deliverables: [
      'Panel operacyjny lub integracja z istniejącym systemem',
      'Integracje: faktury / KSeF, kalendarze / PMS, smart locki, eksporty JPK',
      'Jeden przepływ danych zamiast osobnych logowań',
      'Staging i szkolenie zespołu przed startem',
    ],
  },
  {
    num: '03',
    title: 'AI, które zna Twoją ofertę',
    description:
      'Concierge 24/7, asystent księgowy, agenci z whitelistą narzędzi i pełnym audytem kroków. Mniej telefonów „gdzie jest kod?” — eskalacja do człowieka, gdy trzeba.',
    tags: ['Concierge', 'Asystent', 'Audyt'],
    outcome: 'Obsługa 24/7 bez powiększania zespołu',
    timeline: '4–10 tygodni',
    from: 'wycena po audycie',
    deliverables: [
      'Agent AI z whitelistą narzędzi i zdefiniowanym zakresem',
      'Log każdego kroku — audyt kto/co/dlaczego',
      'Eskalacja do człowieka przy niskiej pewności',
      'Szacowanie kosztów modeli przed wdrożeniem na produkcję',
    ],
  },
]

export const pricingPackages: PricingPackage[] = [
  {
    name: 'Audit Sprint',
    range: '2 500–6 000 PLN',
    qualifier: 'Gdy potrzebujesz decyzji, nie jeszcze jednego briefu.',
    bestFor:
      'Właściciel firmy ma stronę, proces lub pomysł na AI, ale nie wie, gdzie realnie uciekają pieniądze i czas.',
    deliverables: [
      'mapa lejka / procesu z wąskimi gardłami',
      'priorytety na 30/60/90 dni',
      'szacunek ROI i ryzyk integracji',
      'decyzja: wdrażać, odłożyć albo ciąć zakres',
    ],
    proof: 'Kwota sprintu może zostać zaliczona na wdrożenie, jeśli obie strony widzą sens po audycie.',
  },
  {
    name: 'Conversion Build',
    range: '25 000–60 000 PLN',
    qualifier: 'Najlepszy próg startu dla strony, która ma sprzedawać, nie tylko wyglądać.',
    bestFor:
      'Firma premium potrzebuje nowej strony, direct bookingu, formularzy kwalifikujących lub ścieżki sprzedaży z analityką.',
    deliverables: [
      'strategia komunikacji i struktura strony',
      'projekt i wdrożenie React / Astro / Next.js',
      'formularz leadowy, CTA, SEO techniczne',
      'pomiar konwersji i poprawki po starcie',
    ],
    proof: 'Zakres zamykamy na mierzalnym celu: lead, rezerwacja, zapytanie albo krótsza obsługa.',
    featured: true,
  },
  {
    name: 'Ops System',
    range: '60 000–180 000+ PLN',
    qualifier: 'Dla firm, w których problemem jest operacja, nie tylko marketing.',
    bestFor:
      'Masz sprzedaż, zespół i powtarzalny proces: faktury, rezerwacje, raporty, obsługa klienta, wewnętrzne workflow.',
    deliverables: [
      'panel operacyjny lub aplikacja B2B',
      'integracje API, płatności, kalendarze, KSeF / PMS',
      'AI z ograniczeniami, logami i eskalacją do człowieka',
      'staging, szkolenie zespołu i pomiar po wdrożeniu',
    ],
    proof: 'Przed kodem ustalamy metryki „przed/po”, bo przy tym budżecie ładny interfejs bez wyniku to za mało.',
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
    heroMediaFill: { zoom: 1, centerY: 0.5 },
    stack: ['Astro', 'React', 'Previo (PMS + booking engine)', 'Tedee / Nuki', 'WhatsApp', 'SEO wielojęzyczne'],
    howItWorks: [
      'Gość wybiera apartament i termin — kalendarz i ceny na żywo z Previo',
      'Płaci online na Twojej domenie — taniej niż na OTA',
      'Dostaje kod do zamka Tedee/Nuki i melduje się sam, o dowolnej porze',
      'Concierge AI odpowiada na pytania w 7 językach, eskaluje do człowieka gdy trzeba',
      'Właściciel widzi rezerwacje i rozliczenia w module MINTAX',
    ],
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
    stack: ['Next.js', 'TypeScript', 'KSeF', 'JPK-V7', 'AI asystent podatkowy', 'app.plumm.pl'],
    howItWorks: [
      'Wystawiasz fakturę — trafia do KSeF automatycznie, od razu zgodna z przepisami',
      'Plumm liczy PIT, VAT i ZUS na bieżąco — widzisz zobowiązania przed terminem',
      'Zamykasz miesiąc i wysyłasz JPK-V7 jednym kliknięciem z panelu',
      'Masz pytanie podatkowe — pytasz AI asystenta po polsku, przy trudniejszej sprawie rozmowa trafia do księgowej',
    ],
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: `idrivecars.pl · przed publicznym startem`,
    url: '#',
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
    stack: ['Next.js 15', 'MDX', 'Sharp (WEBP)', 'Sitemap / SEO techniczne'],
    howItWorks: [
      'Piszesz tekst w MDX — treść trzymana w repozytorium, wersjonowana jak kod',
      'Zdjęcia i galerie przechodzą przez Sharp — automatyczna konwersja do WEBP',
      'Publikujesz z repo — bez WordPressa, wtyczek i aktualizacji, które coś psują',
      'Artykuł trafia do sitemapy i jest gotowy pod SEO od pierwszej minuty',
    ],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'system wewnętrzny · B2B',
    url: '#agentic',
    tagline: 'Powtarzalne procesy · audyt każdego kroku',
    description:
      'Orkiestracja agentów AI: workflow, narzędzia na whitelistcie, human-in-the-loop. Szacunek: 5–10 h/tydz.* mniej na raportach, synchronizacjach i powtarzalnych zapytaniach — z logiem kto/co/dlaczego.',
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
    tags: ['AI', 'Workflow', 'Automatyzacja'],
    imageScene: 'hero',
    stack: ['Silnik workflow', 'Tool calling', 'Whitelist narzędzi', 'Kolejki zadań', 'Human-in-the-loop', 'Szacowanie kosztów modeli'],
    howItWorks: [
      'Agent dostaje zadanie i listę dozwolonych narzędzi — nic poza whitelistą',
      'Wykonuje kroki, a każdy krok trafia do logu — wiadomo kto/co/dlaczego',
      'Przy niskiej pewności system oddaje decyzję człowiekowi zamiast zgadywać',
      'Koszt modeli jest szacowany na bieżąco — bez niespodzianek na fakturze',
    ],
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

// Brak prawdziwych opinii → nie pokazujemy fałszywych. Sekcja „Dowód” renderuje liveProof + trustPoints.
export const testimonials: Testimonial[] = []

// Żywe wdrożenia — klikalne, weryfikowalne (zamiast wymyślonych cytatów).
export type LiveProof = { name: string; url: string; result: string; tag: string }

export const liveProof: LiveProof[] = [
  {
    name: 'Mint Apartments',
    url: 'https://mintapartments.pl',
    result:
      '36 apartamentów na direct bookingu — gość płaci 10–15% mniej niż na OTA, check-in 24/7, concierge AI w 7 językach.',
    tag: 'Hospitality',
  },
  {
    name: 'Plumm',
    url: 'https://plumm.pl',
    result:
      'Księgowość JDG w jednym panelu: faktury KSeF, JPK i asystent podatkowy zamiast Excela i osobnego biura.',
    tag: 'SaaS',
  },
  // iDrive wróci tu po publicznym starcie — idrivecars.pl to dziś strona parkingowa,
  // a sekcja obiecuje „kliknij i sprawdź". Zero linków do parkingu.
]

// Zasady współpracy = realne sygnały zaufania pod ticket 25k+ (zamiast pustych frazesów).
export type TrustPoint = { title: string; description: string }

export const trustPoints: TrustPoint[] = [
  {
    title: 'Płacisz, gdy ROI się spina',
    description:
      'Projekt zaczynam, gdy w audycie policzymy realny odzysk godzin lub oszczędność. Jeśli się nie opłaca — mówię to wprost.',
  },
  {
    title: 'Kod należy do Ciebie',
    description:
      'NDA standardowo. Po opłaceniu faktur kod i konfiguracja są Twoje — bez vendor lock-inu „na zawsze”.',
  },
  {
    title: 'Wdrażam i zostaję na liczbach',
    description:
      'Po starcie porównujemy „przed/po”. Jeśli efekty nie siadają — poprawiam. Jeden człowiek odpowiada za całość.',
  },
  {
    title: 'Metryki audytowalne po rozmowie',
    description:
      'Nie wymyślam referencji. Po callu weryfikujemy: wolumen zapytań, czas obsługi, prowizje, koszt ręcznej pracy i ryzyka integracji.',
  },
]

export const caseNavLinks = projects.map((project, index) => ({
  href: `#project-${project.id}`,
  label: project.title,
  num: String(index + 1).padStart(2, '0'),
}))

export const contactFields: ContactField[] = [
  { id: 'name', label: 'Imię i nazwisko', type: 'text', required: true },
  { id: 'email', label: 'E-mail firmowy', type: 'email', required: true },
  {
    id: 'company',
    label: 'Firma / strona',
    type: 'text',
    required: true,
    placeholder: 'Nazwa firmy albo adres obecnej strony',
  },
  {
    id: 'projectType',
    label: 'Co chcesz poprawić',
    type: 'select',
    required: true,
    options: [
      'Strona / landing, który ma lepiej sprzedawać',
      'Direct booking / rezerwacje / płatności',
      'Panel operacyjny lub integracje',
      'AI concierge / automatyzacja obsługi',
      'Audyt i priorytetyzacja przed wdrożeniem',
    ],
  },
  {
    id: 'budget',
    label: 'Budżet netto',
    type: 'select',
    required: true,
    options: [
      '2 500–6 000 PLN — audyt',
      '25 000–60 000 PLN — strona / konwersja',
      '60 000–180 000+ PLN — system / integracje',
      'Nie wiem — chcę policzyć ROI',
    ],
  },
  {
    id: 'timeline',
    label: 'Kiedy chcesz startować',
    type: 'select',
    required: true,
    options: ['Teraz / do 30 dni', '1–3 miesiące', '3+ miesiące', 'Najpierw audyt'],
  },
  {
    id: 'message',
    label: 'Co dziś zjada czas lub pieniądze?',
    type: 'textarea' as const,
    required: true,
    placeholder:
      'Np. 40 maili dziennie od gości, faktury w Excelu, brak rezerwacji na stronie, za dużo ręcznej obsługi…',
  },
]

export const leadForm = {
  title: 'Brief kwalifikacyjny',
  intro:
    '6 pól zamiast długiej ankiety. Im konkretniej opiszesz koszt problemu, tym szybciej odfiltrujemy projekty bez ROI.',
  submit: 'Wyślij brief',
  submitting: 'Wysyłam…',
  thanksTitle: 'Dzięki — mam kontekst',
  thanksBody: 'Odezwę się w jeden dzień roboczy z propozycją audytu i widełkami czasu.',
}

// ── Multi-step discovery wizard (v3 intake) ────────────────────────────────
// Appended for the v3 "PLEATED LIGHT" contact wizard. v1 leadForm/contactFields
// above stay untouched — this is a separate, richer qualification flow.

export type IntakeField = {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  required: boolean
  placeholder?: string
  hint?: string
  options?: string[]
}

export const intakeSteps: { id: string; title: string; hint?: string; fields: IntakeField[] }[] = [
  {
    id: 'company',
    title: 'Twoja firma',
    hint: 'Krótko — kim jesteście i ile osób ogarnia dziś operację.',
    fields: [
      {
        id: 'industry',
        label: 'Branża',
        type: 'select',
        required: true,
        options: [
          'Hotele / najem krótkoterminowy',
          'Usługi profesjonalne / B2B',
          'E-commerce / sprzedaż',
          'SaaS / produkt cyfrowy',
          'Inna branża',
        ],
      },
      {
        id: 'companyName',
        label: 'Firma / strona',
        type: 'text',
        required: true,
        placeholder: 'Nazwa firmy lub adres www',
      },
      {
        id: 'teamSize',
        label: 'Wielkość zespołu',
        type: 'select',
        required: true,
        options: ['Tylko ja', '2–5 osób', '6–20 osób', '20+ osób'],
      },
    ],
  },
  {
    id: 'problem',
    title: 'Problem',
    hint: 'Gdzie dziś realnie boli — bez tego nie policzymy ROI.',
    fields: [
      {
        id: 'projectType',
        label: 'Co chcesz poprawić',
        type: 'select',
        required: true,
        options: [
          'Strona / landing, który ma lepiej sprzedawać',
          'Direct booking / rezerwacje / płatności',
          'Panel operacyjny lub integracje',
          'AI concierge / automatyzacja obsługi',
          'Audyt i priorytetyzacja przed wdrożeniem',
        ],
      },
      {
        id: 'pain',
        label: 'Co dziś zjada czas lub pieniądze?',
        type: 'textarea',
        required: true,
        placeholder:
          'Np. 40 maili dziennie od gości, faktury w Excelu, brak rezerwacji na stronie, za dużo ręcznej obsługi…',
      },
      {
        id: 'currentTools',
        label: 'Z czego korzystasz dziś?',
        type: 'text',
        required: false,
        placeholder: 'Excel, Booking.com, wFirma, WordPress…',
      },
    ],
  },
  {
    id: 'scale',
    title: 'Skala',
    hint: 'Widełki budżetu i czasu, żeby nie tracić dnia na dopasowanie.',
    fields: [
      {
        id: 'budget',
        label: 'Budżet netto',
        type: 'select',
        required: true,
        options: [
          '2 500–6 000 PLN — audyt',
          '25 000–60 000 PLN — strona / konwersja',
          '60 000–180 000+ PLN — system / integracje',
          'Nie wiem — chcę policzyć ROI',
        ],
      },
      {
        id: 'timeline',
        label: 'Kiedy chcesz startować',
        type: 'select',
        required: true,
        options: ['Teraz / do 30 dni', '1–3 miesiące', '3+ miesiące', 'Najpierw audyt'],
      },
      {
        id: 'successMetric',
        label: 'Po czym poznasz, że projekt się udał?',
        type: 'select',
        required: true,
        options: [
          'Więcej rezerwacji / sprzedaży z własnej strony',
          'Mniej godzin ręcznej obsługi',
          'Niższy koszt obsługi klienta',
          'Porządek w procesach i danych',
          'Jeszcze nie wiem — chcę to policzyć',
        ],
      },
    ],
  },
  {
    id: 'contact',
    title: 'Kontakt',
    hint: 'Dokąd mam odesłać pierwszy szkic i widełki.',
    fields: [
      { id: 'name', label: 'Imię i nazwisko', type: 'text', required: true },
      { id: 'email', label: 'E-mail firmowy', type: 'email', required: true },
      {
        id: 'phone',
        label: 'Telefon (opcjonalnie)',
        type: 'tel',
        required: false,
        placeholder: '+48 …',
      },
    ],
  },
]

export const intakeCopy = {
  title: 'Brief kwalifikacyjny',
  next: 'Dalej',
  back: 'Wstecz',
  submit: 'Wyślij brief',
  submitting: 'Wysyłam…',
  thanksTitle: 'Dzięki — mam kontekst',
  thanksBody: `W ciągu 1 dnia roboczego dostaniesz ode mnie pierwszy szkic rozwiązania — z proponowanym zakresem i widełkami — oraz termin 20-minutowego audytu.`,
}
