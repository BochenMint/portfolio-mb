import { createContext } from 'react'
import type { ThemeId } from './themes'

export type ThemeContextValue = {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
