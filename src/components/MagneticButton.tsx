import type { ButtonHTMLAttributes, ReactNode, RefObject } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'

type LinkProps = {
  as?: 'a'
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}

type ButtonProps = {
  as: 'button'
  children: ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

type Props = LinkProps | ButtonProps

export function MagneticButton(props: Props) {
  const strength = 0.28
  const ref = useMagnetic<HTMLElement>(strength)
  const className = `inline-flex will-change-transform ${props.className ?? ''}`

  if (props.as === 'button') {
    const { as: _as, className: _className, children, ...rest } = props
    void _as
    void _className
    return (
      <button ref={ref as RefObject<HTMLButtonElement>} className={className} {...rest}>
        {children}
      </button>
    )
  }

  const { href, children, external } = props
  return (
    <a
      ref={ref as RefObject<HTMLAnchorElement>}
      href={href}
      data-magnetic
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
