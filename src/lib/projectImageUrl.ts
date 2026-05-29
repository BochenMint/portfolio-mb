import type { Project } from '../data/content'

export function sceneFor(project: Project, variant: 'hero' | 'card') {
  if (project.id === 'mint') {
    return variant === 'card' ? 'apartment' : 'hero'
  }
  if (project.imageScene) return project.imageScene
  return 'hero'
}

/** Primary WebP URL for WebGL texture (highest quality for variant). */
export function projectImageUrl(project: Project, variant: 'hero' | 'card' = 'card') {
  const scene = sceneFor(project, variant)
  const base = `/projects/${project.id}/${scene}`
  return variant === 'hero' ? `${base}-hero.webp` : `${base}-card.webp`
}
