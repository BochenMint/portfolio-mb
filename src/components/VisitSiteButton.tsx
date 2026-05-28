import type { Project } from '../data/content'
import { MagneticButton } from './MagneticButton'

type Props = {
  project: Project
  /** compact = case grid; prominent = flagship / work cards */
  variant?: 'compact' | 'prominent'
  className?: string
}

export function VisitSiteButton({
  project,
  variant = 'compact',
  className = '',
}: Props) {
  if (project.url === '#') return null

  const label = `Odwiedź ${project.domain} →`

  if (variant === 'prominent') {
    return (
      <MagneticButton
        href={project.url}
        external
        className={`rounded-full bg-mint px-6 py-3 text-sm font-bold text-ink shadow-[0_0_32px_rgba(62,232,196,0.2)] hover:scale-[1.02] ${className}`}
      >
        {label}
      </MagneticButton>
    )
  }

  return (
    <MagneticButton
      href={project.url}
      external
      className={`mt-5 inline-flex rounded-full border border-line px-5 py-2.5 text-xs font-semibold transition-colors hover:border-mint hover:text-mint ${className}`}
    >
      {label}
    </MagneticButton>
  )
}
