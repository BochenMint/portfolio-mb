/**
 * Chrome edition copy — Polish (default). Positioning as a mature,
 * international IT brand. Data (projects, pricing, FAQ, form fields) is
 * shared with the classic edition via src/data/content.ts / i18n.ts; only
 * tone-of-voice strings live here.
 *
 * Polish copy contains literal U+00A0 (non-breaking space) after one-letter
 * prepositions (i, w, z, o, a, u) so a heading never ends a line on a single
 * letter. They look like ordinary spaces in an editor — do not retype them.
 */
import type { ChromeCopy } from './types'

export const copyPl = {
  brand: 'Marcin Bochenek',
  mark: 'MB',
  tagline: 'Strony, aplikacje i systemy · Gdańsk',
  skipLink: 'Przejdź do treści',
  nav: [
    { href: '#realizacje', label: 'Realizacje' },
    { href: '#pod-maska', label: 'Pod maską' },
    { href: '#uslugi', label: 'Usługi' },
    { href: '#proces', label: 'Proces' },
    { href: '#inwestycja', label: 'Inwestycja' },
    { href: '#kontakt', label: 'Kontakt' },
  ],
  navCta: 'Umów audyt',
  underhoodCta: 'Tak buduję dla klientów',
  navAria: {
    main: 'Główna',
    openMenu: 'Otwórz menu',
    closeMenu: 'Zamknij menu',
  },
  langSwitch: {
    ariaLabel: 'Zmień język',
    pl: 'PL',
    en: 'EN',
    uk: 'UA',
  },
  themeLight: 'Tryb jasny',
  themeDark: 'Tryb ciemny',
  themeToggle: 'Tryb jasny/ciemny',
  hero: {
    eyebrow: 'Jedna osoba odpowiedzialna za całość',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'Tworzę strony, aplikacje',
    h1b: 'i systemy,',
    // Split so the headline sets in four lines at every breakpoint. Moving
    // "wzrost" into the prefix is what removes the one-word orphan line the
    // 15ch headline box produced with "rozwój | Twojej firmy."
    h1cPrefix: 'które wspierają wzrost',
    h1cEm: 'Twojej firmy.',
    lead:
      'Rezerwacje online, panel zamiast arkuszy, automatyzacja powtarzalnej roboty. Pracuję z firmami, które chcą obsłużyć więcej klientów bez zatrudniania kolejnej osoby do ręcznej pracy.',
    ctaPrimary: 'Umów audyt (20 minut)',
    ctaSecondary: 'Zobacz realizacje',
    objectLabel: 'Chromowany bolid Formuły 1 — przeciągnij, aby obrócić',
    projectsFromLabel: (minBudget: string) => `Strony od ${minBudget}`,
    stats: [
      { value: '4', label: 'systemy, z których ktoś korzysta codziennie' },
      { value: '8', label: 'języków na mintapartments.pl' },
      { value: '9 314', label: 'testów automatycznych w Plumm' },
      { value: '24/7', label: 'rezerwacje przyjmowane bez obsługi' },
    ],
  },
  band: [
    'Strony firmowe',
    'Landingi',
    'Rezerwacje online',
    'Panele i CRM',
    'Integracje',
    'Automatyzacje',
    'Asystenci AI',
  ],
  work: {
    eyebrow: 'Realizacje',
    title: 'Cztery systemy, z których ktoś korzysta codziennie.',
    lead: 'Każdy powstał pod konkretny sposób zarabiania, nie pod szablon. Dwa są publiczne — możesz je otworzyć i sprawdzić teraz.',
    flagshipBadge: 'projekt flagowy',
    openLabel: 'Otwórz',
    openDomainLabel: 'Otwórz',
    factEvidenceLabel: 'Źródło',
  },
  cases: {
    eyebrow: 'Case studies',
    title: 'Problem, podejście, rezultat.',
    lead: 'Bez prezentacji sprzedażowej. Konkret, który da się sprawdzić na żywo.',
    labels: { pain: 'Problem', approach: 'Podejście', result: 'Rezultat' },
  },
  services: {
    eyebrow: 'Usługi',
    title: 'Trzy rzeczy, które dla Ciebie zbuduję.',
    lead: 'Nie sprzedaję samej strony. Zostawiam system, który ma właściciela, mierzalny efekt i plan na dalszy rozwój.',
  },
  process: {
    eyebrow: 'Proces',
    title: 'Od pierwszej rozmowy do wdrożenia.',
    lead: 'Cztery etapy, każdy kończy się czymś konkretnym. Wiesz, co dostajesz, zanim zapłacisz.',
  },
  pricing: {
    eyebrow: 'Inwestycja',
    title: 'Jasne widełki. Bez niespodzianek.',
    lead: 'Widełki „od” — zakres precyzujemy po audycie. Minimalny próg chroni obie strony.',
    cta: 'Porozmawiajmy o zakresie',
    note: 'Ceny netto. Opieka AI Ops rozliczana miesięcznie — po pierwszym kwartale bez okresu minimalnego.',
  },
  testimonials: {
    eyebrow: 'Dowód',
    title: 'Cztery produkty. Dwa otworzysz od razu.',
    open: (domain: string) => `Otwórz ${domain}`,
    notPublic: 'projekt niepubliczny',
    note: 'Nie publikuję cytatów bez zgody klienta. Wolę dowód, który sprawdzisz sam: działające produkty i liczby policzone wprost z kodu.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Pytania, które warto zadać.',
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Zacznijmy od 20 minut.',
    lead: 'Rozmowa jest bezpłatna i bez zobowiązań. Jeśli Twój pomysł się nie spina finansowo, powiem to wprost.',
    emailLabel: 'E-mail',
    calendarLabel: 'Kalendarz',
    calendarValue: 'Zarezerwuj termin',
    githubLabel: 'GitHub',
  },
  form: {
    title: 'Opisz projekt (3 minuty)',
    subtitle: (responseTime: string) => `Wypełnij pola — wiadomość trafia prosto na moją skrzynkę. ${responseTime}. Bez spamu.`,
    selectPlaceholder: 'Wybierz…',
    messagePlaceholder: 'Np. faktury w Excelu, rezerwacje z Booking…',
    submitIdle: 'Wyślij wiadomość',
    submitLoading: 'Wysyłanie…',
    errorDefault: 'Nie udało się wysłać. Spróbuj ponownie albo napisz bezpośrednio na mój adres.',
    consent:
      'Wysyłając formularz, zgadzasz się na kontakt w sprawie projektu. Formularz wysyła wiadomość na mój adres e-mail — dane nie trafiają nigdzie indziej.',
    successTitle: 'Dzięki — wiadomość wysłana',
    successBody: (responseTime: string) => `${responseTime}. Sprawdź skrzynkę, także folder ze spamem.`,
    successCalendarCta: 'Albo od razu wybierz termin w kalendarzu',
    successMailtoNote: (email: string) =>
      `Twój klient poczty powinien się otworzyć z gotową wiadomością — wyślij ją albo napisz bezpośrednio na ${email}.`,
  },
  footer: {
    rights: (brand: string, year: number) => `© ${year} ${brand}. Wszystkie prawa zastrzeżone.`,
    classic: 'Laboratorium',
    classicHref: '/lab.html',
    mbAi: 'MB AI — automatyzacje z kontrolą człowieka',
    mbAiHref: 'https://mb-ai.pl',
    stack: 'Strony, systemy i automatyzacje dla firm w Polsce i za granicą. Pracuję po polsku i po angielsku.',
    krajobraz: 'Dla pracowni architektury krajobrazu',
    krajobrazHref: '/krajobraz',
    brukarstwo: 'Dla firm brukarskich',
    brukarstwoHref: '/brukarstwo',
  },
} satisfies ChromeCopy
