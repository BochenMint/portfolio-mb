import { site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

export function MobileStickyCtaV6() {
  const calHref = ctaHref(site.calendly)
  const calExternal = isExternalCta(site.calendly)

  return (
    <div className="v6-sticky-cta" aria-hidden={false}>
      <a
        href={calHref}
        className="v6-sticky-btn"
        {...(calExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {site.ctaPrimary}
      </a>
    </div>
  )
}
