import { galleryForProject } from '../../data/gallery'
import type { PlanetId } from './world-anchors'

export type PanelImage = { src: string; alt: string }

const PROJECT_TITLE: Record<PlanetId, string> = {
  mint: 'Mint Apartments',
  plumm: 'Plumm',
  idrive: 'iDrive Cars',
  agentic: 'Agentic OS',
}

/**
 * Two screenshots per project for the discovery panel (ui/projectPanel.ts).
 * Prefer the production gallery (src/data/gallery.ts) at `srcSmall`.
 */
export function getPanelImages(id: PlanetId): PanelImage[] {
  const gallery = galleryForProject(id)
  if (gallery.length >= 2) {
    return gallery.slice(0, 2).map((entry) => ({ src: entry.srcSmall, alt: entry.caption }))
  }
  const title = PROJECT_TITLE[id]
  return [
    { src: `/projects/${id}/hero-card.webp`, alt: `${title} — podgląd interfejsu` },
    { src: `/projects/${id}/hero-full.webp`, alt: `${title} — drugi kadr interfejsu` },
  ]
}
