import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@fontsource/pixelify-sans/400.css'
import '@fontsource/pixelify-sans/600.css'
import '@fontsource/pixelify-sans/700.css'
import './index.css'
import { router } from './router'
import { initialTheme } from './context/ThemeContext'

// Aplica o tema antes do primeiro desenho para não piscar a tela clara.
document.documentElement.dataset.theme = initialTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
