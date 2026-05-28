import type { ReactNode } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'

type Props = {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}

export function MagneticButton({ href, children, className = '', external }: Props) {
  const ref = useMagnetic<HTMLAnchorElement>(0.25)

  return (
    <a
      ref={ref}
      href={href}
      data-magnetic
      className={`inline-flex will-change-transform ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
