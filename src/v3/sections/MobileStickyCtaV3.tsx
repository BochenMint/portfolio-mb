import { useEffect, useState } from 'react'
import { site } from '../../i18n/live'

export function MobileStickyCtaV3() {
  const [visible, setVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)
  const ctaHref = site.calendly || '#kontakt'
  const isExternal = Boolean(site.calendly)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const contact = document.getElementById('kontakt')
    if (!contact) return

    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.18 },
    )
    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  if (!visible || contactVisible) return null

  return (
    <div className="fixed right-3 bottom-3 left-3 z-[70] md:hidden">
      <div className="border border-[var(--v3-line-bright)] bg-[var(--v3-surface)]/90 p-2 backdrop-blur-xl">
        <a
          href={ctaHref}
          className="btn-accent flex items-center justify-between gap-3 px-4 py-3"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span>
            <span className="v3-mono block text-[9px] uppercase tracking-widest opacity-70">
              20-min audyt
            </span>
            <span className="block text-sm font-semibold">{site.ctaPrimary}</span>
          </span>
          <span
            className="grid h-8 w-8 place-items-center border border-[var(--v3-line-bright)] font-mono text-sm"
            aria-hidden
          >
            →
          </span>
        </a>
      </div>
    </div>
  )
}
