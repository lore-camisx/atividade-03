import { memo } from 'react'
import { seeded } from '../../utils/pixel'
import { VIEW } from './iso'

// Partículas de clima: cada tipo usa uma animação CSS diferente (cair, subir, piscar, flutuar).
const STYLES = {
  snow: { anim: 'wx-fall', size: 2, count: 34 },
  petals: { anim: 'wx-sway', size: 2, count: 18 },
  feathers: { anim: 'wx-sway', size: 3, count: 12 },
  leaves: { anim: 'wx-sway', size: 2, count: 16 },
  embers: { anim: 'wx-rise', size: 2, count: 22 },
  bubbles: { anim: 'wx-rise', size: 3, count: 16, hollow: true },
  sparkles: { anim: 'wx-blink', size: 2, count: 20, cross: true },
  sparks: { anim: 'wx-blink', size: 2, count: 14 },
  dust: { anim: 'wx-drift', size: 1, count: 26 },
  wisps: { anim: 'wx-float', size: 3, count: 10 },
}

function Weather({ kind, color }) {
  const style = STYLES[kind]
  if (!style) return null
  const rand = seeded(kind.length * 31)
  return (
    <g className="weather" aria-hidden="true">
      {Array.from({ length: style.count }, (_, k) => {
        const x = Math.round(rand() * VIEW.w)
        const y = Math.round(rand() * VIEW.h)
        const css = { animationDelay: `${-rand() * 6}s`, animationDuration: `${4 + rand() * 4}s` }
        if (style.cross) {
          return (
            <g key={k} className={style.anim} style={css} fill={color}>
              <rect x={x} y={y - 1} width="1" height="3" />
              <rect x={x - 1} y={y} width="3" height="1" />
            </g>
          )
        }
        if (style.hollow) {
          return <rect key={k} className={style.anim} style={css} x={x} y={y} width={style.size} height={style.size} fill="none" stroke={color} strokeWidth="0.7" />
        }
        return <rect key={k} className={style.anim} style={css} x={x} y={y} width={style.size} height={style.size} fill={color} />
      })}
    </g>
  )
}

export default memo(Weather)
