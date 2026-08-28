import { ArchiveLang, useLocale } from '../../i18n'
import { getArchiveUi } from '../../i18n/archive-ui'
import { site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

export function NavV6() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  const calHref = ctaHref(site.calendly)
  const calExternal = isExternalCta(site.calendly)

  return (
    <header className="v6-nav">
      <div className="v6-wrap v6-nav-inner">
        <a href="#" className="v6-nav-brand" aria-label="Marcin Bochenek — start">
          <span className="v6-nav-index">MB</span>
          <span className="v6-nav-name">Marcin Bochenek</span>
        </a>

        <nav className="v6-nav-links" aria-label={ui.navAria}>
          {ui.v6Nav.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ArchiveLang />
          <a
            href={calHref}
            className="v6-nav-cta"
            {...(calExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {site.ctaPrimary}
          </a>
        </div>
      </div>
    </header>
  )
}
