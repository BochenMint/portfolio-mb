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
    { href: '#pod-maska', label: 'Under the hood' },
    { href: '#uslugi', label: 'Services' },
    { href: '#proces', label: 'Process' },
    { href: '#inwestycja', label: 'Pricing' },
    { href: '#kontakt', label: 'Contact' },
  ],
  navCta: 'Book an audit',
  underhoodCta: 'This is how I build for clients',
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
    eyebrow: 'One person accountable end to end',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'I build websites, apps',
    h1b: 'and systems',
    // Split so the headline sets in four lines at every breakpoint;
    // "that support the growth of" pushed it to five with a weak break.
    h1cPrefix: 'that grow',
    h1cEm: 'your company.',
    lead:
      'Online booking, a dashboard instead of spreadsheets, automation for the repetitive work. I work with companies that want to serve more customers without hiring another person to do the manual work.',
    ctaPrimary: 'Book an audit (20 minutes)',
    ctaSecondary: 'See the work',
    objectLabel: 'Chrome Formula 1 car — drag to rotate',
    projectsFromLabel: (minBudget: string) => `Websites from ${minBudget}`,
    stats: [
      { value: '4', label: 'systems someone uses every day' },
      { value: '8', label: 'languages on mintapartments.pl' },
      { value: '9,314', label: 'automated tests in Plumm' },
      { value: '24/7', label: 'bookings taken without staff' },
    ],
  },
  band: [
    'Business websites',
    'Landing pages',
    'Online booking',
    'Panels and CRM',
    'Integrations',
    'Automation',
    'AI assistants',
  ],
  work: {
    eyebrow: 'Work',
    title: 'Four systems someone uses every day.',
    lead: 'Each one was built around a specific way of making money, not around a template. Two are public — you can open them and check right now.',
    flagshipBadge: 'flagship project',
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
    note: 'Prices are net. AI Ops care is billed monthly — after the first quarter there is no minimum term.',
  },
  testimonials: {
    eyebrow: 'Proof',
    title: 'Four products. Two you can open right now.',
    open: (domain: string) => `Open ${domain}`,
    notPublic: 'not public',
    note: 'I do not publish client quotes without consent. I prefer proof you can check yourself: working products, and numbers counted straight from the code.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions worth asking.',
  },
  contact: {
    eyebrow: 'Contact',
    title: "Let's start with 20 minutes.",
    lead: "The call is free and non-binding. If the numbers do not work in your favour, I will say so directly.",
    emailLabel: 'Email',
    calendarLabel: 'Calendar',
    calendarValue: 'Book a slot',
    githubLabel: 'GitHub',
  },
  form: {
    title: 'Tell me about the project (3 minutes)',
    subtitle: (responseTime: string) => `Fill in the fields — the message goes straight to my inbox. ${responseTime}. No spam.`,
    selectPlaceholder: 'Select…',
    messagePlaceholder: 'E.g. invoices in Excel, bookings from Booking.com…',
    submitIdle: 'Send message',
    submitLoading: 'Sending…',
    errorDefault: 'The message could not be sent. Try again, or write to me directly.',
    consent:
      'By submitting, you agree to be contacted about the project. The form sends a message to my email address — your data goes nowhere else.',
    successTitle: 'Thanks — message sent',
    successBody: (responseTime: string) => `${responseTime}. Check your inbox, and the spam folder too.`,
    successCalendarCta: 'Or pick a slot on the calendar right away',
    successMailtoNote: (email: string) =>
      `Your mail client should have opened with a ready-made message — send it, or write directly to ${email}.`,
  },
  footer: {
    rights: (brand: string, year: number) => `© ${year} ${brand}. All rights reserved.`,
    classic: 'Lab',
    classicHref: '/lab.html',
    stack: 'Websites, systems and automation for companies in Poland and abroad. I work in English and Polish.',
  },
} satisfies ChromeCopy
