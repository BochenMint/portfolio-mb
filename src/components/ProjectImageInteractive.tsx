import { Component, lazy, Suspense, useState, type ReactNode } from 'react'
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

type BoundaryProps = {
  children: ReactNode
  onError: () => void
}

type BoundaryState = { hasError: boolean }

class WebGLImageErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
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

  const enabled = interaction !== 'off' && capable && !webglFailed
  const level: DisplacementLevel = interaction === 'off' ? 'subtle' : interaction

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <ProjectImage
        project={project}
        variant={variant}
        className="relative z-0 h-full w-full"
        priority={priority}
      />
      {enabled ? (
        <Suspense fallback={null}>
          <WebGLImageErrorBoundary onError={() => setWebglFailed(true)}>
            <ProjectImageWebGL
              project={project}
              variant={variant}
              level={level}
              onFallback={() => setWebglFailed(true)}
            />
          </WebGLImageErrorBoundary>
        </Suspense>
      ) : null}
    </div>
  )
}
