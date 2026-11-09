import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './pages/HomePage'
import CityPage from './pages/CityPage'
import PokedexLayout from './pages/pokedex/PokedexLayout'
import PokemonTab from './pages/pokedex/PokemonTab'
import TrainersTab from './pages/pokedex/TrainersTab'
import CompareTab from './pages/pokedex/CompareTab'
import HabitatTab from './pages/pokedex/HabitatTab'
import ErrorPage, { NotFoundPage } from './pages/ErrorPage'
import { POKEMON_BY_ID, TRAINER_BY_ID } from './data'

// Loaders validam o ID da URL: se não existir, a rota lança 404 e cai na página de erro.
function pokemonLoader({ params }) {
  if (params.pokemonId && !POKEMON_BY_ID.has(Number(params.pokemonId))) {
    throw new Response('', { status: 404, statusText: 'pokemon' })
  }
  return null
}

function trainerLoader({ params }) {
  if (params.trainerId && !TRAINER_BY_ID.has(Number(params.trainerId))) {
    throw new Response('', { status: 404, statusText: 'trainer' })
  }
  return null
}

function Glitch() {
  throw new Error('Falha simulada para demonstrar a tela de erro.')
}

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/cidade', element: <CityPage /> },
      {
        path: '/pokedex',
        element: <PokedexLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <PokemonTab mode="all" /> },
          { path: ':pokemonId', loader: pokemonLoader, element: <PokemonTab mode="all" /> },
          { path: 'favoritos', element: <PokemonTab mode="favorites" /> },
          { path: 'favoritos/:pokemonId', loader: pokemonLoader, element: <PokemonTab mode="favorites" /> },
          { path: 'habitat', element: <HabitatTab /> },
          { path: 'habitat/:pokemonId', loader: pokemonLoader, element: <HabitatTab /> },
          { path: 'comparar', element: <CompareTab /> },
          { path: 'treinadores', element: <TrainersTab /> },
          { path: 'treinadores/:trainerId', loader: trainerLoader, element: <TrainersTab /> },
        ],
      },
      { path: '/glitch', element: <Glitch /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
