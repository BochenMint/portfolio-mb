import { getLocalizedContent, type LocalizedContent } from './content'
import { localeFromWindow } from './path'

export type {
  ContactField,
  FaqItem,
  IntakeField,
  LiveProof,
  PricingPackage,
  ProcessStep,
  Project,
  ResultMetric,
  TrustPoint,
} from '../data/content'
export { proofProducts } from '../data/content'

function pick<T>(read: (content: LocalizedContent) => T): T {
  return read(getLocalizedContent(localeFromWindow()))
}

function liveObject<T extends object>(read: (content: LocalizedContent) => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      return Reflect.get(pick(read) as object, prop)
    },
    ownKeys() {
      return Reflect.ownKeys(pick(read) as object)
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Reflect.getOwnPropertyDescriptor(pick(read) as object, prop)
    },
    has(_target, prop) {
      return prop in (pick(read) as object)
    },
  })
}

function liveArray<T>(read: (content: LocalizedContent) => readonly T[]): T[] {
  return new Proxy([] as T[], {
    get(_target, prop) {
      const src = pick(read)
      const value = Reflect.get(src, prop, src)
      return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(src) : value
    },
    ownKeys() {
      return Reflect.ownKeys(pick(read))
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Reflect.getOwnPropertyDescriptor(pick(read), prop)
    },
    has(_target, prop) {
      return prop in pick(read)
    },
  })
}

/** Locale-bound content for archive MPA pages. Language switch is a full navigation. */
export const site = liveObject((c) => c.site)
export const sections = liveObject((c) => c.sections)
export const intakeCopy = liveObject((c) => c.intakeCopy)
export const leadForm = liveObject((c) => c.leadForm)
export const results = liveArray((c) => c.results)
export const services = liveArray((c) => c.services)
export const pricingPackages = liveArray((c) => c.pricingPackages)
export const projects = liveArray((c) => c.projects)
export const faq = liveArray((c) => c.faq)
export const liveProof = liveArray((c) => c.liveProof)
export const trustPoints = liveArray((c) => c.trustPoints)
export const contactFields = liveArray((c) => c.contactFields)
export const process = liveArray((c) => c.process)
export const intakeSteps = liveArray((c) => c.intakeSteps)
export const navLinks = liveArray((c) => c.navLinks)
export const menuLinks = liveArray((c) => c.menuLinks)

export function resultsDisclaimer(): string {
  return pick((c) => c.resultsDisclaimer)
}
