import { localeMeta, LOCALES, type Locale } from './locales'
import { persistLocaleChoice, switchHref } from './path'

export function LanguageSwitcher({
  locale,
  className = '',
  ariaLabel,
}: {
  locale: Locale
  className?: string
  ariaLabel: string
}) {
  const hrefFor = (target: Locale) => {
    if (typeof window === 'undefined') return target === 'pl' ? '/' : `/${target}/`
    return switchHref(target, window.location)
  }

  return (
    <nav className={`i18n-lang ${className}`.trim()} aria-label={ariaLabel}>
      {LOCALES.map((item, index) => {
        const current = item === locale
        return (
          <span key={item}>
            {index > 0 ? (
              <span className="i18n-lang-sep" aria-hidden>
                |
              </span>
            ) : null}
            <a
              href={hrefFor(item)}
              hrefLang={localeMeta[item].hreflang}
              lang={localeMeta[item].htmlLang}
              aria-current={current ? 'page' : undefined}
              onClick={() => persistLocaleChoice(item)}
            >
              {localeMeta[item].label}
            </a>
          </span>
        )
      })}
    </nav>
  )
}
