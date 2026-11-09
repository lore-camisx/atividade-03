import { memo } from 'react'
import { INK } from '../../art/sprites'
import { GRID } from '../../data/habitats'
import { seeded } from '../../utils/pixel'
import { shade } from './Decor'
import { LEVEL, TILE_H, TILE_W, heightAt, isLiquid, project } from './iso'

const HW = TILE_W / 2
const HH = TILE_H / 2

function diamond(x, y, inset = 0) {
  return `${x},${y - HH + inset} ${x + HW - inset * 2},${y} ${x},${y + HH - inset} ${x - HW + inset * 2},${y}`
}

// Blocos do diorama desenhados de trás para frente (o da frente cobre o de trás).
function Terrain({ habitat }) {
  const tiles = []
  for (let j = 0; j < GRID; j++) for (let i = 0; i < GRID; i++) tiles.push({ i, j })
  tiles.sort((a, b) => a.i + a.j - (b.i + b.j) || a.i - b.i)
  const rand = seeded(habitat.name.length * 97)
  const tuft = shade(habitat.top, -0.12)
  const edge = shade(habitat.top, 0.3)

  return (
    <g>
      {/* Sombra do diorama no "papel" */}
      <polygon points={`${project(0, GRID, 0).x - 8},${project(0, GRID, 0).y + 8} ${project(GRID, GRID, 0).x},${project(GRID, GRID, 0).y + 14} ${project(GRID, 0, 0).x + 8},${project(GRID, 0, 0).y + 8}`} fill="rgba(42,29,36,0.12)" />

      {tiles.map(({ i, j }) => {
        const h = heightAt(i, j)
        const { x, y } = project(i, j)
        const depth = h * LEVEL
        const liquid = habitat.liquid && isLiquid(i, j)
        const checker = habitat.checker && (i + j) % 2 === 0
        const top = checker ? shade(habitat.top, -0.08) : habitat.top
        return (
          <g key={`${i}-${j}`}>
            <polygon points={`${x - HW},${y} ${x},${y + HH} ${x},${y + HH + depth} ${x - HW},${y + depth}`} fill={habitat.left} stroke={INK} strokeWidth="0.6" />
            <polygon points={`${x},${y + HH} ${x + HW},${y} ${x + HW},${y + depth} ${x},${y + HH + depth}`} fill={habitat.right} stroke={INK} strokeWidth="0.6" />
            {/* Junta de pedra nas laterais a cada nível */}
            {Array.from({ length: h - 1 }, (_, k) => (
              <g key={k} opacity="0.35">
                <line x1={x - HW} y1={y + (k + 1) * LEVEL} x2={x} y2={y + HH + (k + 1) * LEVEL} stroke={INK} strokeWidth="0.5" />
                <line x1={x} y1={y + HH + (k + 1) * LEVEL} x2={x + HW} y2={y + (k + 1) * LEVEL} stroke={INK} strokeWidth="0.5" />
              </g>
            ))}
            <polygon points={diamond(x, y)} fill={liquid ? shade(habitat.left, -0.1) : top} stroke={INK} strokeWidth="0.6" />
            {liquid ? (
              <>
                <polygon points={diamond(x, y + 2, 1)} fill={habitat.liquid.color} />
                <rect className="terrain-shine" style={{ animationDelay: `${((i + j) % 4) * 0.4}s` }} x={x - 5} y={y} width={4} height={1} fill={habitat.liquid.shine} />
                <rect className="terrain-shine" style={{ animationDelay: `${((i * 3 + j) % 4) * 0.5}s` }} x={x + 2} y={y + 3} width={3} height={1} fill={habitat.liquid.shine} />
              </>
            ) : (
              <>
                <polyline points={`${x - HW + 1},${y} ${x},${y - HH + 1} ${x + HW - 1},${y}`} fill="none" stroke={edge} strokeWidth="0.8" />
                {rand() > 0.35 && <rect x={x - 6 + Math.round(rand() * 10)} y={y - 2 + Math.round(rand() * 3)} width={2} height={1} fill={tuft} />}
                {rand() > 0.5 && <rect x={x - 3 + Math.round(rand() * 8)} y={y - 4 + Math.round(rand() * 6)} width={1} height={1} fill={tuft} />}
              </>
            )}
          </g>
        )
      })}
    </g>
  )
}

export default memo(Terrain)

export function TileHighlight({ tile, ok }) {
  if (!tile) return null
  const { x, y } = project(tile.i, tile.j)
  return <polygon className="tile-highlight" points={diamond(x, y, 1)} fill={ok ? 'rgba(255,250,240,0.35)' : 'rgba(217,56,30,0.3)'} stroke={ok ? '#fffaf0' : '#d9381e'} strokeWidth="1" strokeDasharray="2 2" />
}
