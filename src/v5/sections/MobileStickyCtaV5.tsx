import { useEffect, useState } from 'react'
import { site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

export function MobileStickyCtaV5() {
  const [visible, setVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)

  const href = ctaHref(site.calendly)
  const external = isExternalCta(site.calendly)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const contact = document.getElementById('kontakt')
    if (!contact) return

    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 },
    )
    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  const show = visible && !contactVisible

  return (
    <div className="volt-sticky-cta" data-visible={show}>
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        <span>
          <small>20-min audyt</small>
          {site.ctaPrimary}
        </span>
        <span aria-hidden>→</span>
      </a>
    </div>
  )
}
