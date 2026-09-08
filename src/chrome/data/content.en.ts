/**
 * English data for the Chrome edition. Mirrors the field structure of
 * content.ts exactly. Consumed only via getContent() in i18n.ts — the
 * classic (Polish-only) edition never imports this file.
 */
import type { PricingTier, Project, Service } from './content'

export const siteEn = {
  role: 'PropTech · FinTech · AI ops',
  icpBadge: 'Projects from PLN 25,000 · decision-maker in the company',
  headline: ['4 production systems.', 'One standard of quality.'],
  subhead:
    'I build websites, booking platforms and AI-driven automation — for business owners who want less manual work and more margin. Astro, React, API integrations, auditable agents.',
  proofLine: '4 production products · hospitality · accounting · mobility · AI ops',
  ctaPrimary: 'Book a 20-min audit (free)',
  ctaSecondary: 'See case studies',
  ctaSticky: 'Process audit · 20 min',
  location: 'Poland · remote and on-site',
  responseTime: 'Response within 1 business day',
  minBudget: 'PLN 25,000',
}

export const servicesEn: Service[] = [
  {
    title: 'Platform & booking',
    subtitle: 'Customers book with you, not with a middleman',
    points: [
      'Multilingual SEO, Core Web Vitals, schema.org',
      'Booking widget, Previo/PMS, payments',
      'Operations panel built for your team',
    ],
  },
  {
    title: 'Automation & FinTech',
    subtitle: 'No more spreadsheets after hours',
    points: [
      'Plumm exports, JPK_FA, KSeF-ready flow',
      'Calendar, lock and CRM sync',
      'Reports and alerts — deterministic data',
    ],
  },
  {
    title: 'AI with oversight',
    subtitle: 'AI that only does what you agreed to',
    points: [
      "Concierge grounded in your actual offer (no hallucinations)",
      'Agentic OS — workflow, memory, logs',
      'GDPR, token-cost tracking, human fallback',
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
    domain: 'idrivecars',
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
    domain: 'agentic OS',
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
    name: 'Launch',
    from: 'from PLN 25,000',
    description: 'Landing page + integrations + basic automation',
    includes: ['Premium UX/UI', 'Technical SEO', 'Form + CRM', '2 iterations'],
  },
  {
    name: 'Platform',
    from: 'from PLN 55,000',
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
    from: 'from PLN 15,000 / mo',
    description: 'Agents, automation, maintenance and iteration',
    includes: ['Agentic workflows', 'Concierge / support AI', 'SLA response', 'AI cost report'],
  },
]

export const faqEn = [
  {
    q: 'Why a PLN 25,000 minimum?',
    a: "Because I build production products — with tests, SEO and maintenance — not a \"site by tomorrow\". It's a filter that protects both sides.",
  },
  {
    q: 'Do you build plain brochure sites?',
    a: 'Yes, if they serve a larger goal (booking, automation). A landing page with no business KPI is only available in the Launch package.',
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
    options: ['PLN 25–50k', 'PLN 50–100k', 'PLN 100k+', 'AI Ops retainer'],
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
