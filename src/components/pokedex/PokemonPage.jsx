import { Link } from 'react-router-dom'
import Logo from '../common/Logo'
import PixelIcon from '../common/PixelIcon'
import PokemonSprite from '../common/PokemonSprite'
import RetroWindow from '../common/RetroWindow'
import StatBar from '../common/StatBar'
import TypeBadge from '../common/TypeBadge'
import { useFavorites } from '../../context/FavoritesContext'
import { usePokemonExtra } from '../../hooks/usePokemonExtra'
import { ownersOf } from '../../data'
import { STATS, formatId, totalStats, typeColor } from '../../utils/pokemon'
import '../../css/pokedex/PokemonPage.css'

const VIEWS = [
  { label: 'Frente', props: {} },
  { label: 'Costas', props: { back: true } },
  { label: 'Shiny', props: { shiny: true } },
]

// Página direita do livro com a ficha completa do Pokémon.
export default function PokemonPage({ pokemon, prev, next, linkTo }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const extra = usePokemonExtra(pokemon.id)
  const color = typeColor(pokemon.types[0].name)
  const owners = ownersOf(pokemon.id)
  const fav = isFavorite(pokemon.id)

  return (
    <article className="dex-page" style={{ '--dex-type': color }} aria-label={`Ficha de ${pokemon.name}`}>
      <div className="dex-page__views">
        {VIEWS.map((view, i) => (
          <figure key={view.label} className="box dex-page__view">
            <PokemonSprite key={`${pokemon.id}-${i}`} pokemon={pokemon} size={96} bob={i === 0} {...view.props} />
            <figcaption>{view.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="box dex-page__head">
        <div>
          <span className="dex-page__id">{formatId(pokemon.id)}</span>
          <Logo text={pokemon.name} size="small" as="h2" />
          <div className="dex-page__types">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.id} type={t.name} />
            ))}
          </div>
        </div>
        <div className="dex-page__head-actions">
        <Link to={`/pokedex/habitat/${pokemon.id}`} className="dex-page__habitat" title="Visitar habitat" aria-label={`Visitar o habitat de ${pokemon.name}`}>
          <PixelIcon name="leaf" size={22} />
        </Link>
        <button type="button" className={`dex-page__fav ${fav ? 'is-on' : ''}`} onClick={() => toggleFavorite(pokemon.id)} aria-pressed={fav} aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} title="Favorito">
          <PixelIcon name={fav ? 'star' : 'starOutline'} size={24} />
        </button>
        </div>
      </div>

      <div className="box dex-page__entry" aria-live="polite">
        {extra.status === 'loading' && <p className="blink">Consultando a PokéAPI...</p>}
        {extra.status === 'error' && (
          <RetroWindow title="Sem sinal" tone="vermillion" className="dex-page__offline">
            <p className="dex-page__antenna" aria-hidden="true">
              <span />
            </p>
            <p>Não foi possível falar com a PokéAPI. Os dados locais continuam aqui embaixo.</p>
          </RetroWindow>
        )}
        {extra.status === 'done' && (
          <>
            {extra.data.genus && <p className="dex-page__genus">{extra.data.genus}</p>}
            <p>{extra.data.flavor}</p>
            <p className="dex-page__measures">
              <span>Altura {extra.data.height.toLocaleString('pt-BR')} m</span>
              <span>Peso {extra.data.weight.toLocaleString('pt-BR')} kg</span>
            </p>
          </>
        )}
      </div>

      <div className="box dex-page__stats">
        {STATS.map((stat) => (
          <StatBar key={stat.key} stat={stat} value={pokemon.stats[stat.key]} color={color} />
        ))}
        <p className="dex-page__total">
          <span>Total</span>
          <strong>{totalStats(pokemon)}</strong>
        </p>
      </div>

      <div className="dex-page__bar">
        <Link to={linkTo(prev.id)} className="dex-page__nav" aria-label={`Anterior: ${prev.name}`}>
          <PixelIcon name="left" size={12} /> {formatId(prev.id)}
        </Link>
        <span className="dex-page__owners">
          {owners.length > 0 ? (
            <>
              Treinadores:{' '}
              {owners.map((t, i) => (
                <span key={t.id}>
                  {i > 0 && ', '}
                  <Link to={`/pokedex/treinadores/${t.id}`}>{t.name}</Link>
                </span>
              ))}
            </>
          ) : (
            'Nenhum treinador registrado'
          )}
        </span>
        <Link to={linkTo(next.id)} className="dex-page__nav" aria-label={`Próximo: ${next.name}`}>
          {formatId(next.id)} <PixelIcon name="right" size={12} />
        </Link>
      </div>
    </article>
  )
}
