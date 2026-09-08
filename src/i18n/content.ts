import {
  contactFields as contactFieldsPl,
  faq as faqPl,
  intakeCopy as intakeCopyPl,
  intakeSteps as intakeStepsPl,
  leadForm as leadFormPl,
  liveProof as liveProofPl,
  menuLinks as menuLinksPl,
  navLinks as navLinksPl,
  pricingPackages as pricingPackagesPl,
  process as processPl,
  projects as projectsPl,
  results as resultsPl,
  resultsDisclaimer as resultsDisclaimerPl,
  sections as sectionsPl,
  services as servicesPl,
  site as sitePl,
  trustPoints as trustPointsPl,
  type ContactField,
  type FaqItem,
  type LiveProof,
  type PricingPackage,
  type Project,
  type ResultMetric,
  type TrustPoint,
} from '../data/content'
import type { Locale } from './locales'
import { enContent, type ContentOverlay } from './overlays/en'
import { ukContent } from './overlays/uk'

export type LocalizedContent = {
  site: typeof sitePl
  resultsDisclaimer: string
  results: ResultMetric[]
  services: typeof servicesPl
  pricingPackages: PricingPackage[]
  projects: Project[]
  faq: FaqItem[]
  liveProof: LiveProof[]
  trustPoints: TrustPoint[]
  contactFields: ContactField[]
  leadForm: typeof leadFormPl
  sections: typeof sectionsPl
  process: typeof processPl
  intakeCopy: typeof intakeCopyPl
  intakeSteps: typeof intakeStepsPl
  navLinks: typeof navLinksPl
  menuLinks: typeof menuLinksPl
}

const overlays: Record<Locale, ContentOverlay | null> = {
  pl: null,
  en: enContent,
  ua: ukContent,
}

function mergeProject(base: Project, over?: ContentOverlay['projects'][string]): Project {
  if (!over) return base
  return {
    ...base,
    ...over,
    decisions: over.decisions ?? base.decisions,
    tags: over.tags ?? base.tags,
    howItWorks: over.howItWorks ?? base.howItWorks,
    stack: over.stack ?? base.stack,
  }
}

function mergeServices(over: ContentOverlay['services']): typeof servicesPl {
  return servicesPl.map((base, i) => {
    const patch = over[i]
    if (!patch) return base
    return { ...base, ...patch }
  })
}

function build(locale: Locale): LocalizedContent {
  const over = overlays[locale]
  if (!over) {
    return {
      site: sitePl,
      resultsDisclaimer: resultsDisclaimerPl,
      results: resultsPl,
      services: servicesPl,
      pricingPackages: pricingPackagesPl,
      projects: projectsPl,
      faq: faqPl,
      liveProof: liveProofPl,
      trustPoints: trustPointsPl,
      contactFields: contactFieldsPl,
      leadForm: leadFormPl,
      sections: sectionsPl,
      process: processPl,
      intakeCopy: intakeCopyPl,
      intakeSteps: intakeStepsPl,
      navLinks: navLinksPl,
      menuLinks: menuLinksPl,
    }
  }

  return {
    site: { ...sitePl, ...over.site },
    resultsDisclaimer: over.resultsDisclaimer,
    results: over.results,
    services: mergeServices(over.services),
    pricingPackages: over.pricingPackages,
    projects: projectsPl.map((project) => mergeProject(project, over.projects[project.id])),
    faq: over.faq,
    liveProof: over.liveProof,
    trustPoints: over.trustPoints,
    contactFields: over.contactFields,
    leadForm: over.leadForm,
    sections: over.sections,
    process: over.process,
    intakeCopy: over.intakeCopy,
    intakeSteps: over.intakeSteps,
    navLinks: over.navLinks,
    menuLinks: over.menuLinks,
  }
}

const cache = new Map<Locale, LocalizedContent>()

export function getLocalizedContent(locale: Locale): LocalizedContent {
  const hit = cache.get(locale)
  if (hit) return hit
  const built = build(locale)
  cache.set(locale, built)
  return built
}
