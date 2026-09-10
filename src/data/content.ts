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

/** Ignoruje placeholdery z .env.example — puste / cal.com root nie są linkiem audytu. */
function normalizeCalendlyUrl(raw: string | undefined): string {
  const url = (raw || '').trim()
  if (!url) return ''

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

    const placeholderSlug = /\/(twoj-link|your-user)(\/|$)/i.test(pathname)
    if (placeholderSlug) return ''

    return url
  } catch {
    return ''
  }
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
    'Projektuję i wdrażam systemy, które zdejmują pracę z właściciela: strona, która zbiera zapytania, mniej ręcznej obsługi, automatyzacje z kontrolą człowieka.',
  valueProp:
    'Buduję strony, które zbierają zapytania i sprzedają — oraz narzędzia, które za nimi pracują: rezerwacje na własnej stronie, panel zamiast Excela, automatyzacja z kontrolą człowieka, pomiar przed i po.',
  aboutQuote:
    'Nie sprzedaję slajdów — wdrażam to, co działa poza godzinami biura, gdy nikt z zespołu nie odbiera.',
  aboutLead:
    'Jestem builderem: najpierw liczę godziny i PLN, potem kod. Strony, panele i automatyzacje — mierzalne efekty po wdrożeniu, nie obietnice z prezentacji.',
  aboutAside:
    'Polska, zdalnie i on-site w Trójmieście. Odpowiadam w jeden dzień roboczy. Mała firma dostaje sensowną stronę wizytówkę od 2 000 PLN (do 5 podstron, bez szablonu z marketplace); strona firmowa z lejkiem konwersji i integracjami — od 8 000 PLN; platformy rezerwacyjne, panele i API — od 25 000 PLN, gdy ROI ma sens po obu stronach.',
  ctaPrimary: 'Umów 20-min audyt',
  ctaSecondary: 'Zobacz realizacje',
  ctaCalendly: 'Umów 20-min audyt',
  footerCta: {
    line1: '20 minut audytu',
    line2: 'ile godzin oddajesz sobie?',
  },
  email: import.meta.env.VITE_CONTACT_EMAIL || 'kontakt@marcinbochenek.com',
  calendly: normalizeCalendlyUrl(import.meta.env.VITE_CALENDLY_URL),
  github: 'https://github.com/BochenMint',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://marcinbochenek.com',
  portfolioUrl: import.meta.env.VITE_PORTFOLIO_URL || 'https://marcinbochenek.com',
  mbAiUrl: import.meta.env.VITE_MB_AI_URL || 'https://mb-ai.pl',
  gameUrl: import.meta.env.VITE_GAME_URL || 'https://gra.marcinbochenek.com',
  location: 'Polska · zdalnie',
  responseTime: 'Odpowiedź w 1 dzień roboczy',
  icpBadge: 'Strony od 2 000 PLN · systemy od 8 000 PLN',
  icpBadgeShort: 'Strony od 2 000 PLN · systemy od 8 000 PLN',
  minBudget: '2 000 PLN',
}

export const navLinks = [
  { href: '#o-mnie', label: 'O mnie' },
  { href: '#uslugi', label: 'Co robię' },
  { href: '#realizacje', label: 'Realizacje' },
  { href: '#cennik', label: 'Pakiety' },
  { href: '#kontakt', label: 'Kontakt' },
]

export const menuLinks = [
  { href: '#o-mnie', label: 'O mnie', num: '01' },
  { href: '#uslugi', label: 'Co robię', num: '02' },
  { href: '#realizacje', label: 'Realizacje', num: '03' },
  { href: '#cennik', label: 'Pakiety', num: '04' },
  { href: '#kontakt', label: 'Kontakt', num: '05' },
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
    lead: 'Widełki przed rozmową — od wizytówki dla małej firmy po system operacyjny. Każdy pakiet ma jasny zakres stron i funkcji; bez ukrytych kosztów i bez szablonu z marketplace.',
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
    hint: 'Asystent dla gości + rezerwacje na własnej stronie',
  },
  {
    value: '10–15%',
    label: 'taniej dla gościa vs Booking/Airbnb',
    hint: 'Mint Apartments — rezerwacje na własnej stronie',
  },
  {
    value: '12–20 h',
    label: 'mniej na fakturach i deklaracjach / mies.*',
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
    title: 'Strona firmowa i lejek konwersji',
    description:
      'Dla małej firmy — solidna wizytówka z formularzem i jasnym wezwaniem do działania, żeby klienci trafiali do Ciebie, nie w próżnię. Gdy rośniesz — strona pod sprzedaż, kwalifikacja zapytań i rezerwacje na własnej domenie (taniej niż na Booking.com). Wizytówka to nie pełny silnik sprzedaży; rozbudowę planujemy od początku.',
    tags: ['Konwersja', 'Szybka strona', 'Widoczność w Google'],
    outcome: 'Od wizytówki po stronę, która sprzedaje',
    timeline: '2–6 tygodni',
    from: 'od 2 000 PLN',
    deliverables: [
      'Do 5 podstron (np. start, oferta, o firmie, realizacje, kontakt) — projekt pod Twoją markę, nie szablon z marketplace',
      'Formularz kontaktowy z powiadomieniami — kwalifikacja zapytań w pakiecie Launch',
      'Szybkość na telefonie, podstawowe SEO on-page i pomiar zapytań po starcie',
      'Ścieżka rozbudowy: landingi, rezerwacje na własnej stronie, pełny lejek — w pakiecie Launch',
    ],
  },
  {
    num: '02',
    title: 'Panel i integracje zamiast Excela',
    description:
      'Faktury, kalendarze rezerwacji, zamki do drzwi, deklaracje podatkowe — jeden przepływ zamiast pięciu kartek i pięciu logowań. Zespół robi to samo w 10 minut, nie w dwóch godzinach ręcznej obsługi.',
    tags: ['E-faktury', 'Kalendarze', 'Jeden proces'],
    outcome: 'Koniec z Excelem i pięcioma logowaniami',
    timeline: '6–12 tygodni',
    from: 'wycena po audycie',
    deliverables: [
      'Panel operacyjny lub integracja z programem, którego już używasz',
      'Połączenia: e-faktury, kalendarze rezerwacji, zamki, wysyłka deklaracji do urzędu',
      'Jeden przepływ danych zamiast osobnych logowań',
      'Wersja testowa i szkolenie zespołu przed startem na żywo',
    ],
  },
  {
    num: '03',
    title: 'AI, które zna Twoją ofertę',
    description:
      'Asystent dla gości 24/7, pomocnik księgowy, automatyzacja powtarzalnych zadań — z kontrolą człowieka i pełnym zapisem każdego kroku. Mniej telefonów „gdzie jest kod?” — eskalacja do człowieka, gdy trzeba.',
    tags: ['Asystent 24/7', 'Obsługa klienta', 'Pełny audyt'],
    outcome: 'Obsługa 24/7 bez powiększania zespołu',
    timeline: '4–10 tygodni',
    from: 'wycena po audycie',
    deliverables: [
      'Asystent AI z jasno określonym zakresem — tylko dozwolone akcje',
      'Zapis każdego kroku — wiadomo kto, co i dlaczego zrobił',
      'Eskalacja do człowieka przy niskiej pewności',
      'Szacunek kosztów przed wdrożeniem na żywo',
    ],
  },
]

export const pricingPackages: PricingPackage[] = [
  {
    name: 'Audit Sprint',
    range: 'od 1 500 PLN',
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
    name: 'Start',
    range: 'od 2 000 PLN',
    qualifier:
      'Strona wizytówka lub landing do 5 podstron — custom pod Twoją markę, nie szablon z marketplace.',
    bestFor:
      'Mała firma, freelancer lub lokalny biznes: potrzebujesz profesjonalnej strony, formularza kontaktowego i jasnego CTA — na start, bez integracji ani lejka konwersji.',
    deliverables: [
      'do 5 podstron: start, oferta, o firmie, realizacje/kontakt (zakres ustalamy na audycie)',
      'formularz kontaktowy z powiadomieniami i podstawową ochroną przed spamem',
      'szybkość na telefonie (Core Web Vitals) i SEO on-page',
      'projekt tak, żeby dało się go rozbudować bez przepisywania od zera',
    ],
    proof:
      'Poza zakresem: copywriting od zera, blog, integracje z CRM, kalendarzem czy rezerwacjami — to pakiet Launch. Gdy zapytań przybywa, rozszerzamy o lejek i integracje.',
  },
  {
    name: 'Launch',
    range: 'od 8 000 PLN',
    qualifier: 'Gdy strona ma sprzedawać i mierzyć wynik — nie tylko informować.',
    bestFor:
      'Firma potrzebuje strony firmowej z lejkiem konwersji: formularz spływający do CRM, kalendarz, techniczne SEO i pomiar zapytań od kliknięcia do leada.',
    deliverables: [
      'strategia komunikacji i struktura strony pod sprzedaż',
      'integracje: formularz → CRM, kalendarz/booking, techniczne SEO',
      'wezwania do działania i ścieżka kwalifikacji zapytań',
      'pomiar konwersji i poprawki po starcie',
    ],
    proof: 'Zakres zamykamy na mierzalnym celu: lead, rezerwacja, zapytanie albo krótsza obsługa.',
  },
  {
    name: 'Platforma',
    range: 'od 25 000 PLN',
    qualifier: 'Dla firm, w których problemem jest operacja, nie tylko marketing.',
    bestFor:
      'Masz sprzedaż, zespół i powtarzalny proces: rezerwacje, panel operacyjny, API, wielojęzyczność, testy automatyczne.',
    deliverables: [
      'booking / panel operacyjny lub aplikacja dla zespołu',
      'API i połączenia z płatnościami, kalendarzami, e-fakturami i systemami rezerwacji',
      'wielojęzyczność (PL/EN/UA i więcej) oraz testy automatyczne przed startem',
      'wersja testowa, szkolenie zespołu i pomiar po wdrożeniu',
    ],
    proof: 'Przed kodem ustalamy metryki „przed/po”, bo przy tym budżecie ładny interfejs bez wyniku to za mało.',
    featured: true,
  },
  {
    name: 'AI Ops',
    range: 'od 3 000 PLN / mies.',
    qualifier: 'Agenci, automatyzacje, utrzymanie i rozwój — z kontrolą człowieka.',
    bestFor:
      'Masz już stronę lub system i chcesz agentów/automatyzacje działające na produkcji, plus kogoś, kto to utrzymuje i rozwija miesiąc po miesiącu.',
    deliverables: [
      'asystent/agent AI z jasno określonym zakresem dozwolonych akcji',
      'zapis każdego kroku i eskalacja do człowieka przy niskiej pewności',
      'utrzymanie, monitoring i poprawki po starcie',
      'rozwój funkcji w kolejnych miesiącach na podstawie danych z produkcji',
    ],
    proof: 'Rozliczenie miesięczne — wypowiedzenie w dowolnym momencie, bez umowy na czas określony.',
  },
]

export const projects: Project[] = [
  {
    id: 'mint',
    title: 'Mint Apartments',
    domain: 'mintapartments.pl',
    url: 'https://mintapartments.pl',
    tagline: '36 apartamentów · rezerwacje na własnej stronie · asystent dla gości 24/7',
    description:
      'System dla operatora najmu krótkoterminowego: rezerwacja na własnej domenie (10–15% taniej niż na Booking.com), samodzielny check-in Tedee/Nuki, asystent dla gości w 7 językach. Szacunek: 8–15 h/mies.* mniej na powtarzalnych pytaniach gości.',
    client: 'Mint Apartments — operator 36 apartamentów w Gdańsku (od 2017)',
    outcome:
      'Gość płaci mniej niż na portalu rezerwacyjnym, melduje się o dowolnej porze, zespół prowadzi 3 dzielnice z jednego panelu Previo. Prowizja portalu zostaje u Ciebie — jako marża, nie koszt pośrednika.',
    pain: 'Prowizje portali (Booking, Airbnb) zjadały marżę. Oferta rozproszona po językach. Check-in wymagał recepcji. Stara strona nie nadążała za telefonami i wyszukiwarką.',
    contribution:
      'Szybka strona + panel rezerwacji Previo, asystent dla gości z WhatsApp, zamki Tedee/Nuki, rozliczenia do Plumm, wersje językowe.',
    decisions: [
      'Rezerwacja na każdej karcie — ta sama noc taniej, bez ukrytej prowizji portalu',
      'Asystent z kontekstem apartamentu — nie generyczny czat',
      'Previo zamiast budowy własnego systemu kanałów sprzedaży',
    ],
    tags: ['Noclegi', 'Rezerwacje własne', 'Asystent dla gości'],
    flagship: true,
    heroMediaFill: { zoom: 1, centerY: 0.5 },
    stack: ['Astro', 'React', 'Previo (rezerwacje + kalendarz)', 'Tedee / Nuki', 'WhatsApp', 'Wielojęzyczność'],
    howItWorks: [
      'Gość wybiera apartament i termin — kalendarz i ceny na żywo z Previo',
      'Płaci online na Twojej stronie — taniej niż na Booking.com',
      'Dostaje kod do zamka Tedee/Nuki i melduje się sam, o dowolnej porze',
      'Asystent odpowiada na pytania w 7 językach, przekazuje sprawę człowiekowi, gdy trzeba',
      'Właściciel widzi rezerwacje w Previo — faktury i rozliczenia trafiają do Plumm',
    ],
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: 'Panel firmy · księgowość · CRM · AI',
    description:
      'Polska platforma online: księgowość dla JDG i spółek, asystent podatkowy, CRM i poczta — jeden panel zamiast Excela, osobnych programów i biura 300–600 zł/mies. E-faktury do urzędu, PIT/VAT/ZUS, deklaracje jednym kliknięciem. Typowo 12–20 h/mies.* mniej na papierologii przy regularnym wolumenie faktur.',
    client: 'PLUMM Sp. z o.o. — własny produkt online',
    outcome:
      'Jeden panel po zalogowaniu: e-faktury, CRM, poczta i rozliczenia w jednym miejscu. Terminy w kalendarzu, deklaracje do urzędu jednym kliknięciem. Odpowiedź podatkowa w minutach — nie po 2 dniach od biura.',
    pain: 'Faktury, KPiR, ZUS i deklaracje w osobnych narzędziach. Biuro drogie i wolne. Jedno przeoczone zgłoszenie = kara.',
    contribution:
      'Strona, cennik, panel app.plumm.pl: e-faktury, CRM, poczta firmowa, asystent podatkowy z eskalacją do księgowej, plany 0–2000+ zł/mies.',
    decisions: [
      'Jedna aplikacja — faktury, rozliczenia i asystent w jednym miejscu',
      'E-faktury do urzędu od podstaw — nie „dodatek za dopłatą”',
      'Asystent + księgowa przy trudnych sprawach — szybkość bez ryzyka',
    ],
    tags: ['Księgowość online', 'E-faktury', 'JDG'],
    stack: ['Next.js', 'TypeScript', 'KSeF', 'Deklaracje JPK', 'CRM', 'Poczta firmowa', 'Asystent podatkowy', 'app.plumm.pl'],
    howItWorks: [
      'Wystawiasz fakturę — trafia do urzędu automatycznie, od razu zgodna z przepisami',
      'Plumm liczy PIT, VAT i ZUS na bieżąco — widzisz zobowiązania przed terminem',
      'Zamykasz miesiąc i wysyłasz deklarację do urzędu jednym kliknięciem z panelu',
      'Masz pytanie podatkowe — pytasz asystenta po polsku, przy trudniejszej sprawie rozmowa trafia do księgowej',
    ],
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: `idrivecars.pl · przed publicznym startem`,
    url: '#',
    tagline: 'Blog motoryzacyjny · publikacja bez WordPressa',
    description:
      'Autorski dziennik: testy, zoptymalizowane zdjęcia, szybka strona. Łatwiejsza publikacja i lepsza widoczność w Google = więcej wejść z wyszukiwarki na ten sam wysiłek redakcyjny.',
    client: 'Własny produkt medialny',
    outcome:
      'Setki artykułów w jednej szybkiej witrynie. Publikacja z jednego miejsca — bez wtyczek, które psują się po aktualizacji.',
    pain: 'Word, ciężkie zdjęcia, brak szablonu. Każdy tekst trwał za długo od pomysłu do opublikowania.',
    contribution:
      'Szybka strona, edytor treści, automatyczna optymalizacja zdjęć, mapa strony pod wyszukiwarkę.',
    decisions: [
      'Treść w jednym miejscu — pełna kontrola nad wersjami',
      'Lekkie zdjęcia i kuratorowane galerie — szybkość na telefonie',
      'Jeden adres strony pod wyszukiwarkę',
    ],
    tags: ['Media', 'Widoczność w Google', 'Szybka strona'],
    imageScene: 'hero',
    stack: ['Next.js', 'MDX', 'Optymalizacja zdjęć', 'Mapa strony'],
    howItWorks: [
      'Piszesz tekst w edytorze — treść jest bezpiecznie przechowywana i wersjonowana',
      'Zdjęcia i galerie są automatycznie kompresowane — szybkie ładowanie na telefonie',
      'Publikujesz bez WordPressa, wtyczek i aktualizacji, które coś psują',
      'Artykuł od razu gotowy pod wyszukiwarkę Google',
    ],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'system wewnętrzny · B2B',
    url: '#agentic',
    tagline: 'Powtarzalne procesy · audyt każdego kroku',
    description:
      'Automatyzacja powtarzalnej pracy z kontrolą człowieka: jasno określone dozwolone akcje, zapis każdego kroku. Szacunek: 5–10 h/tydz.* mniej na raportach, synchronizacjach i powtarzalnych zapytaniach — z pełną historią kto/co/dlaczego.',
    client: 'Produkt wewnętrzny · automatyzacja dla firm',
    outcome:
      'Zespół odpuszcza ręczne kopiuj-wklej. Każdy krok zapisany — audyt bez „czarnej skrzynki” czatu.',
    pain: 'Polecenia w czacie bez odpowiedzialności. Klient nie wdroży tego u siebie bez zapisów i limitów.',
    contribution:
      'Silnik procesów, połączenia z zewnętrznymi systemami, kolejki zadań, kontrola człowieka, szacunek kosztów.',
    decisions: [
      'Zapis każdego kroku — nie tylko końcowa odpowiedź',
      'Tylko dozwolone akcje — mniej ryzyka niż pełny dostęp do systemu',
      'Człowiek przejmuje przy niskiej pewności',
    ],
    tags: ['Automatyzacja', 'Kontrola człowieka', 'Audyt'],
    imageScene: 'hero',
    stack: ['Silnik procesów', 'Integracje', 'Dozwolone akcje', 'Kolejki zadań', 'Kontrola człowieka', 'Szacunek kosztów'],
    howItWorks: [
      'Asystent dostaje zadanie i listę dozwolonych akcji — nic poza ustalonym zakresem',
      'Wykonuje kroki, a każdy trafia do zapisu — wiadomo kto, co i dlaczego',
      'Przy niskiej pewności system oddaje decyzję człowiekowi zamiast zgadywać',
      'Koszt działania jest szacowany na bieżąco — bez niespodzianek na fakturze',
    ],
  },
]

export const process: ProcessStep[] = [
  {
    num: '01',
    title: '20-min audyt (bezpłatnie)',
    description:
      'Rozmawiamy o tym, co dziś zjada czas: telefony, faktury, rezerwacje, raporty. Na koniec: szacunek godzin do odzyskania i który pakiet ma sens — od wizytówki po system operacyjny.',
  },
  {
    num: '02',
    title: 'Plan na 90 dni',
    description:
      'Jeden dokument: zakres, integracje, pierwszy mierzalny efekt (np. rezerwacje na żywo albo e-faktury wysyłane do urzędu). Bez „fazy odkrywania” na kwartał.',
  },
  {
    num: '03',
    title: 'Wdrożenie w produkcji',
    description:
      'Krótkie iteracje, dostęp do wersji testowej przed startem, szkolenie 1–2 h dla Twojego zespołu. Nie zostawiam Cię z PDF-em „jak obsługiwać”.',
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
      'Strona wizytówka lub landing (do 5 podstron, formularz, podstawowe SEO): od 2 000 PLN — pakiet Start. Strona firmowa z lejkiem konwersji i integracjami (formularz → CRM, kalendarz, techniczne SEO, pomiar): od 8 000 PLN — pakiet Launch. Platforma: rezerwacje na własnej stronie, panel operacyjny, API, wielojęzyczność: od 25 000 PLN — gdy zwrot ma sens (odzysk godzin obsługi, prowizje portali, koszt ręcznej pracy). AI Ops — agenci i automatyzacje z utrzymaniem: od 3 000 PLN/mies. Po audycie dostajesz widełki i jedną rekomendację, nie trzy wyceny „na wyczucie”.',
  },
  {
    question: 'Czy podpisujemy NDA i kto jest właścicielem kodu?',
    answer:
      'Tak — NDA standardowo. Kod i konfiguracja po opłaceniu faktur należą do Ciebie, chyba że ustalimy inaczej (np. licencja na komponent open-source).',
  },
  {
    question: 'AI zastąpi mój zespół?',
    answer:
      'Nie. Asystent przejmuje powtarzalne pytania i kroki (odpowiedzi gościom, szkic faktury, raport). Człowiek zostaje przy decyzjach, sporach i sprawach urzędowych. Każda automatyzacja ma zapis kroków — wiesz, skąd wzięła się odpowiedź.',
  },
  {
    question: 'Jak długo trwa pierwsze wdrożenie?',
    answer:
      'Strona z formularzem: 2–4 tygodnie. Rezerwacje na własnej stronie / panel z połączeniami do innych programów: zwykle 6–12 tygodni, zależnie od tego, z czym łączymy (Previo, e-faktury, zamki do drzwi). Na audycie podam konkret dla Twojego przypadku.',
  },
  {
    question: 'Co jeśli już mam agencję / innego developera?',
    answer:
      'Mogę wejść w istniejącą stronę albo zbudować moduł obok — np. asystent dla gości albo eksport deklaracji. Bez przepisywania wszystkiego „bo tak ładniej”.',
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
      '36 apartamentów z rezerwacjami na własnej stronie — gość płaci 10–15% mniej niż na Booking.com, check-in 24/7, asystent dla gości w 7 językach.',
    tag: 'Noclegi',
  },
  {
    name: 'Plumm',
    url: 'https://plumm.pl',
    result:
      'Panel firmy: księgowość online, e-faktury, CRM, poczta i asystent podatkowy — zamiast Excela i osobnego biura.',
    tag: 'Księgowość online',
  },
  // iDrive wróci tu po publicznym starcie — idrivecars.pl to dziś strona parkingowa,
  // a sekcja obiecuje „kliknij i sprawdź". Zero linków do parkingu.
]

// Zasady współpracy = realne sygnały zaufania (zamiast pustych frazesów).
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
      'NDA standardowo. Po opłaceniu faktur kod i konfiguracja są Twoje — bez uzależnienia od jednego dostawcy „na zawsze”.',
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
      'Strona firmowa / wizytówka z formularzem',
      'Strona / landing pod konwersję',
      'Rezerwacje na własnej stronie / płatności',
      'Panel operacyjny lub integracje',
      'Asystent dla gości / automatyzacja obsługi',
      'Audyt i priorytetyzacja przed wdrożeniem',
    ],
  },
  {
    id: 'budget',
    label: 'Budżet netto',
    type: 'select',
    required: true,
    options: [
      'od 1 500 PLN — audyt',
      'od 2 000 PLN — strona / landing (Start)',
      'od 8 000 PLN — strona + lejek (Launch)',
      'od 25 000 PLN — platforma / panel / API',
      'od 3 000 PLN / mies. — AI Ops',
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
          'Produkt cyfrowy / aplikacja online',
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
          'Strona firmowa / wizytówka z formularzem',
          'Strona / landing pod konwersję',
          'Rezerwacje na własnej stronie / płatności',
          'Panel operacyjny lub integracje',
          'Asystent dla gości / automatyzacja obsługi',
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
          'od 1 500 PLN — audyt',
          'od 2 000 PLN — strona / landing (Start)',
          'od 8 000 PLN — strona + lejek (Launch)',
          'od 25 000 PLN — platforma / panel / API',
          'od 3 000 PLN / mies. — AI Ops',
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
