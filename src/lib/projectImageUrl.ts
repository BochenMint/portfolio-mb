import type { Project } from '../data/content'

export function sceneFor(project: Project, variant: 'hero' | 'card') {
  if (project.id === 'mint') {
    return variant === 'card' ? 'apartment' : 'hero'
  }
  if (project.id === 'plumm') {
    return variant === 'card' ? 'app' : 'dashboard'
  }
  if (project.imageScene) return project.imageScene
  return 'hero'
}

/** Primary WebP URL for WebGL texture (4K full variant). */
export function projectImageUrl(project: Project, variant: 'hero' | 'card' = 'card') {
  const scene = sceneFor(project, variant)
  const base = `/projects/${project.id}/${scene}`
  return `${base}-full.webp`
}
