import type { Project } from '../data/content'

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
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn-fill text-sm ${className}`}
      >
        {label}
      </a>
    )
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-soft mt-5 inline-flex text-xs ${className}`}
    >
      {label}
    </a>
  )
}
