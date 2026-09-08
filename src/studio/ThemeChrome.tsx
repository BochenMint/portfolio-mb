import { useTheme } from './useTheme'

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
      <span className="studio-chrome-spot" data-cursor-spot />
      <span className="studio-cursor-probe" data-cursor-follow />
    </div>
  )
}
