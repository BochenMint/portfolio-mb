import type { Project } from '../data/content'
import {
  useProjectImagePointer,
  type ImageInteractionLevel,
} from '../hooks/useProjectImagePointer'
import { ProjectImage } from './ProjectImage'

type Props = {
  project: Project
  variant?: 'hero' | 'card'
  className?: string
  priority?: boolean
  interaction?: ImageInteractionLevel | 'off'
}

export function ProjectImageInteractive({
  project,
  variant = 'card',
  className = '',
  priority,
  interaction = 'subtle',
}: Props) {
  const enabled = interaction !== 'off'
  const level = enabled ? interaction : 'subtle'
  const { rootRef, interactive } = useProjectImagePointer(level, enabled)

  if (!enabled || !interactive) {
    return (
      <ProjectImage
        project={project}
        variant={variant}
        className={className}
        priority={priority}
      />
    )
  }

  const isHero = interaction === 'hero'

  return (
    <div
      ref={rootRef}
      className={`project-interactive h-full w-full ${isHero ? 'project-interactive--hero' : 'project-interactive--subtle'}`}
    >
      <div data-tilt className="project-interactive__tilt relative h-full w-full">
        <div
          data-parallax
          className={`project-interactive__media h-full w-full ${className}`}
        >
          <ProjectImage
            project={project}
            variant={variant}
            className="rounded-none"
            priority={priority}
          />
        </div>
        {isHero ? (
          <div data-shine className="project-interactive__shine" aria-hidden />
        ) : null}
      </div>
    </div>
  )
}
