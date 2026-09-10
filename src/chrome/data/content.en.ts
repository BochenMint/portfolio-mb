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
  location: 'Poland · remote and on-site',
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
      'The production site for Mint Apartments: a Tri-City apartment catalogue, multilingual direct booking, Previo integration and an AI concierge — instead of relying on aggregator portals.',
    client: 'Short-term rental · Gdańsk area',
    pain: 'Guests booked through OTAs — no single brand, no direct booking, no consistent UX across languages',
    approach: 'Astro + React, per-locale SEO, Previo widget, operations panel and access automation (Tedee/Nuki)',
    result: 'mintapartments.pl as a direct booking channel and premium brand — ready to scale the portfolio',
    tags: ['Gdańsk', 'Booking', 'Previo', 'AI Concierge'],
    accent: '#7ee0ff',
    stat: { value: '7', label: 'locales · 1 ecosystem' },
    metrics: ['Direct booking', 'Smart lock', 'Core Web Vitals'],
    flagship: true,
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: '16 declaration engines · 9,314 tested scenarios · one application',
    description:
      'Plumm is a full AI accounting platform for Polish businesses: invoicing, KSeF, VAT/PIT/CIT/ZUS, settlements and an AI assistant for both the business owner and their accountant in one app. Under the hood — 118 data models and 456 API endpoints across roughly 545k lines of TypeScript, with 16 declaration formats (PIT-28/36/36L, CIT-8/8E, JPK_V7/FA/PKPIR, KSeF FA(3)) validated against official Polish Ministry of Finance XSD schemas and backed by 9,314 test cases.',
    client: 'Small and mid-size businesses · accounting offices',
    pain: 'Invoicing, VAT, PIT, CIT and ZUS were scattered across spreadsheets and separate tools — every month-end close and filing risked an error',
    approach: 'Next.js + TypeScript on 118 Prisma models, 16 XML export engines validated against Ministry of Finance XSD schemas, a settlements workspace and an AI assistant, all covered by 9,314 tests',
    result: 'Invoicing, KSeF, taxes, ZUS and settlements from one application on plumm.pl — no more late-night spreadsheets or guessing what reaches the tax office',
    tags: ['AI Accounting', 'KSeF', 'VAT · PIT · CIT', 'ZUS'],
    accent: '#3ee8c4',
    stat: { value: '16', label: 'XSD-validated engines' },
    metrics: ['9,314 tests', '456 endpoints', '118 models'],
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars.pl',
    url: '#',
    tagline: 'Automotive journalism · car tests · photo galleries',
    description:
      'A personal automotive journalism portfolio and blog: authored car tests, first drives and photo galleries, built on Next.js 15 App Router with MDX content and a Sharp-powered WebP image pipeline.',
    client: 'Automotive journalism · personal blog',
    pain: 'Editorial content needed a fast, image-heavy publishing workflow without a bloated CMS',
    approach: 'Next.js 15 App Router, MDX for long-form reviews, Sharp pipeline generating optimised WebP galleries',
    result: 'A fast, SEO-friendly publication for car tests and galleries, authored entirely in MDX',
    tags: ['Automotive', 'MDX', 'Next.js'],
    accent: '#c9a962',
    stat: { value: 'MDX', label: 'content pipeline' },
    metrics: ['Car tests', 'Photo galleries', 'WebP pipeline'],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'agentic-os',
    url: '#',
    tagline: 'AI agent orchestration',
    description:
      'An operating system for agents: tasks, memory, tools, audit trail. Automation that is predictable — not a black box.',
    client: 'Internal product · B2B clients',
    pain: 'Prompt chaos with no logs and no accountability',
    approach: 'Workflow engine, tool calling, human-in-the-loop',
    result: 'Repeatable processes with a full decision trail',
    tags: ['AI', 'Agents', 'Automation'],
    accent: '#a78bfa',
    stat: { value: '100%', label: 'auditable steps' },
    metrics: ['Workflow', 'Memory', 'Tooling'],
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
    includes: ['Form → CRM', 'Calendar / booking', 'Technical SEO', 'Conversion measurement'],
  },
  {
    name: 'Platform',
    from: 'from PLN 25,000',
    description: 'Booking, admin panel, multilingual, API',
    includes: [
      'Everything in Launch',
      'Booking / PMS',
      'Admin panel',
      'Monitoring & tests',
    ],
    highlight: true,
  },
  {
    name: 'AI Ops',
    from: 'from PLN 3,000 / mo',
    description: 'Agents, automation, maintenance and iteration',
    includes: ['Agentic workflows', 'Concierge / support AI', 'SLA response', 'AI cost report'],
  },
]

export const faqEn = [
  {
    q: 'Do you also build simple company websites?',
    a: "Yes. The Start package (from PLN 2,000) is a solid website or landing page with a form, mobile speed and basic SEO — no systems underneath, but built so it can be extended. A company site with a conversion funnel and integrations starts at the Launch package (from PLN 8,000).",
  },
  {
    q: 'Do you build plain brochure sites?',
    a: "Yes — as the Start package. If the goal from day one is bookings or automation, I design the brochure site as the first stage of that path, so it never has to be rebuilt.",
  },
  {
    q: 'How does working with AI look in practice?',
    a: 'Process and data first, agent second. Always: logs, a human fallback, token-cost estimates.',
  },
  {
    q: 'Do you sign an NDA and a contract?',
    a: 'Yes — as standard. EU hosting, GDPR in scope from day zero.',
  },
]

export const processEn = [
  { step: '01', title: '20-min audit', text: "Whether your case pencils out on ROI — honestly, no pitch deck." },
  { step: '02', title: 'Motion prototype', text: 'Feel the product before a single line of backend is written.' },
  { step: '03', title: 'Build & launch', text: 'Production, tests, documentation for your team.' },
  { step: '04', title: 'Growth', text: 'Metrics, iteration — never a "project closed".' },
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
    options: ['PLN 2–8k', 'PLN 8–25k', 'PLN 25k+', 'AI Ops retainer'],
  },
  {
    id: 'timeline',
    label: 'Start date',
    type: 'select',
    required: true,
    options: ['ASAP', '1–2 months', '3+ months', 'Just exploring'],
  },
  { id: 'message', label: "What's the pain today? (2–3 sentences)", type: 'textarea', required: true },
]
