/**
 * Chrome edition copy — English. Same positioning as the Polish copy: a
 * mature, international engineering studio. No marketing fluff, no
 * exclamation points, no "we're passionate about" filler.
 */
import type { ChromeCopy } from './types'

export const copyEn = {
  brand: 'Bochen Studio',
  mark: 'MB',
  tagline: 'Engineering studio · Gdańsk / EU',
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
  },
  hero: {
    eyebrow: 'Digital products · PropTech · FinTech · AI ops',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'Systems that',
    h1b: 'look like a brand.',
    h1cPrefix: 'Run like',
    h1cEm: 'engineering.',
    lead:
      "I build booking platforms, financial automation and auditable AI agents for companies that want less manual work and more margin. One standard of quality — from the first pixel to production.",
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
    title: 'Four ecosystems. One standard.',
    lead: 'From direct booking to JPK export and agent orchestration — every product is built around a specific business model, not a template.',
    flagshipBadge: 'flagship',
    openLabel: 'Open',
    openDomainLabel: 'Open',
  },
  cases: {
    eyebrow: 'Case studies',
    title: 'Problem. Approach. Result.',
    lead: 'No pitch deck. Specifics you can verify in production.',
    labels: { pain: 'Problem', approach: 'Approach', result: 'Result' },
  },
  services: {
    eyebrow: 'Services',
    title: 'Three areas. One accountable owner.',
    lead: "I don't sell a \"website\". I deliver a system with an owner, metrics and a growth plan.",
  },
  process: {
    eyebrow: 'Process',
    title: 'Predictable, from audit to growth.',
    lead: 'Four stages, each with a clear artefact. You know what you get before you pay.',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Clear thresholds. No surprises.',
    lead: 'Prices are "from" — scope is set after the audit. The minimum protects both sides.',
    cta: "Let's talk scope",
    note: 'Prices are net. The AI Ops retainer is billed monthly, with no minimum term after the first quarter.',
  },
  testimonials: {
    eyebrow: 'Testimonials',
    title: 'What owners say.',
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
    classic: 'Previous portfolio edition',
    classicHref: '/classic/',
    stack: 'React 19 · Vite · GSAP · Lenis · Tailwind v4',
  },
} satisfies ChromeCopy
