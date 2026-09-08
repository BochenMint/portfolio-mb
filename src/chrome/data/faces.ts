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
}

const registry: Record<string, Face[]> = {
  idrive: idriveFaces as Face[],
  mint: mintFaces as Face[],
  plumm: plummFaces as Face[],
  agentic: agenticFaces as Face[],
}

/** Returns the 3D-cube face set for a project id (empty array if unknown). */
export function facesFor(projectId: string): Face[] {
  return registry[projectId] ?? []
}
