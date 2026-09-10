import type { Bag } from '../i18n/pick'
import idriveFaces from '../../../public/projects/idrive/faces.json'
import mintFaces from '../../../public/projects/mint/faces.json'
import plummFaces from '../../../public/projects/plumm/faces.json'
import agenticFaces from '../../../public/projects/agentic/faces.json'

export type Face = {
  file: string
  light: string | null
  id: string
  label: Bag
  caption: Bag
  provisional?: boolean
  /**
   * Faces that are drawn rather than photographed. `brand` is the engraved
   * chrome plate — it has no screenshot behind it, so `file` stays empty and
   * both the WebGL texture and the static fallback build the mark from
   * `public/brand/logo-mb-white.svg` instead of loading an image.
   */
  kind?: 'brand'
}

/**
 * The sixth face, identical on every cube: the MB helmet mark engraved into a
 * chrome plate. It is spliced in at index 4 — the cube's **top** face — so the
 * five screenshots keep the four lateral slots plus the bottom, and the mark
 * lands on the face the 12°-above camera already half-shows at rest.
 */
const BRAND_FACE: Face = {
  file: '',
  light: null,
  id: 'brand-mark',
  kind: 'brand',
  label: { pl: 'Logo', en: 'Logo' },
  caption: {
    pl: 'Znak marki — próba.',
    en: 'Brand mark — trial.',
  },
}

/** Screenshots 1–4 → lateral faces, brand plate → top, screenshot 5 → bottom. */
function withBrandFace(list: Face[]): Face[] {
  return [...list.slice(0, 4), BRAND_FACE, ...list.slice(4)]
}

const registry: Record<string, Face[]> = {
  idrive: withBrandFace(idriveFaces as Face[]),
  mint: withBrandFace(mintFaces as Face[]),
  plumm: withBrandFace(plummFaces as Face[]),
  agentic: withBrandFace(agenticFaces as Face[]),
}

/** Returns the 3D-cube face set for a project id (empty array if unknown). */
export function facesFor(projectId: string): Face[] {
  return registry[projectId] ?? []
}
