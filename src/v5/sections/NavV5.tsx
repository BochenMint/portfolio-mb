import { ArchiveLang, useLocale } from '../../i18n'
import { getArchiveUi } from '../../i18n/archive-ui'
import { site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

export function NavV5() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  const href = ctaHref(site.calendly)
  const external = isExternalCta(site.calendly)

  return (
    <header className="volt-nav">
      <a href="#volt-hero" className="volt-nav-mark">
        MB
      </a>
      <nav aria-label={ui.navAria}>
        <ul className="volt-nav-links">
          {ui.v5Nav.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-3">
        <ArchiveLang />
        <a
          href={href}
          className="volt-nav-cta"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {ui.bookAuditShort}
        </a>
      </div>
    </header>
  )
}
