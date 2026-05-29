import { lazy, Suspense, useState } from 'react'
import type { Project } from '../data/content'
import { useWebGLCapable } from '../hooks/useWebGLCapable'
import type { DisplacementLevel } from '../webgl/displacementConfig'
import { ProjectImage } from './ProjectImage'

const ProjectImageWebGL = lazy(() =>
  import('./ProjectImageWebGL').then((m) => ({ default: m.ProjectImageWebGL })),
)

export type ImageInteractionLevel = DisplacementLevel

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
  interaction = 'strong',
}: Props) {
  const { capable } = useWebGLCapable()
  const [webglFailed, setWebglFailed] = useState(false)

  const enabled = interaction !== 'off'
  const level: DisplacementLevel =
    interaction === 'off' ? 'subtle' : interaction

  if (!enabled || !capable || webglFailed) {
    return (
      <ProjectImage
        project={project}
        variant={variant}
        className={className}
        priority={priority}
      />
    )
  }

  return (
    <Suspense
      fallback={
        <ProjectImage
          project={project}
          variant={variant}
          className={className}
          priority={priority}
        />
      }
    >
      <ProjectImageWebGL
        project={project}
        variant={variant}
        level={level}
        className={className}
        onFallback={() => setWebglFailed(true)}
      />
    </Suspense>
  )
}
