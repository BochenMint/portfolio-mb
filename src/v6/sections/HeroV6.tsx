import { site } from '../../i18n/live'
import { useLocale } from '../../i18n'
import { getArchiveUi } from '../../i18n/archive-ui'
import { ctaHref, isExternalCta } from '../utils'

export function HeroV6() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  const calHref = ctaHref(site.calendly)
  const calExternal = isExternalCta(site.calendly)

  return (
    <section className="v6-hero" aria-labelledby="v6-hero-title">
      <div className="v6-wrap">
        <p className="v6-registry">
          <span className="v6-registry-prompt">MB_OS&gt;</span>
          <span>{site.location}</span>
          <span>{site.responseTime}</span>
          <span>{ui.mintPlummLive}</span>
        </p>

        <h1 id="v6-hero-title" className="v6-hero-name">
          Marcin
          <br />
          Bochenek
          <span className="v6-hero-caret" aria-hidden>_</span>
        </h1>

        <div className="v6-hero-band">
          <p className="v6-hero-offer">{site.icpBadge}</p>
          <a
            href={calHref}
            className="v6-cta-primary"
            {...(calExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {site.ctaPrimary}
          </a>
        </div>

        <p className="v6-hero-scope">{ui.v6HeroScope}</p>

        <div className="v6-hero-rule v6-rule-reveal" aria-hidden />
      </div>
    </section>
  )
}
