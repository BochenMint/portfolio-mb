export type Locale = 'pl' | 'en' | 'uk'

export type NavLink = { href: string; label: string }

export type ChromeCopy = {
  brand: string
  mark: string
  tagline: string
  skipLink: string
  nav: NavLink[]
  navCta: string
  underhoodCta: string
  navAria: {
    main: string
    openMenu: string
    closeMenu: string
  }
  langSwitch: {
    ariaLabel: string
    pl: string
    en: string
    uk: string
  }
  themeLight: string
  themeDark: string
  themeToggle: string
  hero: {
    eyebrow: string
    h1a: string
    h1b: string
    h1cPrefix: string
    h1cEm: string
    lead: string
    ctaPrimary: string
    ctaSecondary: string
    /** Accessible name for the draggable chrome car beside the headline. */
    objectLabel: string
    projectsFromLabel: (minBudget: string) => string
    stats: { value: string; label: string }[]
  }
  band: string[]
  work: {
    eyebrow: string
    title: string
    lead: string
    flagshipBadge: string
    openLabel: string
    openDomainLabel: string
    factEvidenceLabel: string
  }
  cases: {
    eyebrow: string
    title: string
    lead: string
    labels: { pain: string; approach: string; result: string }
  }
  services: {
    eyebrow: string
    title: string
    lead: string
  }
  process: {
    eyebrow: string
    title: string
    lead: string
  }
  pricing: {
    eyebrow: string
    title: string
    lead: string
    cta: string
    note: string
  }
  testimonials: {
    eyebrow: string
    title: string
    open: (domain: string) => string
    notPublic: string
    note: string
  }
  faq: {
    eyebrow: string
    title: string
  }
  contact: {
    eyebrow: string
    title: string
    lead: string
    emailLabel: string
    calendarLabel: string
    calendarValue: string
    githubLabel: string
  }
  form: {
    title: string
    subtitle: (responseTime: string) => string
    selectPlaceholder: string
    messagePlaceholder: string
    submitIdle: string
    submitLoading: string
    errorDefault: string
    consent: string
    successTitle: string
    successBody: (responseTime: string) => string
    successCalendarCta: string
    successMailtoNote: (email: string) => string
  }
  footer: {
    rights: (brand: string, year: number) => string
    classic: string
    classicHref: string
    stack: string
    mbAi: string
    mbAiHref: string
    branze: string
    branzeHref: string
  }
}
