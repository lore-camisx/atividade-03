import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { BookSpread } from '../../components/pokedex/Book'
import ComparePage from '../../components/pokedex/ComparePage'
import EmptyPage from '../../components/pokedex/EmptyPage'
import GridControls from '../../components/pokedex/GridControls'
import PageIntro from '../../components/pokedex/PageIntro'
import Pager from '../../components/pokedex/Pager'
import PokemonGrid, { PAGE_SIZE } from '../../components/pokedex/PokemonGrid'
import PokemonSprite from '../../components/common/PokemonSprite'
import { useFavorites } from '../../context/FavoritesContext'
import { POKEMON, POKEMON_BY_ID } from '../../data'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useScrollIntoViewOnMobile } from '../../hooks/useScrollIntoViewOnMobile'

export default function CompareTab() {
  useDocumentTitle('Comparar')
  const { filters, setFilters, resetFilters, filtered, page, setPage, compareIds, setCompareIds } = useOutletContext()
  const { favorites } = useFavorites()

  useEffect(() => setPage(0), [setPage])

  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const current = Math.min(page, Math.max(0, pages - 1))
  const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)
  const chosen = compareIds.map((id) => POKEMON_BY_ID.get(id))
  const markers = Object.fromEntries(compareIds.map((id, i) => [id, i === 0 ? 'A' : 'B']))
  const rightRef = useScrollIntoViewOnMobile(chosen.length === 2 ? compareIds.join('-') : null)

  // Clicar escolhe até dois Pokémon; um terceiro clique substitui o mais antigo.
  function toggle(pokemon) {
    setCompareIds((ids) => (ids.includes(pokemon.id) ? ids.filter((id) => id !== pokemon.id) : [...ids, pokemon.id].slice(-2)))
  }

  const left = (
    <>
      <GridControls filters={filters} setFilters={setFilters} />
      {filtered.length > 0 ? (
        <PokemonGrid pokemons={visible} selectedIds={compareIds} markers={markers} favorites={favorites} onSelect={toggle} />
      ) : (
        <EmptyPage
          title="Nada por aqui"
          text="Nenhum Pokémon com esses filtros."
          action={
            <button type="button" className="px-btn px-btn--saffron" onClick={resetFilters}>
              Limpar filtros
            </button>
          }
        />
      )}
      <Pager page={current} pages={pages} onPage={setPage} info={`${filtered.length} de ${POKEMON.length} · escolha 2`} />
    </>
  )

  const right =
    chosen.length === 2 ? (
      <ComparePage left={chosen[0]} right={chosen[1]} onSwap={() => setCompareIds((ids) => [...ids].reverse())} onClear={() => setCompareIds([])} />
    ) : (
      <PageIntro title="Batalha de atributos">
        <p>Escolha dois Pokémon na página ao lado para comparar seus atributos.</p>
        <div className="compare-picks">
          {[0, 1].map((i) => (
            <div key={i} className="box compare-picks__slot">
              <span className="compare-picks__letter">{i === 0 ? 'A' : 'B'}</span>
              {chosen[i] ? <PokemonSprite pokemon={chosen[i]} size={80} bob /> : <span className="compare-picks__q">?</span>}
              <span>{chosen[i]?.name ?? 'Vazio'}</span>
            </div>
          ))}
        </div>
      </PageIntro>
    )

  return <BookSpread left={left} right={right} rightRef={rightRef} />
}
