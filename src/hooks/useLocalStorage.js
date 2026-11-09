import { useEffect, useState } from 'react'

// Estado que persiste no navegador; se o localStorage falhar, vira um useState comum.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Armazenamento indisponível (aba anônima, bloqueio etc.): segue só em memória.
    }
  }, [key, value])

  return [value, setValue]
}
