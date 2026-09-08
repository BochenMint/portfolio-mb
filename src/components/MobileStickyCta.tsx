import { useEffect, useState } from 'react'
import { site } from '../i18n/live'

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)
  const ctaHref = site.calendly || '#contact'
  const isExternal = Boolean(site.calendly)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const contact = document.getElementById('contact')
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
      <div className="rounded-[1.45rem] border border-[var(--color-paper)]/14 bg-[var(--color-ink)]/78 p-2 shadow-[0_22px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <a
          href={ctaHref}
          className="flex items-center justify-between gap-3 rounded-[1.05rem] bg-accent px-4 py-3 text-[var(--color-on-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span>
            <span className="block font-mono text-[9px] tracking-[0.14em] uppercase opacity-70">
              20-min audyt
            </span>
            <span className="block text-sm font-semibold">Sprawdźmy ROI i zakres</span>
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-ink)]/12 font-mono text-sm" aria-hidden>
            →
          </span>
        </a>
      </div>
    </div>
  )
}
