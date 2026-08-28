import { site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

export function FooterV5() {
  const href = ctaHref(site.calendly)
  const external = isExternalCta(site.calendly)

  return (
    <footer className="volt-footer">
      <div className="volt-footer-inner">
        <div>
          <p className="volt-footer-brand">Marcin Bochenek</p>
          <p className="volt-footer-tag">VOLT · {site.footerCta.line1}</p>
          <p className="volt-footer-tag" style={{ marginTop: '0.25rem' }}>
            {site.footerCta.line2}
          </p>
        </div>
        <div className="volt-footer-links">
          <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {site.ctaPrimary}
          </a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={site.siteUrl}>marcinbochenek.com</a>
        </div>
      </div>
    </footer>
  )
}
