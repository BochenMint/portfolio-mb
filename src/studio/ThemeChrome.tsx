import { getStudioUi } from '../i18n/studio-ui'
import { localeFromWindow } from '../i18n/path'
import { useTheme } from './ThemeContext'

export function ThemeChrome() {
  const { theme } = useTheme()

  return (
    <div className="studio-chrome" data-theme-chrome={theme} aria-hidden>
      <span className="studio-chrome-a" />
      <span className="studio-chrome-b" />
      <span className="studio-chrome-c" />
      <span className="studio-chrome-d" />
      <span className="studio-chrome-scan" />
      <span className="studio-chrome-grain" />
    </div>
  )
}

export function themeKicker(theme: string, fallback: string) {
  const kickers = getStudioUi(localeFromWindow()).kickers
  return kickers[theme] ?? fallback
}
