import {
  faq,
  marqueeItems,
  pricing,
  process,
  projects,
  qualificationFields,
  services,
  site,
  testimonials,
} from './content'
import {
  faqEn,
  marqueeItemsEn,
  pricingEn,
  processEn,
  projectsEn,
  qualificationFieldsEn,
  servicesEn,
  siteEn,
  testimonialsEn,
} from './content.en'
import type { Locale } from '../chrome/i18n/types'

export type LocalizedContent = {
  site: typeof site
  projects: typeof projects
  services: typeof services
  pricing: typeof pricing
  faq: typeof faq
  process: typeof process
  testimonials: typeof testimonials
  marqueeItems: typeof marqueeItems
  qualificationFields: typeof qualificationFields
}

/**
 * Returns the shared data set for a locale, falling back to Polish for any
 * field a locale does not override. Only the language-dependent slice of
 * `site` is replaced — brand identity fields (email, github, calendly…)
 * stay shared across locales.
 */
export function getContent(locale: Locale): LocalizedContent {
  if (locale === 'en') {
    return {
      site: { ...site, ...siteEn },
      projects: projectsEn,
      services: servicesEn,
      pricing: pricingEn,
      faq: faqEn,
      process: processEn,
      testimonials: testimonialsEn,
      marqueeItems: marqueeItemsEn,
      qualificationFields: qualificationFieldsEn,
    }
  }

  return {
    site,
    projects,
    services,
    pricing,
    faq,
    process,
    testimonials,
    marqueeItems,
    qualificationFields,
  }
}
