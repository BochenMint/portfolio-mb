/**
 * English data for the Chrome edition. Mirrors the field structure of
 * content.ts exactly. Consumed only via getContent() in i18n.ts — the
 * classic (Polish-only) edition never imports this file.
 */
import type { PricingTier, Project, Service } from './content'

export const siteEn = {
  role: 'PropTech · FinTech · AI ops',
  icpBadge: 'Websites from PLN 2,000 · systems from PLN 8,000',
  headline: ['4 production systems.', 'One standard of quality.'],
  subhead:
    'I build websites, booking platforms and AI-driven automation — for business owners who want less manual work and more margin. Astro, React, API integrations, auditable agents.',
  ctaPrimary: 'Book a 20-min audit (free)',
  ctaSecondary: 'See case studies',
  ctaSticky: 'Process audit · 20 min',
  location: 'Remote · Poland and abroad · EN / PL',
  responseTime: 'Response within 1 business day',
  minBudget: 'PLN 2,000',
}

export const servicesEn: Service[] = [
  {
    title: 'A website that sells',
    subtitle: 'From a business-card site to a page with an enquiry funnel',
    points: [
      'Designed for your brand, not a marketplace template',
      'Fast on mobile, SEO and visibility for AI models',
      'Form, calendar or booking on your own domain',
    ],
  },
  {
    title: 'Systems and integrations',
    subtitle: 'One flow instead of five tools and spreadsheets',
    points: [
      'Operations panel, CRM, bookings, invoices, inventory',
      'Integrations with the software you already use',
      'Reports and alerts from a single source of truth',
    ],
  },
  {
    title: 'Automation and AI',
    subtitle: 'Repetitive work runs itself, with a human in control',
    points: [
      'A 24/7 assistant for customers that knows your offer',
      'Automated emails, documents and ticket handling',
      'Allowed-action list, every step logged, GDPR',
    ],
  },
]

export const projectsEn: Project[] = [
  {
    id: 'mint',
    title: 'Mint Apartments',
    domain: 'mintapartments.pl',
    url: 'https://mintapartments.pl',
    tagline: 'Apartments in Gdańsk · online booking',
    description:
      'The Mint Apartments site: a Tri-City apartment catalogue, direct booking in eight languages, Previo integration and a guest assistant — instead of depending on the booking portals.',
    client: 'Short-term rental · Gdańsk area',
    pain: 'Guests booked through the portals — no brand of their own, no booking without a middleman, no consistent service across languages',
    approach: 'Their own site in eight languages with online booking, wired into the Previo system, an operations panel and smart locks',
    result: 'mintapartments.pl as a direct booking channel and premium brand — ready to scale the portfolio',
    tags: ['Gdańsk', 'Bookings', 'Previo', 'Guest assistant'],
    accent: '#7ee0ff',
    stat: { value: '8', label: 'languages · one site' },
    metrics: ['Direct booking', 'Smart locks', 'Page speed'],
    flagship: true,
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: 'Invoicing, taxes and filings in one application',
    description:
      'An accounting platform for Polish businesses: invoicing, KSeF, VAT, PIT, CIT, ZUS and settlements in one place, with an AI assistant for the owner and the accountant. Every filing leaves in the format the tax office accepts without corrections.',
    client: 'Small and mid-size businesses · accounting offices',
    pain: 'Invoicing, VAT, PIT, CIT and ZUS were scattered across spreadsheets and separate tools — every month-end close and filing risked an error',
    approach: 'Sixteen filing formats generated and checked against the official Ministry of Finance schemas, plus settlements and an AI assistant — all covered by 9,314 tests',
    result: 'Invoicing, KSeF, taxes, ZUS and settlements from one application on plumm.pl — no more late-night spreadsheets or guessing what reaches the tax office',
    tags: ['AI Accounting', 'KSeF', 'VAT · PIT · CIT', 'ZUS'],
    accent: '#3ee8c4',
    stat: { value: '16', label: 'filing formats' },
    metrics: ['Invoicing and KSeF', 'Filings to the tax office', 'Settlements'],
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars.pl',
    url: '#',
    tagline: 'Automotive journalism · car tests · photo galleries',
    description:
      'A personal automotive journalism portfolio and blog: car tests, first drives and photo galleries. Built so that publishing a long review with dozens of photos takes minutes, and the page still loads fast.',
    client: 'Automotive journalism · personal blog',
    pain: 'Publishing one review with a large gallery took hours, and off-the-shelf CMS platforms were too heavy for it',
    approach: 'Publishing straight from text files instead of a CMS, with photos prepared for the web automatically on every publish',
    result: 'Reviews and galleries published in minutes, with no loss of page speed or Google visibility',
    tags: ['Automotive', 'Editorial', 'Photo galleries'],
    accent: '#c9a962',
    stat: { value: '143', label: 'published articles' },
    metrics: ['Car tests', 'Photo galleries', 'Image optimisation'],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'internal product',
    url: '#',
    tagline: 'The engine room behind my AI automation',
    description:
      'The platform I build client automation on: a task queue, memory, tools and a log of every step. It makes automation predictable — you can check why it did what it did.',
    client: 'Internal product · the base for client rollouts',
    pain: 'AI automation ran with no record — there was no way to check why something happened, or to undo it',
    approach: 'A task queue, a list of allowed actions, a log of every step, and a handover to a human when confidence drops',
    result: 'Repeatable processes with a full decision trail — instead of a black box',
    tags: ['AI', 'Automation', 'Every step logged'],
    accent: '#a78bfa',
    stat: { value: '22', label: 'automations ready' },
    metrics: ['Tasks', 'Memory', 'Tools'],
  },
]

export const pricingEn: PricingTier[] = [
  {
    name: 'Start',
    from: 'from PLN 2,000',
    description: 'A brochure website or landing page that collects enquiries',
    includes: [
      'Up to 5 pages built around your brand',
      'Contact form with notifications',
      'Mobile speed + on-page SEO',
      'A clear upgrade path to the Launch package',
    ],
  },
  {
    name: 'Launch',
    from: 'from PLN 8,000',
    description: 'Company website + conversion funnel + integrations',
    includes: ['Form wired into your CRM', 'Calendar or bookings', 'Technical SEO', 'Enquiry measurement'],
  },
  {
    name: 'Platform',
    from: 'from PLN 25,000',
    description: 'Bookings, operations panel, several languages, integrations',
    includes: [
      'Everything in Launch',
      'Bookings and property system',
      'Administration panel',
      'Monitoring and tests',
    ],
    highlight: true,
  },
  {
    name: 'AI Ops',
    from: 'from PLN 3,000 / mo',
    description: 'Automation, an AI assistant, maintenance and iteration',
    includes: ['Process automation', 'Assistant for your customers', 'Guaranteed response time', 'AI cost report'],
  },
]

export const faqEn = [
  {
    q: 'What does the price depend on?',
    a: 'On how much the site has to do. A brochure site with a form is the Start package (from PLN 2,000). A company site with an enquiry funnel and integrations is Launch (from PLN 8,000). Bookings, an operations panel and several languages is Platform (from PLN 25,000). Ongoing care for automation is billed monthly, from PLN 3,000.',
  },
  {
    q: 'Do you also build plain brochure sites?',
    a: 'Yes, as the Start package. If it is clear from the outset that bookings or automation will follow one day, I design the brochure site as the first stage of that path — so it never has to be rebuilt from scratch.',
  },
  {
    q: 'How long does it take?',
    a: 'The date is set at the end of the audit, together with the scope. Before we sign anything you know the launch date and what you get at each stage.',
  },
  {
    q: 'How does working with AI look in practice?',
    a: 'Process and data first, assistant second. Always with a list of allowed actions, a log of every step, a handover to a human, and a monthly cost worked out up front.',
  },
  {
    q: 'Do you sign a contract and an NDA?',
    a: 'Yes, as standard. EU hosting and GDPR are in scope from day one, not as an extra.',
  },
  {
    q: 'Who owns the code after launch?',
    a: 'You do. Code, configuration and access move to your side once the invoices are paid — you are not tied to me by hosting or by a licence.',
  },
]

export const processEn = [
  {
    step: '01',
    title: 'Call and audit',
    text: 'Twenty minutes to check whether the project makes financial sense. If it does not, I say so straight away.',
  },
  {
    step: '02',
    title: 'Design and prototype',
    text: 'You click through the layout of the site or the panel before a line of code exists.',
  },
  {
    step: '03',
    title: 'Build and launch',
    text: 'Build, tests, go-live and documentation for your team.',
  },
  {
    step: '04',
    title: 'Care and growth',
    text: 'Measuring the results and improving on them. The project does not end at handover.',
  },
]

export const marqueeItemsEn = [
  'PropTech',
  'FinTech',
  'Automotive',
  'AI Ops',
  'Astro · React',
  'Previo · Plumm · KSeF',
  'Small businesses → outsized results',
]

export const qualificationFieldsEn = [
  { id: 'name', label: 'Full name', type: 'text', required: true },
  { id: 'email', label: 'Work email', type: 'email', required: true },
  { id: 'company', label: 'Company / industry', type: 'text', required: true },
  {
    id: 'budget',
    label: 'Approximate budget',
    type: 'select',
    required: true,
    options: ['PLN 2–8k', 'PLN 8–25k', 'Over PLN 25k', 'Ongoing AI Ops care'],
  },
  {
    id: 'timeline',
    label: 'Start date',
    type: 'select',
    required: true,
    options: ['As soon as possible', 'In 1–2 months', 'In 3 months or later', 'Just looking around'],
  },
  { id: 'message', label: 'What takes up the most time today? (2–3 sentences)', type: 'textarea', required: true },
]
