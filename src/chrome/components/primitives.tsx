import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { useMagnetic } from '../../hooks/useMagnetic'

/* ---------- ChromeCard ------------------------------------------------
   Polished chrome surface. Reflection follows the cursor via [data-chrome].
   `tone="light"` = mirror-bright surface with dark text (use sparingly:
   one per viewport for hierarchy). `tone="brushed"` = brushed steel.
---------------------------------------------------------------------- */
type CardProps = HTMLAttributes<HTMLElement> & {
  tone?: 'dark' | 'light' | 'brushed'
  as?: 'div' | 'article' | 'section' | 'li'
  children: ReactNode
}

export function ChromeCard({ tone = 'dark', as = 'div', className = '', children, ...rest }: CardProps) {
  const Tag = as
  const base =
    tone === 'brushed' ? 'brushed' : tone === 'light' ? 'chrome-card chrome-card-light' : 'chrome-card'
  return (
    <Tag data-chrome className={`${base} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/* ---------- Buttons --------------------------------------------------- */
type LinkBtnProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'chrome' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  external?: boolean
  magnetic?: boolean
  children: ReactNode
}

const sizes = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-[15px]',
}

export function LinkButton({
  variant = 'chrome',
  size = 'md',
  external,
  magnetic = true,
  className = '',
  children,
  ...rest
}: LinkBtnProps) {
  const ref = useMagnetic<HTMLAnchorElement>(magnetic ? 0.25 : 0)
  return (
    <a
      ref={ref}
      data-magnetic
      className={`${variant === 'chrome' ? 'chrome-btn' : 'ghost-btn'} ${sizes[size]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'chrome' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({ variant = 'chrome', size = 'md', className = '', children, ...rest }: BtnProps) {
  return (
    <button
      data-magnetic
      className={`${variant === 'chrome' ? 'chrome-btn' : 'ghost-btn'} ${sizes[size]} disabled:cursor-wait disabled:opacity-70 ${className}`}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
}

/* ---------- Section header ------------------------------------------- */
type HeaderProps = {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({ eyebrow, title, lead, align = 'left', className = '' }: HeaderProps) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <p data-reveal className="eyebrow">
        {eyebrow}
      </p>
      <h2
        data-reveal
        className="chrome-text mt-5 text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold"
      >
        {title}
      </h2>
      {lead && (
        <p data-reveal className="mt-6 max-w-2xl text-base leading-relaxed text-silver-2 md:text-lg">
          {lead}
        </p>
      )}
    </div>
  )
}

/* ---------- Accent for one word of emphasis --------------------------
 * Weight contrast inside the display face rather than a second typeface:
 * the liquid-chrome overlay repaints the whole headline, so an accent can
 * only read through glyph shape — colour and style differences vanish
 * underneath it. Light against the headline's semibold does read. */
export function Em({ children }: { children: ReactNode }) {
  return <em className="font-light tracking-[-0.02em] not-italic">{children}</em>
}

/* ---------- Arrow icon ------------------------------------------------ */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}
