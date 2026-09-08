import { getStudioUi } from '../i18n/studio-ui'
import { localeFromWindow } from '../i18n/path'

export function themeKicker(theme: string, fallback: string) {
  const kickers = getStudioUi(localeFromWindow()).kickers
  return kickers[theme] ?? fallback
}
