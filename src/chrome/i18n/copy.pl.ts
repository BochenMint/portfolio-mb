/**
 * Chrome edition copy — Polish (default). Positioning as a mature,
 * international IT brand. Data (projects, pricing, FAQ, form fields) is
 * shared with the classic edition via src/data/content.ts / i18n.ts; only
 * tone-of-voice strings live here.
 */
import type { ChromeCopy } from './types'

export const copyPl = {
  brand: 'Marcin Bochenek',
  mark: 'MB',
  tagline: 'Inżynieria produktów cyfrowych · Gdańsk',
  skipLink: 'Przejdź do treści',
  nav: [
    { href: '#realizacje', label: 'Realizacje' },
    { href: '#uslugi', label: 'Usługi' },
    { href: '#proces', label: 'Proces' },
    { href: '#inwestycja', label: 'Inwestycja' },
    { href: '#kontakt', label: 'Kontakt' },
  ],
  navCta: 'Umów audyt',
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
    eyebrow: 'Produkty cyfrowe · PropTech · FinTech · AI ops',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'Systemy, które',
    h1b: 'wyglądają jak marka.',
    h1cPrefix: 'Działają jak',
    h1cEm: 'inżynieria.',
    lead:
      'Buduję platformy rezerwacji, automatyzacje finansów i audytowalne agenty AI dla firm, które chcą mniej ręcznej pracy i więcej marży. Jeden standard jakości — od pierwszego piksela po produkcję.',
    ctaPrimary: 'Umów 20-min audyt',
    ctaSecondary: 'Zobacz realizacje',
    projectsFromLabel: (minBudget: string) => `Projekty ${minBudget}+`,
    stats: [
      { value: '4', label: 'produkcyjne systemy' },
      { value: '7', label: 'języków · Mint Apartments' },
      { value: '24/7', label: 'booking & concierge AI' },
      { value: '100%', label: 'audytowalne kroki AI' },
    ],
  },
  band: ['Mint Apartments', 'Plumm', 'iDrive Cars', 'Agentic OS', 'Astro', 'React', 'Previo', 'KSeF', 'RODO', 'EU hosting'],
  work: {
    eyebrow: 'Realizacje',
    title: 'Cztery ekosystemy. Jeden standard.',
    lead: 'Od direct bookingu po eksport JPK i orkiestrację agentów — każdy produkt zaprojektowany pod konkretny model biznesowy, nie pod szablon.',
    flagshipBadge: 'flagship',
    openLabel: 'Otwórz',
    openDomainLabel: 'Otwórz',
    factEvidenceLabel: 'Źródło',
  },
  cases: {
    eyebrow: 'Case studies',
    title: 'Problem. Rozwiązanie. Rezultat.',
    lead: 'Bez pitch decka. Konkret, który możesz zweryfikować w produkcji.',
    labels: { pain: 'Problem', approach: 'Podejście', result: 'Rezultat' },
  },
  services: {
    eyebrow: 'Usługi',
    title: 'Trzy obszary. Jedna odpowiedzialność.',
    lead: 'Nie sprzedaję „strony”. Dostarczam system, który ma właściciela, metryki i plan rozwoju.',
  },
  process: {
    eyebrow: 'Proces',
    title: 'Przewidywalnie, od audytu do wzrostu.',
    lead: 'Cztery etapy, każdy z jasnym artefaktem. Wiesz, co dostajesz, zanim zapłacisz.',
  },
  pricing: {
    eyebrow: 'Inwestycja',
    title: 'Przejrzyste progi. Zero niespodzianek.',
    lead: 'Widełki „od” — zakres precyzujemy po audycie. Minimalny próg chroni obie strony.',
    cta: 'Porozmawiajmy o zakresie',
    note: 'Ceny netto. Retainer AI Ops rozliczany miesięcznie, bez okresu minimalnego po pierwszym kwartale.',
  },
  testimonials: {
    eyebrow: 'Dowód',
    title: 'Produkty, które możesz otworzyć teraz.',
    open: (domain: string) => `Otwórz ${domain}`,
    note: 'Nie publikuję cytatów od klientów bez ich zgody. Zamiast tego: cztery działające produkcyjnie systemy i liczby, które da się sprawdzić w kodzie.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Pytania, które warto zadać.',
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Zacznijmy od 20 minut.',
    lead: 'Audyt procesu jest bezpłatny i bez zobowiązań. Jeśli Twój case nie ma sensu ROI — powiem to wprost.',
    emailLabel: 'E-mail',
    calendarLabel: 'Kalendarz',
    calendarValue: 'Zarezerwuj termin',
    githubLabel: 'GitHub',
  },
  form: {
    title: 'Brief kwalifikacyjny (3 min)',
    subtitle: (responseTime: string) => `Wypełnij pola — dostanę wiadomość na skrzynkę. ${responseTime}. Bez spamu.`,
    selectPlaceholder: 'Wybierz…',
    messagePlaceholder: 'Np. faktury w Excelu, rezerwacje z Booking…',
    submitIdle: 'Wyślij brief →',
    submitLoading: 'Wysyłanie…',
    errorDefault: 'Błąd wysyłki. Spróbuj ponownie lub napisz bezpośrednio.',
    consent:
      'Wysyłając, zgadzasz się na kontakt w sprawie projektu. Dane trafiają wyłącznie do skonfigurowanego endpointu formularza (Web3Forms / Formspree).',
    successTitle: 'Dzięki — brief wysłany',
    successBody: (responseTime: string) => `${responseTime}. Sprawdź skrzynkę (także spam).`,
    successCalendarCta: 'Albo od razu wybierz termin w kalendarzu →',
    unconfiguredTitle: 'Brief kwalifikacyjny',
    unconfiguredBody: (needsAccessKey: boolean) =>
      `Formularz wymaga konfiguracji: skopiuj .env.example do .env i uzupełnij VITE_FORM_ENDPOINT${
        needsAccessKey ? ' oraz VITE_FORM_ACCESS_KEY' : ''
      }.`,
    unconfiguredCalendarCta: 'Umów audyt w kalendarzu →',
    unconfiguredCalendarHint: 'Ustaw też VITE_CALENDLY_URL dla CTA kalendarza.',
    accessKeyError: 'Brak VITE_FORM_ACCESS_KEY w .env (wymagane dla Web3Forms).',
  },
  footer: {
    rights: (brand: string, year: number) => `© ${year} ${brand}. Wszystkie prawa zastrzeżone.`,
    classic: 'Archiwum wersji — osiem edycji i gra',
    classicHref: '/lab.html',
    stack: 'React 19 · Vite · GSAP · Lenis · Tailwind v4',
  },
} satisfies ChromeCopy
