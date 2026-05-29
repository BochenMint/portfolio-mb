import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'portfolio-theme'

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
  localStorage.setItem(STORAGE_KEY, theme)
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme('light')
      setThemeState('light')
    }
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    applyTheme(next)
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return { theme, setTheme, toggle }
}
