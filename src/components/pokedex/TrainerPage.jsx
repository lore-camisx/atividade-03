import { Link } from 'react-router-dom'
import Logo from '../common/Logo'
import Person from '../common/Person'
import PixelIcon from '../common/PixelIcon'
import PokemonSprite from '../common/PokemonSprite'
import { teamOf } from '../../data'
import { TRAINER_LINES, TRAINER_LOOKS } from '../../data/world'
import { formatId, totalStats } from '../../utils/pokemon'
import '../../css/pokedex/TrainerPage.css'

const BADGE_COLORS = ['#9b9584', '#00aaee', '#f4c430', '#6cc24a', '#a040a0', '#f85888', '#d9381e', '#6b4f2a', '#7038f8']
const BADGE_SLOTS = 9

export default function TrainerPage({ trainer }) {
  const team = teamOf(trainer)
  const power = team.reduce((sum, p) => sum + totalStats(p), 0)

  return (
    <article className="trainer-page" aria-label={`Ficha de ${trainer.name}`}>
      <div className="trainer-page__top">
        <div className="box trainer-page__portrait">
          <Person look={TRAINER_LOOKS[trainer.id]} size={110} className="trainer-page__person" />
        </div>
        <div className="box trainer-page__info">
          <Logo text={trainer.name} size="small" as="h2" />
          <p className="trainer-page__quote">“{TRAINER_LINES[trainer.id][0]}”</p>
          <p className="trainer-page__meta">
            {team.length} Pokémon · poder total {power}
          </p>
        </div>
      </div>

      <div className="box trainer-page__badges">
        <h3>Insígnias ({trainer.badges})</h3>
        <ul>
          {Array.from({ length: Math.max(BADGE_SLOTS, trainer.badges) }, (_, i) => (
            <li key={i} className={i < trainer.badges ? 'is-earned' : ''} style={{ color: BADGE_COLORS[i % BADGE_COLORS.length] }}>
              <PixelIcon name="badge" size={26} title={i < trainer.badges ? `Insígnia ${i + 1}` : undefined} />
            </li>
          ))}
        </ul>
      </div>

      <div className="box trainer-page__team">
        <h3>Time</h3>
        <ul>
          {team.map((pokemon, i) => (
            <li key={`${pokemon.id}-${i}`}>
              <Link to={`/pokedex/${pokemon.id}`} className="trainer-page__mon" title={`Ver ${pokemon.name}`}>
                <PokemonSprite pokemon={pokemon} size={64} />
                <span className="trainer-page__mon-id">{formatId(pokemon.id)}</span>
                <span>{pokemon.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="dex-page__bar">
        <Link to={`/cidade?local=trainer-${trainer.id}`} className="px-btn px-btn--small px-btn--viridian">
          <PixelIcon name="map" size={14} /> Encontrar na cidade
        </Link>
      </div>
    </article>
  )
}
