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

/** WebGL texture — hero tier (1920px) for fast load and broad GPU support. */
export function projectImageTextureUrl(project: Project, variant: 'hero' | 'card' = 'card') {
  const scene = sceneFor(project, variant)
  return `/projects/${project.id}/${scene}-hero.webp`
}

/** Legacy alias — same as texture URL. */
export function projectImageUrl(project: Project, variant: 'hero' | 'card' = 'card') {
  return projectImageTextureUrl(project, variant)
}
