import { useContext } from 'react'
import { ThemeContext } from './theme-context-instance'

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme outside ThemeProvider')
  return ctx
}
