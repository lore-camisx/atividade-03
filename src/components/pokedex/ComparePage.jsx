import PokemonSprite from '../common/PokemonSprite'
import TypeBadge from '../common/TypeBadge'
import PixelIcon from '../common/PixelIcon'
import { STATS, STAT_MAX, formatId, totalStats, typeColor } from '../../utils/pokemon'
import '../../css/pokedex/ComparePage.css'

// Cena de "batalha": A de costas embaixo, B de frente em cima, como nos jogos antigos.
export default function ComparePage({ left, right, onSwap, onClear }) {
  const totals = [totalStats(left), totalStats(right)]
  const winner = totals[0] === totals[1] ? null : totals[0] > totals[1] ? left : right

  return (
    <article className="compare" aria-label={`${left.name} contra ${right.name}`}>
      <div className="box compare__arena">
        <div className="compare__hud compare__hud--b">
          <strong>{right.name}</strong>
          <span>{formatId(right.id)}</span>
          <Hp value={totals[1]} />
        </div>
        <div className="compare__mon compare__mon--b" style={{ '--plat': typeColor(right.types[0].name) }}>
          <PokemonSprite pokemon={right} size={96} bob />
        </div>
        <div className="compare__mon compare__mon--a" style={{ '--plat': typeColor(left.types[0].name) }}>
          <PokemonSprite pokemon={left} size={112} back bob />
        </div>
        <div className="compare__hud compare__hud--a">
          <strong>{left.name}</strong>
          <span>{formatId(left.id)}</span>
          <Hp value={totals[0]} />
        </div>
      </div>

      <div className="box compare__result">
        {winner ? (
          <p>
            <PixelIcon name="star" size={16} /> <strong>{winner.name}</strong> vence por {Math.abs(totals[0] - totals[1])} pontos!
          </p>
        ) : (
          <p>Empate técnico!</p>
        )}
      </div>

      <div className="box compare__table">
        <div className="compare__row compare__row--head">
          <span className="compare__types">
            {left.types.map((t) => (
              <TypeBadge key={t.id} type={t.name} />
            ))}
          </span>
          <span />
          <span className="compare__types compare__types--right">
            {right.types.map((t) => (
              <TypeBadge key={t.id} type={t.name} />
            ))}
          </span>
        </div>
        {STATS.map((stat) => {
          const a = left.stats[stat.key]
          const b = right.stats[stat.key]
          return (
            <div key={stat.key} className="compare__row">
              <Bar value={a} win={a > b} color={typeColor(left.types[0].name)} reverse />
              <span className="compare__label">
                <PixelIcon name={stat.icon} size={14} />
                {stat.short}
              </span>
              <Bar value={b} win={b > a} color={typeColor(right.types[0].name)} />
            </div>
          )
        })}
        <div className="compare__row compare__row--total">
          <strong className={totals[0] > totals[1] ? 'is-win' : ''}>{totals[0]}</strong>
          <span className="compare__label">Total</span>
          <strong className={totals[1] > totals[0] ? 'is-win' : ''}>{totals[1]}</strong>
        </div>
      </div>

      <div className="dex-page__bar">
        <button type="button" className="px-btn px-btn--small" onClick={onSwap}>
          ⇄ Inverter lados
        </button>
        <button type="button" className="px-btn px-btn--small px-btn--vermillion" onClick={onClear}>
          Nova batalha
        </button>
      </div>
    </article>
  )
}

function Bar({ value, win, color, reverse = false }) {
  return (
    <span className={`compare__bar ${reverse ? 'compare__bar--reverse' : ''} ${win ? 'is-win' : ''}`}>
      <span className="compare__value">{value}</span>
      <span className="compare__track">
        <span className="compare__fill" style={{ width: `${(value / STAT_MAX) * 100}%`, '--fill': color }} />
      </span>
    </span>
  )
}

function Hp({ value }) {
  const percent = Math.min(100, (value / 700) * 100)
  return (
    <span className="compare__hp" aria-label={`Total ${value}`}>
      <span>PWR</span>
      <span className="compare__hp-track">
        <span style={{ width: `${percent}%` }} />
      </span>
    </span>
  )
}
