import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  defaultThemeId,
  isThemeId,
  THEME_STORAGE_KEY,
  themeById,
  type ThemeId,
} from './themes'

type ThemeContextValue = {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialTheme(): ThemeId {
  if (typeof window === 'undefined') return defaultThemeId
  const fromQuery = new URLSearchParams(window.location.search).get('style')
  if (isThemeId(fromQuery)) return fromQuery
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (isThemeId(stored)) return stored
  return defaultThemeId
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = ['swiss', 'liquid', 'v5', 'brutal'].includes(theme)
      ? 'light'
      : 'dark'
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    const url = new URL(window.location.href)
    url.searchParams.set('style', theme)
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }, [theme])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const root = document.documentElement
      root.style.setProperty('--spot-x', `${e.clientX}px`)
      root.style.setProperty('--spot-y', `${e.clientY}px`)
      root.style.setProperty('--spot-nx', (e.clientX / window.innerWidth).toFixed(4))
      root.style.setProperty('--spot-ny', (e.clientY / window.innerHeight).toFixed(4))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const href = themeById[theme].fonts
    let link = document.getElementById('studio-theme-fonts') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = 'studio-theme-fonts'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = href
  }, [theme])

  const setTheme = useCallback((id: ThemeId) => setThemeState(id), [])
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme outside ThemeProvider')
  return ctx
}
