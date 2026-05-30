import { Component, lazy, Suspense, useCallback, useState, type ReactNode } from 'react'
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

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) {
      console.warn('[WebGL] error boundary', error)
    }
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

  const handleWebglFallback = useCallback(() => setWebglFailed(true), [])

  const enabled = interaction !== 'off' && capable && !webglFailed
  const showCssFallback = interaction !== 'off' && (!capable || webglFailed)
  const level: DisplacementLevel = interaction === 'off' ? 'subtle' : interaction

  return (
    <div
      className={`project-interactive relative h-full w-full overflow-hidden ${showCssFallback ? 'project-interactive--css-fallback' : ''} ${className}`}
      data-webgl-enabled={enabled ? 'true' : 'false'}
    >
      <div
        data-project-media-reveal
        className="project-interactive__reveal absolute inset-0 z-0 h-full w-full"
      >
        <ProjectImage
          project={project}
          variant={variant}
          className="project-interactive__still relative h-full w-full"
          priority={priority}
        />
      </div>
      {enabled ? (
        <Suspense fallback={null}>
          <WebGLImageErrorBoundary onError={handleWebglFallback}>
            <ProjectImageWebGL
              project={project}
              variant={variant}
              level={level}
              onFallback={handleWebglFallback}
            />
          </WebGLImageErrorBoundary>
        </Suspense>
      ) : null}
    </div>
  )
}
