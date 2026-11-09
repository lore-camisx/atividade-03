import PixelIcon from '../common/PixelIcon'
import PokemonSprite from '../common/PokemonSprite'
import TypeBadge from '../common/TypeBadge'
import { STATS, STAT_MAX, formatId, totalStats, typeColor } from '../../utils/pokemon'
import '../../css/pokedex/PokemonList.css'

export const LIST_PAGE_SIZE = 8

// Visualização em lista: cada linha mostra número, nome, tipos e os seis atributos.
export default function PokemonList({ pokemons, selectedId, favorites = [], onSelect }) {
  return (
    <ul className="poke-rows" aria-label="Lista de Pokémon">
      {pokemons.map((pokemon) => {
        const color = typeColor(pokemon.types[0].name)
        const selected = pokemon.id === selectedId
        return (
          <li key={pokemon.id}>
            <button
              type="button"
              className={`poke-row ${selected ? 'poke-row--selected' : ''}`}
              style={{ '--row-type': color }}
              onClick={() => onSelect(pokemon)}
              aria-pressed={selected}
              aria-label={`${formatId(pokemon.id)} ${pokemon.name}`}
            >
              <span className="poke-row__sprite">
                <PokemonSprite pokemon={pokemon} size={48} />
              </span>
              <span className="poke-row__head">
                <span className="poke-row__id">
                  {formatId(pokemon.id)}
                  {favorites.includes(pokemon.id) && <PixelIcon name="star" size={11} />}
                </span>
                <span className="poke-row__name">{pokemon.name}</span>
                <span className="poke-row__types">
                  {pokemon.types.map((t) => (
                    <TypeBadge key={t.id} type={t.name} />
                  ))}
                </span>
              </span>
              <span className="poke-row__stats">
                {STATS.map((stat) => (
                  <span key={stat.key} className="poke-row__stat" title={`${stat.label}: ${pokemon.stats[stat.key]}`}>
                    <span className="poke-row__stat-label">{stat.short}</span>
                    <span className="poke-row__stat-value">{pokemon.stats[stat.key]}</span>
                    <span className="poke-row__stat-bar">
                      <span style={{ width: `${(pokemon.stats[stat.key] / STAT_MAX) * 100}%` }} />
                    </span>
                  </span>
                ))}
                <span className="poke-row__total">Total {totalStats(pokemon)}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
