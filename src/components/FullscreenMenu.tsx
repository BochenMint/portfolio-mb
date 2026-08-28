import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../animation/gsap'
import { menuLinks, site } from '../i18n/live'
import { useReducedMotion } from '../hooks/useReducedMotion'

type FullscreenMenuProps = {
  open: boolean
  onClose: () => void
}

function lockBodyScroll(lock: boolean) {
  document.body.style.overflow = lock ? 'hidden' : ''
}

export function FullscreenMenu({ open, onClose }: FullscreenMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(open)
  const ctaHref = site.calendly || '#contact'
  const isExternal = Boolean(site.calendly)

  const handleLinkClick = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    lockBodyScroll(open)
    return () => lockBodyScroll(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open || !mounted) return
    const panel = panelRef.current
    if (!panel) return

    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    panel.addEventListener('keydown', onKeyDown)
    return () => panel.removeEventListener('keydown', onKeyDown)
  }, [open, mounted])

  useGSAP(
    () => {
      if (!mounted) return
      const panel = panelRef.current
      const links = linkRefs.current.filter(Boolean)
      if (!panel) return

      if (reduced) {
        gsap.set(panel, { visibility: open ? 'visible' : 'hidden', opacity: open ? 1 : 0 })
        gsap.set(links, { opacity: open ? 1 : 0, y: 0 })
        if (!open) setMounted(false)
        return
      }

      if (open) {
        gsap.set(panel, { visibility: 'visible' })
        gsap.fromTo(
          panel,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65, ease: 'power4.inOut' },
        )
        gsap.fromTo(
          links,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.1,
          },
        )
        gsap.fromTo(
          '[data-menu-meta]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, delay: 0.35 },
        )
      } else {
        gsap.to(links, {
          y: -48,
          opacity: 0,
          duration: 0.32,
          stagger: 0.05,
          ease: 'power2.in',
        })
        gsap.to(panel, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.5,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(panel, { visibility: 'hidden' })
            setMounted(false)
          },
        })
      }
    },
    { dependencies: [open, mounted, reduced] },
  )

  if (!mounted) return null

  return (
    <div
      ref={panelRef}
      id="fullscreen-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu nawigacji"
      className="menu-overlay fixed inset-0 z-[90] flex flex-col bg-[var(--color-ink)] text-[var(--color-paper)]"
      style={{ visibility: open ? 'visible' : 'hidden' }}
    >
      {/* Dekoracyjny akcent — subtelna linia bursztynowa w tle */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full bg-[var(--color-accent)]/[0.03] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[var(--color-accent-deep)]/[0.04] blur-3xl" />
      </div>

      {/* Header row */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10 lg:px-16">
        <span className="font-headline text-lg tracking-tight">{site.name.split(' ')[0]}</span>
        <button
          type="button"
          onClick={onClose}
          className="menu-close text-[10px] font-semibold tracking-[0.22em] uppercase transition-opacity hover:opacity-60"
        >
          Zamknij
        </button>
      </div>

      {/* Nav links */}
      <nav
        className="relative z-10 flex flex-1 flex-col justify-center overflow-y-auto px-6 pb-16 md:px-10 lg:px-16"
        aria-label="Sekcje"
      >
        <ul className="space-y-1 md:space-y-2">
          {menuLinks.map((link, idx) => (
            <li key={link.href}>
              <a
                ref={(el) => {
                  linkRefs.current[idx] = el
                }}
                href={link.href}
                onClick={handleLinkClick}
                className="menu-link group flex items-baseline gap-4 py-1 md:gap-6"
              >
                {/* Numer — mono, bursztyn na hover */}
                <span className="font-mono text-xs tracking-[0.2em] text-[var(--color-paper)]/35 tabular-nums transition-colors duration-200 group-hover:text-[var(--color-accent)]">
                  {link.num}
                </span>
                {/* Label — headline, rośnie letter-spacing i pojawia się bursztynowy underline na hover */}
                <span className="relative font-headline text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] tracking-tight transition-[letter-spacing] duration-300 group-hover:tracking-wide">
                  {link.label}
                  <span
                    className="accent-hairline absolute bottom-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Meta info */}
        <p
          data-menu-meta
          className="mt-16 max-w-md text-sm leading-relaxed text-[var(--color-paper)]/50 md:mt-20"
        >
          {site.valueProp}
        </p>
        <p data-menu-meta className="mt-4 font-mono text-xs tracking-[0.14em] text-[var(--color-paper)]/30 uppercase">
          {site.location}
        </p>

        <a
          data-menu-meta
          href={ctaHref}
          onClick={handleLinkClick}
          className="mt-8 flex w-full max-w-md items-center justify-between border border-accent/40 bg-accent px-5 py-4 text-[var(--color-on-accent)] md:hidden"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span>
            <span className="block font-mono text-[9px] tracking-[0.14em] uppercase opacity-70">
              20-min audyt
            </span>
            <span className="block text-sm font-semibold">Policzmy zakres i ROI</span>
          </span>
          <span aria-hidden className="font-mono text-sm">
            →
          </span>
        </a>
      </nav>
    </div>
  )
}
