import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Person from '../common/Person'
import PixelIcon from '../common/PixelIcon'
import PokemonSprite from '../common/PokemonSprite'
import TypeBadge from '../common/TypeBadge'
import { useTypewriter } from '../../hooks/useTypewriter'
import { useFavorites } from '../../context/FavoritesContext'
import { useTheme } from '../../context/ThemeContext'
import { POKEMON_BY_ID, TRAINER_BY_ID, teamOf } from '../../data'
import { DISTRICTS, NPC_LOOKS, TRAINER_LINES, TRAINER_LOOKS } from '../../data/world'
import { formatId, totalStats } from '../../utils/pokemon'
import '../../css/city/DialogueBox.css'

const HEAL_LINE = '♪ Tchu-tchu-tchu-tchuuu ♪ Prontinho! Seus Pokémon estão 100% recuperados.'

function scriptFor(place, night) {
  if (place.kind === 'trainer') {
    const trainer = TRAINER_BY_ID.get(place.trainerId)
    return { speaker: trainer.name, lines: TRAINER_LINES[trainer.id], look: TRAINER_LOOKS[trainer.id] }
  }
  if (place.kind === 'gym') {
    return { speaker: place.name, lines: place.lines, look: TRAINER_LOOKS[place.leaderId] }
  }
  if (place.kind === 'wild') {
    return { speaker: place.name, lines: place.lines, pokemon: POKEMON_BY_ID.get(place.pokemonId) }
  }
  const base = night && place.nightLines ? place.nightLines : place.lines
  const lines = place.action === 'heal' ? [...base, HEAL_LINE] : base
  return { speaker: place.speaker ?? place.name, lines, look: place.npc ? NPC_LOOKS[place.npc] : null }
}

export default function DialogueBox({ place, onClose, onSelectPlace, trainerPlaceId }) {
  const { isNight } = useTheme()
  const script = useMemo(() => scriptFor(place, isNight), [place, isNight])
  const [index, setIndex] = useState(0)
  const { shown, done, skip } = useTypewriter(script.lines[index])
  const { isFavorite, toggleFavorite } = useFavorites()
  const boxRef = useRef(null)
  const finished = done && index === script.lines.length - 1
  const district = DISTRICTS[place.district] ?? DISTRICTS.center

  useEffect(() => {
    setIndex(0)
    boxRef.current?.focus()
  }, [place])

  function advance() {
    if (!done) return skip()
    if (index < script.lines.length - 1) setIndex((i) => i + 1)
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    } else if ((event.key === 'Enter' || event.key === ' ') && event.target === boxRef.current) {
      event.preventDefault()
      advance()
    }
  }

  return (
    <div className="dialogue" role="dialog" aria-label={`Conversa: ${script.speaker}`} ref={boxRef} tabIndex={-1} onKeyDown={onKeyDown}>
      <div className="dialogue__portrait" style={{ '--district': district.color }}>
        {script.pokemon ? (
          <PokemonSprite pokemon={script.pokemon} size={88} bob />
        ) : script.look ? (
          <Person look={script.look} size={72} className="dialogue__person" />
        ) : (
          <PixelIcon name={place.kind === 'sign' ? 'pin' : 'chat'} size={48} />
        )}
      </div>

      <div className="dialogue__main">
        <div className="dialogue__name" style={{ '--district': district.color, '--district-ink': district.ink }}>
          {script.speaker}
        </div>
        <button type="button" className="dialogue__text" onClick={advance} aria-live="polite">
          <span>{shown}</span>
          {done && !finished && <span className="dialogue__next blink">▼</span>}
        </button>

        {finished && <Extras place={place} onSelectPlace={onSelectPlace} trainerPlaceId={trainerPlaceId} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />}
      </div>

      <button type="button" className="dialogue__close" onClick={onClose} aria-label="Fechar conversa">
        <PixelIcon name="close" size={12} />
      </button>
    </div>
  )
}

function Extras({ place, onSelectPlace, trainerPlaceId, isFavorite, toggleFavorite }) {
  if (place.kind === 'trainer') {
    const trainer = TRAINER_BY_ID.get(place.trainerId)
    return (
      <div className="dialogue__extras">
        <ul className="dialogue__team" aria-label={`Time de ${trainer.name}`}>
          {teamOf(trainer).map((p, i) => (
            <li key={`${p.id}-${i}`}>
              <Link to={`/pokedex/${p.id}`} className="dialogue__mon" title={`${formatId(p.id)} ${p.name}`}>
                <PokemonSprite pokemon={p} size={48} />
                <span>{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="dialogue__actions">
          <span className="dialogue__badges">
            <PixelIcon name="badge" size={16} /> {trainer.badges} {trainer.badges === 1 ? 'insígnia' : 'insígnias'}
          </span>
          <Link className="px-btn px-btn--small px-btn--saffron" to={`/pokedex/treinadores/${trainer.id}`}>
            <PixelIcon name="book" size={14} /> Ficha na Pokédex
          </Link>
        </div>
      </div>
    )
  }

  if (place.kind === 'wild') {
    const pokemon = POKEMON_BY_ID.get(place.pokemonId)
    const fav = isFavorite(pokemon.id)
    return (
      <div className="dialogue__extras">
        <div className="dialogue__actions">
          <span className="dialogue__types">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.id} type={t.name} />
            ))}
            <span className="dialogue__total">Total {totalStats(pokemon)}</span>
          </span>
          <button type="button" className={`px-btn px-btn--small ${fav ? 'px-btn--saffron' : ''}`} aria-pressed={fav} onClick={() => toggleFavorite(pokemon.id)}>
            <PixelIcon name={fav ? 'star' : 'starOutline'} size={14} /> {fav ? 'Favorito' : 'Favoritar'}
          </button>
          <Link className="px-btn px-btn--small px-btn--cerulean" to={`/pokedex/${pokemon.id}`}>
            <PixelIcon name="book" size={14} /> Ver na Pokédex
          </Link>
        </div>
      </div>
    )
  }

  if (place.kind === 'gym' && trainerPlaceId) {
    const leader = TRAINER_BY_ID.get(place.leaderId)
    return (
      <div className="dialogue__extras">
        <div className="dialogue__actions">
          <button type="button" className="px-btn px-btn--small px-btn--saffron" onClick={() => onSelectPlace(trainerPlaceId)}>
            <PixelIcon name="chat" size={14} /> Falar com {leader.name}
          </button>
        </div>
      </div>
    )
  }

  return null
}
