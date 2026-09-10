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
  location: 'Zdalnie · Polska i zagranica · PL / EN',
  responseTime: 'Odpowiedź w 1 dzień roboczy',
  minBudget: '2 000 PLN',
}

export const services: Service[] = [
  {
    title: 'Strona, która sprzedaje',
    subtitle: 'Od wizytówki po stronę z lejkiem zapytań',
    points: [
      'Projekt pod Twoją markę, nie szablon z marketplace',
      'Szybkość na telefonie, SEO i widoczność dla modeli AI',
      'Formularz, kalendarz lub rezerwacja na własnej domenie',
    ],
  },
  {
    title: 'Systemy i integracje',
    subtitle: 'Jeden przepływ zamiast pięciu narzędzi i arkuszy',
    points: [
      'Panel operacyjny, CRM, rezerwacje, faktury, magazyn',
      'Integracje z programami, których już używasz',
      'Raporty i powiadomienia z jednego źródła prawdy',
    ],
  },
  {
    title: 'Automatyzacja i AI',
    subtitle: 'Powtarzalna praca robi się sama, z kontrolą człowieka',
    points: [
      'Asystent dla klientów 24/7 z wiedzą o Twojej ofercie',
      'Automatyzacja maili, dokumentów i obsługi zgłoszeń',
      'Lista dozwolonych akcji, zapis każdego kroku, RODO',
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
      'Strona Mint Apartments: katalog apartamentów w Trójmieście, rezerwacja bezpośrednia w ośmiu językach, integracja z systemem Previo i asystent dla gości — zamiast uzależnienia od portali rezerwacyjnych.',
    client: 'Najem krótkoterminowy · Gdańsk i okolice',
    pain: 'Goście rezerwowali przez portale — brak własnej marki, rezerwacji bez pośrednika i spójnej obsługi w kilku językach',
    approach: 'Własna strona w ośmiu językach z rezerwacją online, połączona z systemem Previo, panelem operacyjnym i elektronicznymi zamkami',
    result: 'mintapartments.pl jako kanał rezerwacji i marki premium — gotowe pod skalowanie portfela',
    tags: ['Gdańsk', 'Rezerwacje', 'Previo', 'Asystent gościa'],
    accent: '#7ee0ff',
    stat: { value: '8', label: 'języków · jeden serwis' },
    metrics: ['Rezerwacja bezpośrednia', 'Zamki elektroniczne', 'Szybkość strony'],
    flagship: true,
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: 'Faktury, podatki i deklaracje w jednej aplikacji',
    description:
      'Platforma księgowości dla polskich firm: faktury, KSeF, VAT, PIT, CIT, ZUS i rozrachunki w jednym miejscu, z asystentem AI dla przedsiębiorcy i księgowego. Każda deklaracja wychodzi w formacie, który urząd przyjmuje bez poprawek.',
    client: 'Małe i średnie firmy · biura rachunkowe',
    pain: 'Faktury, VAT, PIT, CIT i ZUS rozjeżdżały się po arkuszach i osobnych narzędziach — ryzyko błędu przy każdym zamknięciu miesiąca i deklaracji do urzędu',
    approach: 'Szesnaście formatów deklaracji generowanych i sprawdzanych względem oficjalnych schematów Ministerstwa Finansów, rozrachunki i asystent AI — całość pokryta 9 314 testami',
    result: 'Faktury, KSeF, podatki, ZUS i rozrachunki z jednej aplikacji na plumm.pl — bez nocnego Excela i bez zgadywania, co trafi do urzędu',
    tags: ['Księgowość AI', 'KSeF', 'VAT · PIT · CIT', 'ZUS'],
    accent: '#3ee8c4',
    stat: { value: '16', label: 'formatów deklaracji' },
    metrics: ['Faktury i KSeF', 'Deklaracje do urzędu', 'Rozrachunki'],
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars.pl',
    url: '#',
    tagline: 'Dziennikarstwo motoryzacyjne · testy aut · galerie',
    description:
      'Autorskie portfolio i blog motoryzacyjny: testy aut, pierwsze jazdy i galerie zdjęć. Zbudowany tak, żeby publikacja długiego tekstu z kilkudziesięcioma zdjęciami zajmowała minuty, a strona i tak ładowała się szybko.',
    client: 'Dziennikarstwo motoryzacyjne · blog osobisty',
    pain: 'Publikacja testu z dużą galerią zdjęć zajmowała godziny, a gotowe systemy CMS były na to za ciężkie',
    approach: 'Publikacja z plików tekstowych zamiast panelu CMS, a zdjęcia są automatycznie przygotowywane do sieci przy każdej publikacji',
    result: 'Testy i galerie publikowane w kilka minut, bez utraty szybkości strony i widoczności w Google',
    tags: ['Motoryzacja', 'Redakcja', 'Galerie zdjęć'],
    accent: '#c9a962',
    stat: { value: '143', label: 'opublikowane artykuły' },
    metrics: ['Testy aut', 'Galerie zdjęć', 'Optymalizacja obrazów'],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'produkt wewnętrzny',
    url: '#',
    tagline: 'Zaplecze moich automatyzacji AI',
    description:
      'Zaplecze, na którym stawiam automatyzacje dla klientów: kolejka zadań, pamięć, narzędzia i zapis każdego kroku. Dzięki niemu automatyzacja jest przewidywalna — da się sprawdzić, dlaczego zrobiła to, co zrobiła.',
    client: 'Produkt wewnętrzny · podstawa wdrożeń u klientów',
    pain: 'Automatyzacje AI działały bez zapisu — nie dało się sprawdzić, dlaczego coś się wydarzyło ani cofnąć błędu',
    approach: 'Kolejka zadań, lista dozwolonych akcji, zapis każdego kroku i przekazanie sprawy człowiekowi, gdy pewność spada',
    result: 'Powtarzalne procesy z pełnym śladem decyzji — zamiast czarnej skrzynki',
    tags: ['AI', 'Automatyzacje', 'Zapis każdego kroku'],
    accent: '#a78bfa',
    stat: { value: '22', label: 'gotowe automatyzacje' },
    metrics: ['Zadania', 'Pamięć', 'Narzędzia'],
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
    includes: ['Formularz połączony z CRM', 'Kalendarz lub rezerwacje', 'SEO techniczne', 'Pomiar zapytań'],
  },
  {
    name: 'Platforma',
    from: 'od 25 000 PLN',
    description: 'Rezerwacje, panel operacyjny, wiele języków, integracje',
    includes: [
      'Wszystko z Launch',
      'Rezerwacje i system dla obiektu',
      'Panel administracyjny',
      'Monitoring i testy',
    ],
    highlight: true,
  },
  {
    name: 'AI Ops',
    from: 'od 3 000 PLN / mies.',
    description: 'Automatyzacje, asystent AI, utrzymanie i rozwój',
    includes: ['Automatyzacje procesów', 'Asystent dla klientów', 'Gwarantowany czas reakcji', 'Raport kosztów AI'],
  },
]

export const faq = [
  {
    q: 'Od czego zależy cena?',
    a: 'Od tego, ile strona ma robić. Sama wizytówka z formularzem to pakiet Start (od 2 000 PLN). Strona firmowa z lejkiem zapytań i integracjami — Launch (od 8 000 PLN). Rezerwacje, panel operacyjny i wiele języków — Platforma (od 25 000 PLN). Stała opieka nad automatyzacjami rozliczana jest miesięcznie, od 3 000 PLN.',
  },
  {
    q: 'Czy robisz też zwykłe strony wizytówki?',
    a: 'Tak, w pakiecie Start. Jeśli od początku wiadomo, że kiedyś dojdą rezerwacje albo automatyzacja, projektuję wizytówkę jako pierwszy etap tej drogi — żeby nie budować jej drugi raz od zera.',
  },
  {
    q: 'Ile to trwa?',
    a: 'Termin ustalamy na końcu audytu, razem z zakresem. Zanim podpiszemy umowę, znasz datę uruchomienia i to, co dostajesz na każdym etapie.',
  },
  {
    q: 'Jak wygląda praca z AI?',
    a: 'Najpierw proces i dane, dopiero potem asystent. Zawsze z listą dozwolonych akcji, zapisem każdego kroku, przekazaniem sprawy człowiekowi i policzonym kosztem miesięcznym.',
  },
  {
    q: 'Czy podpisujesz umowę i NDA?',
    a: 'Tak, standardowo. Hosting w Unii Europejskiej i RODO są w zakresie od pierwszego dnia, nie jako dopłata.',
  },
  {
    q: 'Do kogo należy kod po wdrożeniu?',
    a: 'Do Ciebie. Kod, konfiguracja i dostępy przechodzą na Twoją stronę po opłaceniu faktur — nie zostajesz przywiązany do mnie hostingiem ani licencją.',
  },
]

export const process = [
  {
    step: '01',
    title: 'Rozmowa i audyt',
    text: 'Dwadzieścia minut na sprawdzenie, czy projekt ma sens finansowy. Jeśli nie ma — mówię to od razu.',
  },
  {
    step: '02',
    title: 'Projekt i prototyp',
    text: 'Klikasz układ strony albo panelu, zanim powstanie pierwsza linia kodu.',
  },
  {
    step: '03',
    title: 'Wdrożenie',
    text: 'Budowa, testy, uruchomienie i dokumentacja dla Twojego zespołu.',
  },
  {
    step: '04',
    title: 'Opieka i rozwój',
    text: 'Pomiar efektów i kolejne poprawki. Projekt nie kończy się na odbiorze.',
  },
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
    options: ['2–8 tys. PLN', '8–25 tys. PLN', 'powyżej 25 tys. PLN', 'Stała opieka AI Ops'],
  },
  {
    id: 'timeline',
    label: 'Termin startu',
    type: 'select',
    required: true,
    options: ['Jak najszybciej', 'Za 1–2 miesiące', 'Za 3 miesiące lub później', 'Na razie się rozglądam'],
  },
  { id: 'message', label: 'Co dziś zabiera najwięcej czasu? (2–3 zdania)', type: 'textarea', required: true },
]
