import type { Project } from '../data/content'

export function sceneFor(project: Project, variant: 'hero' | 'card') {
  if (project.id === 'mint') {
    return variant === 'card' ? 'apartment' : 'hero'
  }
  if (project.id === 'plumm') {
    return 'split'
  }
  if (project.imageScene) return project.imageScene
  return 'hero'
}

/**
 * WebGL texture — hero tier (1920px) for fast load and broad GPU support.
 * Hero files should be 1920×1080 (16:9); full-page screenshots need crop/reframe before export.
 * Featured layout crops with object-fit: cover and object-position ~28% from top.
 */
export function projectImageTextureUrl(project: Project, variant: 'hero' | 'card' = 'card') {
  const scene = sceneFor(project, variant)
  return `/projects/${project.id}/${scene}-hero.webp`
}

/** Legacy alias — same as texture URL. */
export function projectImageUrl(project: Project, variant: 'hero' | 'card' = 'card') {
  return projectImageTextureUrl(project, variant)
}
