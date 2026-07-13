import { galleryForProject } from '../../data/gallery'
import type { PlanetId } from './world-anchors'

export type PanelImage = { src: string; alt: string }

/**
 * Two screenshots per project for the discovery panel (ui/projectPanel.ts).
 * Mint/Plumm already have a real production gallery (src/data/gallery.ts) —
 * reuse its first two entries at the smaller `srcSmall` size (panel is only
 * ~460px wide, no need for the 2400w originals). iDrive/Agentic don't have a
 * gallery yet, so fall back to the two hero export variants already shipped
 * under public/projects/{id}/.
 */
export function getPanelImages(id: PlanetId): PanelImage[] {
  if (id === 'mint' || id === 'plumm') {
    return galleryForProject(id)
      .slice(0, 2)
      .map((entry) => ({ src: entry.srcSmall, alt: entry.caption }))
  }
  return [
    { src: `/projects/${id}/hero-card.webp`, alt: `${id} — zrzut ekranu 1` },
    { src: `/projects/${id}/hero-full.webp`, alt: `${id} — zrzut ekranu 2` },
  ]
}
