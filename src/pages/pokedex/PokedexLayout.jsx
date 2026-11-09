import { useCallback, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import GameNav from '../../components/common/GameNav'
import Logo from '../../components/common/Logo'
import Book from '../../components/pokedex/Book'
import { useFavorites } from '../../context/FavoritesContext'
import { POKEMON, TRAINERS } from '../../data'
import { filterAndSort } from '../../utils/pokemon'
import '../../css/pokedex/PokedexPage.css'

const INITIAL_FILTERS = { query: '', type: '', sortKey: 'id', sortDir: 'asc' }

function tabFromPath(pathname) {
  if (pathname.startsWith('/pokedex/treinadores')) return 'trainers'
  if (pathname.startsWith('/pokedex/comparar')) return 'compare'
  if (pathname.startsWith('/pokedex/habitat')) return 'habitat'
  if (pathname.startsWith('/pokedex/favoritos')) return 'favorites'
  return 'dex'
}

// Layout das abas da Pokédex: guarda filtros, página e comparação enquanto o usuário troca de aba.
export default function PokedexLayout() {
  const [filters, setFiltersState] = useState(INITIAL_FILTERS)
  const [page, setPage] = useState(0)
  const [compareIds, setCompareIds] = useState([])
  const { pathname } = useLocation()
  const { pokemonId } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const tab = tabFromPath(pathname)

  const filtered = useMemo(() => filterAndSort(POKEMON, filters), [filters])

  // Qualquer mudança de filtro volta para a primeira página.
  const setFilters = useCallback((update) => {
    setFiltersState(update)
    setPage(0)
  }, [])

  const selectedId = pokemonId ? Number(pokemonId) : null
  const base = tab === 'favorites' ? '/pokedex/favoritos' : tab === 'habitat' ? '/pokedex/habitat' : '/pokedex'

  function randomPick() {
    if (tab === 'trainers') {
      navigate(`/pokedex/treinadores/${TRAINERS[Math.floor(Math.random() * TRAINERS.length)].id}`)
      return
    }
    const pool = filtered.length > 0 ? filtered : POKEMON
    navigate(`${tab === 'favorites' ? '/pokedex' : base}/${pool[Math.floor(Math.random() * pool.length)].id}`)
  }

  const ribbons = [
    { label: 'Início', icon: 'home', color: 'var(--cerulean)', onClick: () => navigate('/') },
    { label: 'Cidade', icon: 'map', color: 'var(--viridian)', onClick: () => navigate('/cidade') },
    { label: 'Sortear', icon: 'dice', color: 'var(--saffron)', onClick: randomPick },
    {
      label: selectedId && isFavorite(selectedId) ? 'Desfavoritar' : 'Favoritar',
      icon: 'star',
      color: 'var(--pewter)',
      disabled: !selectedId,
      pressed: selectedId ? isFavorite(selectedId) : undefined,
      onClick: () => selectedId && toggleFavorite(selectedId),
    },
  ]

  function resetFilters() {
    setFilters(INITIAL_FILTERS)
  }

  return (
    <div className="pokedex-page">
      <header className="pokedex-page__header">
        <GameNav />
        <Logo text="Pokédex" size="medium" />
      </header>
      <Book activeTab={tab} ribbons={ribbons}>
        <Outlet context={{ filters, setFilters, resetFilters, filtered, page, setPage, compareIds, setCompareIds }} />
      </Book>
    </div>
  )
}
