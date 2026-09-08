/**
 * Chrome edition copy — English. Same positioning as the Polish copy: a
 * mature, international engineering studio. No marketing fluff, no
 * exclamation points, no "we're passionate about" filler.
 */
import type { ChromeCopy } from './types'

export const copyEn = {
  brand: 'Marcin Bochenek',
  mark: 'MB',
  tagline: 'Websites, apps and systems · Gdańsk',
  skipLink: 'Skip to content',
  nav: [
    { href: '#realizacje', label: 'Work' },
    { href: '#uslugi', label: 'Services' },
    { href: '#proces', label: 'Process' },
    { href: '#inwestycja', label: 'Pricing' },
    { href: '#kontakt', label: 'Contact' },
  ],
  navCta: 'Book an audit',
  navAria: {
    main: 'Main',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  langSwitch: {
    ariaLabel: 'Change language',
    pl: 'PL',
    en: 'EN',
    uk: 'UA',
  },
  themeLight: 'Light mode',
  themeDark: 'Dark mode',
  themeToggle: 'Light/dark mode',
  hero: {
    eyebrow: 'Websites · Apps · Systems · Automation',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'I build websites, apps',
    h1b: 'and systems',
    h1cPrefix: 'that support the growth of',
    h1cEm: 'your business.',
    lead:
      'Online booking, a dashboard instead of spreadsheets, automation for the repetitive work. I work with companies that want to serve more customers without hiring another person to do the clicking.',
    ctaPrimary: 'Book a 20-min audit',
    ctaSecondary: 'See the work',
    projectsFromLabel: (minBudget: string) => `Projects from ${minBudget}`,
    stats: [
      { value: '4', label: 'production systems' },
      { value: '7', label: 'locales · Mint Apartments' },
      { value: '24/7', label: 'booking & AI concierge' },
      { value: '100%', label: 'auditable AI steps' },
    ],
  },
  band: ['Mint Apartments', 'Plumm', 'iDrive Cars', 'Agentic OS', 'Astro', 'React', 'Previo', 'KSeF', 'GDPR', 'EU hosting'],
  work: {
    eyebrow: 'Work',
    title: 'Four systems running in production.',
    lead: 'Each one was built around a specific way of making money, not around a template. You can open all of them and check.',
    flagshipBadge: 'flagship',
    openLabel: 'Open',
    openDomainLabel: 'Open',
    factEvidenceLabel: 'Source',
  },
  cases: {
    eyebrow: 'Case studies',
    title: 'Problem, approach, result.',
    lead: 'No sales deck. Specifics you can check live.',
    labels: { pain: 'Problem', approach: 'Approach', result: 'Result' },
  },
  services: {
    eyebrow: 'Services',
    title: 'Three things I will build for you.',
    lead: 'I do not sell a website on its own. I leave behind a system with an owner, a measurable effect and a plan for what comes next.',
  },
  process: {
    eyebrow: 'Process',
    title: 'From the first call to launch.',
    lead: 'Four stages, each ending in something concrete. You know what you get before you pay.',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Clear ranges. No surprises.',
    lead: 'Prices are "from" — scope is set after the audit. The minimum protects both sides.',
    cta: "Let's talk scope",
    note: 'Prices are net. The AI Ops retainer is billed monthly, with no minimum term after the first quarter.',
  },
  testimonials: {
    eyebrow: 'Proof',
    title: 'Products you can open right now.',
    open: (domain: string) => `Open ${domain}`,
    note: 'I do not publish client quotes without their consent. Instead: four systems running in production, and numbers you can verify in the code.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions worth asking.',
  },
  contact: {
    eyebrow: 'Contact',
    title: "Let's start with 20 minutes.",
    lead: "The process audit is free and non-binding. If your case doesn't pencil out on ROI, I'll say so directly.",
    emailLabel: 'Email',
    calendarLabel: 'Calendar',
    calendarValue: 'Book a slot',
    githubLabel: 'GitHub',
  },
  form: {
    title: 'Qualification brief (3 min)',
    subtitle: (responseTime: string) => `Fill in the fields — I'll get it straight to my inbox. ${responseTime}. No spam.`,
    selectPlaceholder: 'Select…',
    messagePlaceholder: 'E.g. invoices in Excel, bookings from Booking.com…',
    submitIdle: 'Send brief →',
    submitLoading: 'Sending…',
    errorDefault: 'Sending failed. Try again or write to me directly.',
    consent:
      'By submitting, you agree to be contacted about the project. Your data goes only to the configured form endpoint (Web3Forms / Formspree).',
    successTitle: 'Thanks — brief sent',
    successBody: (responseTime: string) => `${responseTime}. Check your inbox (spam folder too).`,
    successCalendarCta: 'Or pick a slot on the calendar right away →',
    unconfiguredTitle: 'Qualification brief',
    unconfiguredBody: (needsAccessKey: boolean) =>
      `The form needs configuration: copy .env.example to .env and set VITE_FORM_ENDPOINT${
        needsAccessKey ? ' and VITE_FORM_ACCESS_KEY' : ''
      }.`,
    unconfiguredCalendarCta: 'Book an audit on the calendar →',
    unconfiguredCalendarHint: 'Also set VITE_CALENDLY_URL for the calendar CTA.',
    accessKeyError: 'Missing VITE_FORM_ACCESS_KEY in .env (required for Web3Forms).',
  },
  footer: {
    rights: (brand: string, year: number) => `© ${year} ${brand}. All rights reserved.`,
    classic: 'Edition archive — eight takes and a game',
    classicHref: '/lab.html',
    stack: 'React 19 · Vite · GSAP · Lenis · Tailwind v4',
  },
} satisfies ChromeCopy
