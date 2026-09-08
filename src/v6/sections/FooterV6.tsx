import { site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

export function FooterV6() {
  const calHref = ctaHref(site.calendly)
  const calExternal = isExternalCta(site.calendly)

  return (
    <footer className="v6-footer">
      <div className="v6-wrap v6-footer-grid">
        <div>
          <p className="v6-footer-name">Marcin Bochenek</p>
          <p className="v6-footer-role">Strony · panele · automatyzacje dla polskich firm</p>
        </div>
        <div className="v6-footer-links">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <a
          href={calHref}
          className="v6-footer-cta"
          {...(calExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {site.footerCta.line1}
          <span>{site.footerCta.line2}</span>
        </a>
      </div>
      <div className="v6-wrap v6-footer-bottom">
        <p>© {new Date().getFullYear()} Marcin Bochenek</p>
        <p className="v6-footer-note">MB OS · wariant V6</p>
      </div>
    </footer>
  )
}
