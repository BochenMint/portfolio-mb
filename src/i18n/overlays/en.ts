import type {
  ContactField,
  FaqItem,
  LiveProof,
  PricingPackage,
  Project,
  ResultMetric,
  TrustPoint,
} from '../../data/content'
import { leadForm as leadFormPl, site as sitePl } from '../../data/content'
import { enArchiveFields } from './archive-fields'

export type SiteOverlay = Partial<typeof sitePl>
export type LeadFormOverlay = typeof leadFormPl
export type ServiceOverlay = {
  title: string
  description: string
  tags: string[]
  outcome: string
  timeline: string
  from: string
  deliverables: string[]
}
export type ProjectOverlay = Pick<
  Project,
  'tagline' | 'description' | 'client' | 'outcome' | 'pain' | 'contribution' | 'decisions' | 'tags'
> & {
  domain?: string
  howItWorks?: string[]
  stack?: string[]
}

export type ContentOverlay = {
  site: SiteOverlay
  resultsDisclaimer: string
  results: ResultMetric[]
  services: ServiceOverlay[]
  pricingPackages: PricingPackage[]
  projects: Record<string, ProjectOverlay>
  faq: FaqItem[]
  liveProof: LiveProof[]
  trustPoints: TrustPoint[]
  contactFields: ContactField[]
  leadForm: LeadFormOverlay
  sections: typeof enArchiveFields.sections
  process: typeof enArchiveFields.process
  intakeCopy: typeof enArchiveFields.intakeCopy
  intakeSteps: typeof enArchiveFields.intakeSteps
  navLinks: typeof enArchiveFields.navLinks
  menuLinks: typeof enArchiveFields.menuLinks
}

export const enContent: ContentOverlay = {
  site: {
    role: 'Premium IT studio · systems, automations, converting websites',
    photoAlt:
      'Marcin Bochenek — portrait with tortoiseshell glasses, a smile, white t-shirt on a light background',
    subhead:
      'I design and ship systems that take work off the owner: a site that captures enquiries, less manual ops, automations with a human in the loop.',
    valueProp:
      'I build websites that capture enquiries and sell — and the tools behind them: booking on your own domain, an ops panel instead of Excel, HITL automation, measurement before and after.',
    aboutQuote:
      'I don’t sell slide decks — I ship what still works after hours, when nobody on the team is picking up.',
    aboutLead:
      'I’m a builder: I count hours and PLN first, then write code. Websites, panels and automations — measurable results after go-live, not promises from a pitch.',
    aboutAside:
      'Poland, remote and on-site in the Tri-City. I reply within one business day. A small company gets a proper branded site from PLN 2,000 (up to 5 pages, no marketplace template); a company site with a conversion funnel and integrations — from PLN 8,000; booking platforms, panels and APIs — from PLN 25,000, when ROI makes sense on both sides.',
    ctaPrimary: 'Book a 20-min audit',
    ctaSecondary: 'See work',
    ctaCalendly: 'Book a 20-min audit',
    footerCta: {
      line1: '20-minute audit',
      line2: 'how many hours do you get back?',
    },
    location: 'Poland · remote',
    responseTime: 'Reply within 1 business day',
    icpBadge: 'Websites from PLN 2,000 · systems from PLN 8,000',
    icpBadgeShort: 'Websites from PLN 2,000 · systems from PLN 8,000',
    minBudget: 'PLN 2,000',
  },
  resultsDisclaimer:
    '* Directional estimates — they depend on volume, number of channels and what you already have live. On the 20-min audit I will scope your case.',
  results: [
    {
      value: '8–15 h',
      label: 'less on guest email and WhatsApp / month*',
      hint: 'Guest assistant + booking on your own site',
    },
    {
      value: '10–15%',
      label: 'cheaper for the guest vs Booking/Airbnb',
      hint: 'Mint Apartments — booking on your own site',
    },
    {
      value: '12–20 h',
      label: 'less on invoices and filings / month*',
      hint: 'Sole prop (JDG) on Plumm vs Excel + separate tools',
    },
    {
      value: 'PLN 300–600',
      label: 'less per month than a traditional accountant (JDG)',
      hint: 'Plumm from PLN 149 vs a bookkeeping office',
    },
  ],
  services: [
    {
      title: 'Company website and conversion funnel',
      description:
        'For a small company — a solid branded site with a form and a clear call to action, so clients land with you, not in a void. As you grow — a site built to sell, enquiry qualification and booking on your own domain (cheaper than Booking.com). A brochure site is not a full sales engine; we plan the expansion from day one.',
      tags: ['Conversion', 'Fast site', 'Google visibility'],
      outcome: 'From a brochure site to a site that sells',
      timeline: '2–6 weeks',
      from: 'from PLN 2,000',
      deliverables: [
        'Up to 5 pages (e.g. home, offer, about, work, contact) — designed for your brand, not a marketplace template',
        'Contact form with notifications — enquiry qualification in the Launch package',
        'Mobile speed, basic on-page SEO and enquiry measurement after launch',
        'Expansion path: landings, booking on your own site, a full funnel — in the Launch package',
      ],
    },
    {
      title: 'Ops panel and integrations instead of Excel',
      description:
        'Invoices, booking calendars, door locks, tax filings — one flow instead of five sheets and five logins. The team does the same work in 10 minutes, not two hours of manual handling.',
      tags: ['E-invoices', 'Calendars', 'One process'],
      outcome: 'Done with Excel and five logins',
      timeline: '6–12 weeks',
      from: 'quoted after audit',
      deliverables: [
        'Ops panel or an integration with the software you already use',
        'Connections: e-invoices, booking calendars, locks, filing submissions to the tax office',
        'One data flow instead of separate logins',
        'Staging build and team training before go-live',
      ],
    },
    {
      title: 'AI that knows your offer',
      description:
        'A 24/7 guest assistant, a bookkeeping helper, automation of repetitive tasks — with a human in the loop and a full record of every step. Fewer “where’s the code?” calls — escalate to a person when needed.',
      tags: ['24/7 assistant', 'Customer support', 'Full audit trail'],
      outcome: '24/7 coverage without growing the team',
      timeline: '4–10 weeks',
      from: 'quoted after audit',
      deliverables: [
        'AI assistant with a hard action scope — allowed actions only',
        'A record of every step — who did what and why',
        'Human escalation when confidence is low',
        'Cost estimate before going live',
      ],
    },
  ],
  pricingPackages: [
    {
      name: 'Audit Sprint',
      range: 'from PLN 1,500',
      qualifier: 'When you need a decision, not another brief.',
      bestFor:
        'The owner has a site, a process or an AI idea, but does not know where money and time actually leak.',
      deliverables: [
        'funnel / process map with bottlenecks',
        '30/60/90-day priorities',
        'ROI estimate and integration risks',
        'decision: ship, wait, or cut scope',
      ],
      proof: 'The sprint fee can be credited toward delivery if both sides see a case after the audit.',
    },
    {
      name: 'Start',
      range: 'from PLN 2,000',
      qualifier: 'A brochure site or landing page up to 5 pages — custom for your brand, not a marketplace template.',
      bestFor:
        'A small company, freelancer or local business: you need a professional site, a contact form and a clear CTA to start — no integrations or funnel yet.',
      deliverables: [
        'up to 5 pages: home, offer, about, work/contact (scope locked on the audit)',
        'contact form with notifications and basic spam protection',
        'mobile speed (Core Web Vitals) and on-page SEO',
        'built so it can be extended without a rebuild from scratch',
      ],
      proof:
        'Out of scope: copy from scratch, a blog, CRM, calendar or booking integrations — that is the Launch package. When enquiries grow, we add the funnel and integrations.',
    },
    {
      name: 'Launch',
      range: 'from PLN 8,000',
      qualifier: 'When the site should sell and measure the result — not just inform.',
      bestFor:
        'A company needs a site with a conversion funnel: a form feeding your CRM, a calendar, technical SEO and measurement from click to lead.',
      deliverables: [
        'messaging strategy and site structure built to sell',
        'integrations: form → CRM, calendar/booking, technical SEO',
        'calls to action and an enquiry-qualification path',
        'conversion measurement and post-launch fixes',
      ],
      proof: 'We close scope on a measurable goal: lead, booking, enquiry, or shorter handling time.',
    },
    {
      name: 'Platforma',
      range: 'from PLN 25,000',
      qualifier: 'For companies whose problem is operations, not only marketing.',
      bestFor:
        'You have sales, a team and a repeatable process: booking, an ops panel, an API, multiple languages, automated tests.',
      deliverables: [
        'booking / ops panel or a team application',
        'API and connections to payments, calendars, e-invoices and booking systems',
        'multilingual (PL/EN/UA and more) plus automated tests before launch',
        'staging, team training and measurement after go-live',
      ],
      proof: 'Before code we lock before/after metrics — at this budget a pretty UI with no result is not enough.',
      featured: true,
    },
    {
      name: 'AI Ops',
      range: 'from PLN 3,000 / month',
      qualifier: 'Agents, automations, maintenance and ongoing development — human in the loop.',
      bestFor:
        'You already have a site or a system and want agents/automations running in production, plus someone maintaining and growing it month to month.',
      deliverables: [
        'AI assistant/agent with a hard scope of allowed actions',
        'a record of every step and human escalation when confidence is low',
        'maintenance, monitoring and post-launch fixes',
        'feature development in following months based on production data',
      ],
      proof: 'Monthly billing — cancel any time, no fixed-term contract.',
    },
  ],
  projects: {
    mint: {
      tagline: '36 apartments · booking on your own site · 24/7 guest assistant',
      description:
        'A system for a short-let operator: booking on your own domain (10–15% cheaper than Booking.com), self check-in with Tedee/Nuki, a guest assistant in 7 languages. Estimate: 8–15 h/month* less on repetitive guest questions.',
      client: 'Mint Apartments — operator of 36 apartments in Gdańsk (since 2017)',
      outcome:
        'The guest pays less than on a booking portal, checks in at any hour, and the team runs 3 districts from one Previo panel. Portal commission stays with you — as margin, not an intermediary cost.',
      pain: 'Portal commissions (Booking, Airbnb) ate the margin. The offer was split across languages. Check-in needed a reception. The old site could not keep up with phones and search.',
      contribution:
        'Fast site + Previo booking panel, WhatsApp guest assistant, Tedee/Nuki locks, settlements into Plumm, language versions.',
      decisions: [
        'Booking on every listing card — the same night cheaper, no hidden portal commission',
        'Assistant with apartment context — not a generic chat',
        'Previo instead of building our own channel manager',
      ],
      tags: ['Hospitality', 'Direct booking', 'Guest assistant'],
      stack: ['Astro', 'React', 'Previo (booking + calendar)', 'Tedee / Nuki', 'WhatsApp', 'Multilingual'],
      howItWorks: [
        'The guest picks an apartment and dates — live calendar and prices from Previo',
        'Pays online on your site — cheaper than Booking.com',
        'Gets a Tedee/Nuki lock code and checks in alone, any time',
        'The assistant answers in 7 languages and hands off to a human when needed',
        'The owner sees bookings in Previo — invoices and settlements go to Plumm',
      ],
    },
    plumm: {
      tagline: 'Company panel · bookkeeping · CRM · AI',
      description:
        'A Polish online platform: bookkeeping for sole props (JDG) and companies, a tax assistant, CRM and mail — one panel instead of Excel, separate tools and a PLN 300–600/month office. E-invoices to the tax office, PIT/VAT/ZUS, filings in one click. Typically 12–20 h/month* less paperwork at a regular invoice volume.',
      client: 'PLUMM Sp. z o.o. — own online product',
      outcome:
        'One panel after login: e-invoices, CRM, mail and filings in one place. Deadlines on a calendar, filings to the office in one click. A tax answer in minutes — not two days from the accountant.',
      pain: 'Invoices, KPiR, ZUS and filings lived in separate tools. The office was expensive and slow. One missed submission = a fine.',
      contribution:
        'Site, pricing, app.plumm.pl panel: e-invoices, CRM, company mail, tax assistant with handoff to an accountant, plans PLN 0–2,000+/month.',
      decisions: [
        'One app — invoices, filings and the assistant in one place',
        'E-invoices to the tax office from day one — not a paid add-on',
        'Assistant + accountant on hard cases — speed without the risk',
      ],
      tags: ['Online bookkeeping', 'E-invoices', 'JDG'],
      stack: [
        'Next.js',
        'TypeScript',
        'KSeF',
        'JPK filings',
        'CRM',
        'Company mail',
        'Tax assistant',
        'app.plumm.pl',
      ],
      howItWorks: [
        'You issue an invoice — it goes to the tax office automatically, already compliant',
        'Plumm calculates PIT, VAT and ZUS live — you see liabilities before the deadline',
        'You close the month and send the filing from the panel in one click',
        'A tax question — you ask the assistant in Polish; harder cases go to an accountant',
      ],
    },
    idrive: {
      domain: 'idrivecars.pl · before public launch',
      tagline: 'Motoring journal · publishing without WordPress',
      description:
        'An editorial daily: tests, optimized photos, a fast site. Easier publishing and better Google visibility = more search traffic for the same editorial effort.',
      client: 'Own media product',
      outcome:
        'Hundreds of articles in one fast site. Publish from one place — no plugins that break after an update.',
      pain: 'Word, heavy photos, no template. Every piece took too long from idea to published.',
      contribution: 'Fast site, content editor, automatic image optimization, sitemap for search.',
      decisions: [
        'Content in one place — full version control',
        'Light photos and curated galleries — mobile speed',
        'One site address for search',
      ],
      tags: ['Media', 'Google visibility', 'Fast site'],
      stack: ['Next.js', 'MDX', 'Image optimization', 'Sitemap'],
      howItWorks: [
        'You write in the editor — content is stored safely and versioned',
        'Photos and galleries are compressed automatically — fast load on a phone',
        'You publish without WordPress, plugins and updates that break things',
        'The article is search-ready for Google from the start',
      ],
    },
    agentic: {
      domain: 'internal system · B2B',
      tagline: 'Repeatable processes · audit of every step',
      description:
        'Automation of repetitive work with a human in the loop: a hard list of allowed actions, a record of every step. Estimate: 5–10 h/week* less on reports, syncs and repetitive queries — with a full who/what/why history.',
      client: 'Internal product · automation for companies',
      outcome:
        'The team drops manual copy-paste. Every step is logged — an audit without a chat black box.',
      pain: 'Chat commands with no accountability. A client will not ship that in-house without logs and limits.',
      contribution:
        'Process engine, connections to external systems, task queues, HITL, cost estimate.',
      decisions: [
        'A record of every step — not only the final answer',
        'Allowed actions only — less risk than full system access',
        'A human takes over when confidence is low',
      ],
      tags: ['Automation', 'HITL', 'Audit trail'],
      stack: ['Process engine', 'Integrations', 'Allowed actions', 'Task queues', 'HITL', 'Cost estimate'],
      howItWorks: [
        'The assistant gets a task and a list of allowed actions — nothing outside that scope',
        'It runs steps, and each one is logged — who, what and why',
        'When confidence is low the system hands the decision to a human instead of guessing',
        'Run cost is estimated live — no surprise on the invoice',
      ],
    },
  },
  faq: [
    {
      question: 'How much does it cost and what drives the price?',
      answer:
        'Brochure site or landing (up to 5 pages, form, basic SEO): from PLN 2,000 — the Start package. A company site with a conversion funnel and integrations (form → CRM, calendar, technical SEO, measurement): from PLN 8,000 — Launch. A platform: booking on your own site, an ops panel, an API, multilingual: from PLN 25,000 — when the return is real (hours of handling recovered, portal commissions, cost of manual work). AI Ops — agents and automations with maintenance: from PLN 3,000/month. After the audit you get a range and one recommendation, not three “gut feel” quotes.',
    },
    {
      question: 'Do we sign an NDA and who owns the code?',
      answer:
        'Yes — NDA is standard. Code and configuration belong to you once invoices are paid, unless we agree otherwise (e.g. a licence on an open-source component).',
    },
    {
      question: 'Will AI replace my team?',
      answer:
        'No. The assistant takes repetitive questions and steps (guest replies, invoice draft, report). A human stays on decisions, disputes and filings. Every automation has a step log — you know where an answer came from.',
    },
    {
      question: 'How long is the first delivery?',
      answer:
        'A site with a form: 2–4 weeks. Booking on your own site / a panel wired to other software: usually 6–12 weeks, depending on what we connect (Previo, e-invoices, door locks). On the audit I will give a number for your case.',
    },
    {
      question: 'What if I already have an agency / another developer?',
      answer:
        'I can enter an existing site or build a module beside it — e.g. a guest assistant or a filing export. No rewrite of everything “because it looks nicer”.',
    },
    {
      question: 'Do you work with companies outside the Tri-City?',
      answer:
        'Yes — remotely across Poland. On-site in Gdańsk/Gdynia/Sopot when you need a workshop with the team in the room.',
    },
  ],
  liveProof: [
    {
      name: 'Mint Apartments',
      url: 'https://mintapartments.pl',
      result:
        '36 apartments with booking on the operator’s own site — the guest pays 10–15% less than on Booking.com, 24/7 check-in, guest assistant in 7 languages.',
      tag: 'Hospitality',
    },
    {
      name: 'Plumm',
      url: 'https://plumm.pl',
      result:
        'Company panel: online bookkeeping, e-invoices, CRM, mail and a tax assistant — instead of Excel and a separate office.',
      tag: 'Online bookkeeping',
    },
  ],
  trustPoints: [
    {
      title: 'You pay when ROI holds',
      description:
        'I start a project when the audit shows a real hour recovery or saving. If it does not pay — I say so.',
    },
    {
      title: 'The code is yours',
      description:
        'NDA is standard. After invoices are paid, code and configuration are yours — no forever lock-in to one vendor.',
    },
    {
      title: 'I ship and stay on the numbers',
      description:
        'After go-live we compare before/after. If the numbers miss — I fix. One person owns the whole thing.',
    },
    {
      title: 'Metrics you can audit after the call',
      description:
        'I do not invent testimonials. After the call we verify: enquiry volume, handling time, commissions, cost of manual work and integration risk.',
    },
  ],
  contactFields: [
    { id: 'name', label: 'Full name', type: 'text', required: true },
    { id: 'email', label: 'Work email', type: 'email', required: true },
    {
      id: 'company',
      label: 'Company / site',
      type: 'text',
      required: true,
      placeholder: 'Company name or current site URL',
    },
    {
      id: 'projectType',
      label: 'What do you want to improve',
      type: 'select',
      required: true,
      options: [
        'Company website / brochure site with a form',
        'Site / landing built for conversion',
        'Booking on your own site / payments',
        'Ops panel or integrations',
        'Guest assistant / support automation',
        'Audit and priorities before a build',
      ],
    },
    {
      id: 'budget',
      label: 'Net budget',
      type: 'select',
      required: true,
      options: [
        'from PLN 1,500 — audit',
        'from PLN 2,000 — website / landing (Start)',
        'from PLN 8,000 — website + funnel (Launch)',
        'from PLN 25,000 — platform / panel / API',
        'from PLN 3,000 / month — AI Ops',
        'I don’t know — I want to calculate ROI',
      ],
    },
    {
      id: 'timeline',
      label: 'When do you want to start',
      type: 'select',
      required: true,
      options: ['Now / within 30 days', '1–3 months', '3+ months', 'Audit first'],
    },
    {
      id: 'message',
      label: 'What is burning time or money today?',
      type: 'textarea',
      required: true,
      placeholder:
        'e.g. 40 guest emails a day, invoices in Excel, no booking on the site, too much manual handling…',
    },
  ],
  leadForm: {
    title: 'Qualification brief',
    intro:
      'Six fields instead of a long survey. The more concrete the cost of the problem, the faster we filter projects with no ROI.',
    submit: 'Send brief',
    submitting: 'Sending…',
    thanksTitle: 'Thanks — I have context',
    thanksBody: 'I will reply within one business day with an audit proposal and a time range.',
  },
  ...enArchiveFields,
}
