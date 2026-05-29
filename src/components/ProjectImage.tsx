import type { Project } from '../data/content'
import { sceneFor } from '../lib/projectImageUrl'

type Props = {
  project: Project
  variant?: 'hero' | 'card'
  className?: string
  priority?: boolean
}

const HERO_W = 1920
const CARD_W = 1200

export function ProjectImage({
  project,
  variant = 'card',
  className = '',
  priority,
}: Props) {
  const scene = sceneFor(project, variant)
  const base = `/projects/${project.id}/${scene}`
  const isFlagshipLcp = priority ?? (project.flagship && variant === 'hero')

  const heroSrc = `${base}-hero.webp`
  const cardSrc = `${base}-card.webp`

  const width = variant === 'hero' ? HERO_W : CARD_W
  const height = variant === 'hero' ? 1080 : 675

  return (
    <picture className={`block h-full w-full ${className}`}>
      <source
        type="image/webp"
        srcSet={`${cardSrc} 1200w, ${heroSrc} 1920w`}
        sizes={
          variant === 'hero'
            ? '(min-width: 1024px) 42vw, 100vw'
            : '(min-width: 1024px) 50vw, 100vw'
        }
      />
      <img
        src={variant === 'hero' ? heroSrc : cardSrc}
        alt={`${project.title} — ${project.tagline}`}
        width={width}
        height={height}
        loading={isFlagshipLcp ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={isFlagshipLcp ? 'high' : 'auto'}
        className="h-full w-full object-cover object-top"
      />
    </picture>
  )
}
