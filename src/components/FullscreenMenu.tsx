import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../animation/gsap'
import { menuLinks, site } from '../data/content'
import { useReducedMotion } from '../hooks/useReducedMotion'

type FullscreenMenuProps = {
  open: boolean
  onClose: () => void
}

function lockBodyScroll(lock: boolean) {
  document.body.style.overflow = lock ? 'hidden' : ''
}

export function FullscreenMenu({ open, onClose }: FullscreenMenuProps) {
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(open)

  const handleLinkClick = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (open) setMounted(true)
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
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Menu nawigacji"
      className="menu-overlay fixed inset-0 z-[90] flex flex-col bg-[var(--color-ink)] text-[var(--color-paper)]"
      style={{ visibility: open ? 'visible' : 'hidden' }}
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-10 lg:px-16">
        <span className="font-headline text-lg tracking-tight">{site.name.split(' ')[0]}</span>
        <button
          type="button"
          onClick={onClose}
          className="menu-close text-[10px] font-semibold tracking-[0.22em] uppercase transition-opacity hover:opacity-60"
        >
          Zamknij
        </button>
      </div>

      <nav
        className="flex flex-1 flex-col justify-center overflow-y-auto px-6 pb-16 md:px-10 lg:px-16"
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
                <span className="menu-link-num text-xs font-medium tracking-[0.2em] text-[var(--color-paper)]/40 tabular-nums">
                  {link.num}
                </span>
                <span className="font-headline text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] tracking-tight transition-[letter-spacing] duration-300 group-hover:tracking-wide">
                  {link.label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p
          data-menu-meta
          className="mt-16 max-w-md text-sm leading-relaxed text-[var(--color-paper)]/50 md:mt-20"
        >
          {site.valueProp}
        </p>
        <p data-menu-meta className="mt-4 text-xs tracking-wide text-[var(--color-paper)]/35 uppercase">
          {site.location}
        </p>
      </nav>
    </div>
  )
}
