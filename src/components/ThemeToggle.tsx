import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-soft px-3 py-2 text-[11px] tracking-[0.14em] uppercase"
      aria-label={theme === 'light' ? 'Włącz tryb ciemny' : 'Włącz tryb jasny'}
      aria-pressed={theme === 'dark'}
    >
      {theme === 'light' ? 'Ciemny' : 'Jasny'}
    </button>
  )
}
