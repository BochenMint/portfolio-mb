import { useLocale } from '../i18n/context'
import { localeHome } from '../i18n/routes'

export function Footer() {
  const { t: c, content, locale } = useLocale()
  const site = content.site

  return (
    <footer className="px-5 py-12 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="hairline" />

        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <a href={localeHome[locale]} className="flex items-center gap-3" aria-label={site.brand}>
            <span aria-hidden className="chrome-text font-display text-lg font-bold tracking-[-0.04em]">
              {c.mark}
            </span>
            <span className="text-sm font-medium text-white">{site.brand}</span>
          </a>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {c.nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-silver-2 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="font-mono text-[11px] text-muted">{c.footer.stack}</p>
        </div>

        <div className="hairline" />

        <div className="flex flex-col gap-3 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>{c.footer.rights(site.brand, new Date().getFullYear())}</p>
          <a href={c.footer.classicHref} className="text-muted transition-colors hover:text-white">
            {c.footer.classic}
          </a>
        </div>
      </div>
    </footer>
  )
}
