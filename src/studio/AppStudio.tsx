import { LocaleProvider } from '../i18n'
import { ThemeProvider } from './ThemeContext'
import { MassiveField } from './MassiveField'
import { PixelField } from './PixelField'
import { GlassField } from './GlassField'
import { RetroField } from './RetroField'
import { V2Field } from './V2Field'
import { ThemeChrome } from './ThemeChrome'
import { ShellStudio } from './sections'

export function AppStudio() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <div className="studio-root">
          <GlassField />
          <RetroField />
          <V2Field />
          <MassiveField />
          <PixelField />
          <ThemeChrome />
          <ShellStudio />
        </div>
      </ThemeProvider>
    </LocaleProvider>
  )
}
