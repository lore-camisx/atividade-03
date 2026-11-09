import PixelIcon from '../common/PixelIcon'
import PokemonSprite from '../common/PokemonSprite'
import { formatId, typeColor } from '../../utils/pokemon'
import '../../css/pokedex/SlotGrid.css'

export const PAGE_SIZE = 12

// Grade 4x3 de "espaços" do livro; os vazios completam a página como na referência.
export default function PokemonGrid({ pokemons, selectedIds = [], markers = {}, favorites = [], onSelect }) {
  const filler = Array.from({ length: Math.max(0, PAGE_SIZE - pokemons.length) })

  return (
    <ul className="slots">
      {pokemons.map((pokemon) => {
        const selected = selectedIds.includes(pokemon.id)
        return (
          <li key={pokemon.id}>
            <button
              type="button"
              className={`slot ${selected ? 'slot--selected' : ''}`}
              style={{ '--slot-type': typeColor(pokemon.types[0].name) }}
              onClick={() => onSelect(pokemon)}
              aria-pressed={selected}
              aria-label={`${formatId(pokemon.id)} ${pokemon.name}`}
              title={pokemon.name}
            >
              <span className="slot__id">{formatId(pokemon.id)}</span>
              {favorites.includes(pokemon.id) && (
                <span className="slot__fav" aria-label="Favorito">
                  <PixelIcon name="star" size={12} />
                </span>
              )}
              {markers[pokemon.id] && <span className="slot__marker">{markers[pokemon.id]}</span>}
              <PokemonSprite pokemon={pokemon} size={84} />
              <span className="slot__name">{pokemon.name}</span>
            </button>
          </li>
        )
      })}
      {filler.map((_, i) => (
        <li key={`empty-${i}`} aria-hidden="true">
          <span className="slot slot--empty" />
        </li>
      ))}
    </ul>
  )
}
