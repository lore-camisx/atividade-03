import { useEffect } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { BookSpread } from '../../components/pokedex/Book'
import EmptyPage from '../../components/pokedex/EmptyPage'
import GridControls from '../../components/pokedex/GridControls'
import PageIntro from '../../components/pokedex/PageIntro'
import Pager from '../../components/pokedex/Pager'
import PokemonGrid, { PAGE_SIZE } from '../../components/pokedex/PokemonGrid'
import PokemonList, { LIST_PAGE_SIZE } from '../../components/pokedex/PokemonList'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import PokemonPage from '../../components/pokedex/PokemonPage'
import { useFavorites } from '../../context/FavoritesContext'
import { POKEMON, POKEMON_BY_ID, USED_TYPES } from '../../data'
import { useArrowNavigation } from '../../hooks/useArrowNavigation'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useScrollIntoViewOnMobile } from '../../hooks/useScrollIntoViewOnMobile'

export default function PokemonTab({ mode }) {
  const { filters, setFilters, resetFilters, filtered, page, setPage } = useOutletContext()
  const { favorites } = useFavorites()
  const { pokemonId } = useParams()
  const navigate = useNavigate()

  const base = mode === 'favorites' ? '/pokedex/favoritos' : '/pokedex'
  const list = mode === 'favorites' ? filtered.filter((p) => favorites.includes(p.id)) : filtered
  const selected = pokemonId ? POKEMON_BY_ID.get(Number(pokemonId)) : null
  useDocumentTitle(selected ? selected.name : mode === 'favorites' ? 'Favoritos' : 'Pokédex')

  // Grade (sprites) ou lista (número, nome, tipos e os seis atributos em cada linha).
  const [view, setView] = useLocalStorage('pokedex:view', 'grid')
  const pageSize = view === 'list' ? LIST_PAGE_SIZE : PAGE_SIZE
  const pages = Math.ceil(list.length / pageSize)
  const current = Math.min(page, Math.max(0, pages - 1))
  const visible = list.slice(current * pageSize, current * pageSize + pageSize)

  // Ao abrir um Pokémon (pela URL, setas ou sorteio), pula para a página da grade onde ele está.
  useEffect(() => {
    const index = selected ? list.findIndex((p) => p.id === selected.id) : -1
    setPage(index >= 0 ? Math.floor(index / pageSize) : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, mode, view])

  // Anterior/próximo seguem a lista filtrada; se o Pokémon não estiver nela, seguem a Pokédex inteira.
  const navList = selected && list.some((p) => p.id === selected.id) ? list : POKEMON
  const index = selected ? navList.findIndex((p) => p.id === selected.id) : -1
  const prev = selected ? navList[(index - 1 + navList.length) % navList.length] : null
  const next = selected ? navList[(index + 1) % navList.length] : null
  const linkTo = (id) => `${base}/${id}`

  useArrowNavigation(
    () => prev && navigate(linkTo(prev.id)),
    () => next && navigate(linkTo(next.id)),
    Boolean(selected),
  )
  const rightRef = useScrollIntoViewOnMobile(selected?.id)

  const empty =
    mode === 'favorites' && favorites.length === 0 ? (
      <EmptyPage
        title="Sem favoritos"
        text="Você ainda não favoritou nenhum Pokémon. Use a estrela na ficha ou a fita marcadora."
        action={
          <Link to="/pokedex" className="px-btn px-btn--saffron">
            Abrir a Pokédex
          </Link>
        }
      />
    ) : (
      <EmptyPage
        title="Nada por aqui"
        text="Nenhum Pokémon apareceu na grama alta... tente outro nome, número ou tipo."
        action={
          <button type="button" className="px-btn px-btn--saffron" onClick={resetFilters}>
            Limpar filtros
          </button>
        }
      />
    )

  const left = (
    <>
      <GridControls filters={filters} setFilters={setFilters} view={view} onView={setView} />
      {list.length > 0 && view === 'list' && <PokemonList pokemons={visible} selectedId={selected?.id} favorites={favorites} onSelect={(p) => navigate(linkTo(p.id))} />}
      {list.length > 0 && view === 'grid' && (
        <PokemonGrid pokemons={visible} selectedIds={selected ? [selected.id] : []} favorites={favorites} onSelect={(p) => navigate(linkTo(p.id))} />
      )}
      {list.length === 0 && (
        empty
      )}
      <Pager page={current} pages={pages} onPage={setPage} info={`${list.length} de ${mode === 'favorites' ? favorites.length : POKEMON.length} Pokémon`} />
    </>
  )

  const right = selected ? (
    <PokemonPage pokemon={selected} prev={prev} next={next} linkTo={linkTo} />
  ) : (
    <PageIntro title={mode === 'favorites' ? 'Seus favoritos' : 'Bem-vindo à Pokédex!'}>
      <p>Escolha um Pokémon na página ao lado para ver a ficha completa.</p>
      <ul>
        <li>
          <strong>{POKEMON.length}</strong> Pokémon registrados
        </li>
        <li>
          <strong>{USED_TYPES.length}</strong> tipos diferentes
        </li>
        <li>
          <strong>{favorites.length}</strong> favoritos
        </li>
      </ul>
      <p className="page-intro__tip">Dica: use ← → para folhear as fichas.</p>
    </PageIntro>
  )

  return <BookSpread left={left} right={right} rightRef={rightRef} />
}
