import type { Project } from '../data/content'

/**
 * Hero WebP exports are 16:9 viewport crops. CSS + WebGL UV center anchors object-fit / cover sampling.
 */
/** WebGL v=0 is bottom; 0.5 = optical center of the frame */
export const DEFAULT_TEXTURE_CENTER_Y = 0.5

export type TextureCoverFill = {
  zoom: number
  centerY: number
}

export function textureCoverForProject(
  project: Project,
  variant: 'hero' | 'card',
): TextureCoverFill {
  if (variant !== 'hero') {
    return { zoom: 1, centerY: DEFAULT_TEXTURE_CENTER_Y }
  }
  if (project.heroMediaFill) {
    return project.heroMediaFill
  }
  return { zoom: 1, centerY: DEFAULT_TEXTURE_CENTER_Y }
}
