import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const THEME_KEY = 'pokedex:theme'

// Tema inicial: o que o usuário escolheu antes ou, na primeira visita, a preferência do sistema.
// eslint-disable-next-line react-refresh/only-export-components
export function initialTheme() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(THEME_KEY))
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // sem localStorage: segue para a preferência do sistema
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(THEME_KEY, initialTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [setTheme])
  const value = useMemo(() => ({ theme, isNight: theme === 'dark', toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}
