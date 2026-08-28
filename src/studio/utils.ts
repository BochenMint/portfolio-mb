import { proofProducts, site } from '../data/content'

export const ctaHref = site.calendly || '#kontakt'
export const isExternalCta = Boolean(site.calendly)

const proofByName: Record<string, (typeof proofProducts)[number]> = {
  mint: proofProducts[0]!,
  plumm: proofProducts[1]!,
  idrive: proofProducts[2]!,
  agentic: proofProducts[3]!,
}

export function projectLiveUrl(projectId: string): { url: string; live: boolean } {
  const proof = proofByName[projectId]
  if (!proof) return { url: '', live: false }
  return { url: proof.url, live: proof.live }
}

export function projectImage(projectId: string): string {
  return `/projects/${projectId}/hero-hero.webp`
}

function normalizeFormAccessKey(raw: string | undefined): string {
  const key = (raw || '').trim()
  if (!key) return ''
  if (/^your-web3forms-access-key$/i.test(key)) return ''
  return key
}

export const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || 'https://api.web3forms.com/submit'
export const formAccessKey = normalizeFormAccessKey(import.meta.env.VITE_FORM_ACCESS_KEY)
