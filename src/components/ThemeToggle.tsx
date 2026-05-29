import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-soft border-0 px-3 py-2 text-xs tracking-wide uppercase"
      aria-label={theme === 'light' ? 'Włącz tryb ciemny' : 'Włącz tryb jasny'}
      title={theme === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}
    >
      {theme === 'light' ? 'Ciemny' : 'Jasny'}
    </button>
  )
}
