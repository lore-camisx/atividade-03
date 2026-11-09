import { useEffect } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { BookSpread } from '../../components/pokedex/Book'
import EmptyPage from '../../components/pokedex/EmptyPage'
import GridControls from '../../components/pokedex/GridControls'
import PageIntro from '../../components/pokedex/PageIntro'
import Pager from '../../components/pokedex/Pager'
import PokemonGrid, { PAGE_SIZE } from '../../components/pokedex/PokemonGrid'
import Diorama from '../../components/habitat/Diorama'
import Logo from '../../components/common/Logo'
import PixelIcon from '../../components/common/PixelIcon'
import TypeBadge from '../../components/common/TypeBadge'
import { useFavorites } from '../../context/FavoritesContext'
import { POKEMON, POKEMON_BY_ID } from '../../data'
import { habitatFor } from '../../data/habitats'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useScrollIntoViewOnMobile } from '../../hooks/useScrollIntoViewOnMobile'
import { formatId } from '../../utils/pokemon'

export default function HabitatTab() {
  const { filters, setFilters, resetFilters, filtered, page, setPage } = useOutletContext()
  const { favorites } = useFavorites()
  const { pokemonId } = useParams()
  const navigate = useNavigate()
  const selected = pokemonId ? POKEMON_BY_ID.get(Number(pokemonId)) : null
  useDocumentTitle(selected ? `Habitat de ${selected.name}` : 'Habitat')

  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const current = Math.min(page, Math.max(0, pages - 1))
  const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  useEffect(() => {
    const index = selected ? filtered.findIndex((p) => p.id === selected.id) : -1
    setPage(index >= 0 ? Math.floor(index / PAGE_SIZE) : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id])

  const rightRef = useScrollIntoViewOnMobile(selected?.id)
  const navList = selected && filtered.some((p) => p.id === selected.id) ? filtered : POKEMON
  const index = selected ? navList.findIndex((p) => p.id === selected.id) : -1
  const prev = selected && navList[(index - 1 + navList.length) % navList.length]
  const next = selected && navList[(index + 1) % navList.length]

  const left = (
    <>
      <GridControls filters={filters} setFilters={setFilters} />
      {filtered.length > 0 ? (
        <PokemonGrid pokemons={visible} selectedIds={selected ? [selected.id] : []} favorites={favorites} onSelect={(p) => navigate(`/pokedex/habitat/${p.id}`)} />
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
      <Pager page={current} pages={pages} onPage={setPage} info={`${filtered.length} de ${POKEMON.length} · escolha quem visitar`} />
    </>
  )

  const right = selected ? (
    <>
      <div className="habitat-head">
        <div>
          <span className="dex-page__id">
            {formatId(selected.id)} · {habitatFor(selected).name}
          </span>
          <Logo text={selected.name} size="small" as="h2" />
        </div>
        <span className="habitat-head__types">
          {selected.types.map((t) => (
            <TypeBadge key={t.id} type={t.name} />
          ))}
        </span>
      </div>
      {/* key: trocar de Pokémon reinicia o diorama (posição, humor e itens) */}
      <Diorama key={selected.id} pokemon={selected} />
      <div className="dex-page__bar">
        <Link to={`/pokedex/habitat/${prev.id}`} className="dex-page__nav" aria-label={`Anterior: ${prev.name}`}>
          <PixelIcon name="left" size={12} /> {formatId(prev.id)}
        </Link>
        <Link to={`/pokedex/${selected.id}`} className="dex-page__nav">
          <PixelIcon name="book" size={12} /> Ver ficha
        </Link>
        <Link to={`/pokedex/habitat/${next.id}`} className="dex-page__nav" aria-label={`Próximo: ${next.name}`}>
          {formatId(next.id)} <PixelIcon name="right" size={12} />
        </Link>
      </div>
    </>
  ) : (
    <PageIntro title="Habitats">
      <p>Escolha um Pokémon para visitar o habitat dele: cada tipo vive em um cenário diferente.</p>
      <p>Lá você pode fazer carinho, dar frutas, jogar a bola e chamá-lo para seguir o cursor.</p>
    </PageIntro>
  )

  return <BookSpread left={left} right={right} rightRef={rightRef} />
}
