import { Outlet, ScrollRestoration } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import { ThemeProvider } from './context/ThemeContext'

// Componente raiz: provê o tema (dia/noite) e os favoritos para todas as páginas.
// Cada página (início, cidade, Pokédex) é renderizada no <Outlet /> conforme a rota.
export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Outlet />
        <ScrollRestoration />
      </FavoritesProvider>
    </ThemeProvider>
  )
}
