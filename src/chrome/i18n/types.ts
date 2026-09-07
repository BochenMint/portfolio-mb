export type Locale = 'pl' | 'en'

export type NavLink = { href: string; label: string }

export type ChromeCopy = {
  brand: string
  mark: string
  tagline: string
  skipLink: string
  nav: NavLink[]
  navCta: string
  navAria: {
    main: string
    openMenu: string
    closeMenu: string
  }
  langSwitch: {
    ariaLabel: string
    pl: string
    en: string
  }
  hero: {
    eyebrow: string
    h1a: string
    h1b: string
    h1cPrefix: string
    h1cEm: string
    lead: string
    ctaPrimary: string
    ctaSecondary: string
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
    unconfiguredTitle: string
    unconfiguredBody: (needsAccessKey: boolean) => string
    unconfiguredCalendarCta: string
    unconfiguredCalendarHint: string
    accessKeyError: string
  }
  footer: {
    rights: (brand: string, year: number) => string
    classic: string
    classicHref: string
    stack: string
  }
}
