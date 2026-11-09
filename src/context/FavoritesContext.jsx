import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const FavoritesContext = createContext(null)

// Favoritos compartilhados entre a cidade e a Pokédex, salvos no navegador.
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('pokedex:favorites', [])

  const toggleFavorite = useCallback(
    (id) => setFavorites((list) => (list.includes(id) ? list.filter((f) => f !== id) : [...list, id])),
    [setFavorites],
  )

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite: (id) => favorites.includes(id) }),
    [favorites, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  return useContext(FavoritesContext)
}
