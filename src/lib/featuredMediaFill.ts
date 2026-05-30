import type { Project } from '../data/content'

/**
 * Hero WebP exports are often full-page screenshots letterboxed inside 16:9.
 * CSS + WebGL UV zoom crops to the hero band so featured bleed looks fullscreen.
 */
/** WebGL v=0 is bottom; ~0.88 targets hero at top of letterboxed full-page exports */
export const DEFAULT_TEXTURE_CENTER_Y = 0.28

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
