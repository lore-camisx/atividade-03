import { memo } from 'react'
import { INK } from '../../art/sprites'

// Clareia (amount > 0) ou escurece (amount < 0) uma cor hex.
export function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c) => Math.round(amount > 0 ? c + (255 - c) * amount : c * (1 + amount))
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(mix)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// Bolha arredondada feita de faixas horizontais (2px por linha), com contorno, luz e sombra.
function Blob({ x, y, widths, color, row = 2 }) {
  const top = y - widths.length * row
  const light = shade(color, 0.35)
  const dark = shade(color, -0.25)
  return (
    <g>
      {widths.map((w, k) => (
        <rect key={`o${k}`} x={x - w / 2 - 1} y={top + k * row - 1} width={w + 2} height={row + 2} fill={INK} />
      ))}
      {widths.map((w, k) => (
        <rect key={`f${k}`} x={x - w / 2} y={top + k * row} width={w} height={row} fill={color} />
      ))}
      {widths.map((w, k) =>
        k > widths.length / 2 ? <rect key={`d${k}`} x={x + w / 2 - w * 0.35} y={top + k * row} width={w * 0.35} height={row} fill={dark} /> : null,
      )}
      {widths.slice(1, Math.ceil(widths.length / 2)).map((w, k) => (
        <rect key={`l${k}`} x={x - w / 2 + 2} y={top + (k + 1) * row} width={Math.max(2, w * 0.3)} height={row} fill={light} />
      ))}
    </g>
  )
}

function Tree({ x, y, color }) {
  return (
    <g>
      <rect x={x - 3} y={y - 12} width={6} height={13} fill={INK} />
      <rect x={x - 2} y={y - 12} width={4} height={12} fill="#7a4a2a" />
      <rect x={x} y={y - 12} width={2} height={12} fill="#5a3418" />
      <rect x={x - 6} y={y - 1} width={12} height={2} fill="rgba(0,0,0,0.18)" />
      <Blob x={x} y={y - 10} widths={[10, 16, 20, 24, 26, 26, 26, 24, 22, 16, 10]} color={color} />
      {/* Florzinhas na copa */}
      <rect x={x - 6} y={y - 26} width={2} height={2} fill={shade(color, 0.6)} />
      <rect x={x + 5} y={y - 18} width={2} height={2} fill={shade(color, 0.6)} />
      <rect x={x - 1} y={y - 30} width={2} height={2} fill={shade(color, 0.6)} />
    </g>
  )
}

function Pine({ x, y, color }) {
  const tiers = [4, 8, 6, 10, 14, 10, 14, 18]
  return (
    <g>
      <rect x={x - 2} y={y - 6} width={4} height={7} fill="#5a3418" />
      <Blob x={x} y={y - 4} widths={tiers} color={color} row={3} />
    </g>
  )
}

function Bush({ x, y, color }) {
  return <Blob x={x} y={y + 2} widths={[8, 14, 16, 16, 14]} color={color} />
}

function Rock({ x, y, color }) {
  return <Blob x={x} y={y + 2} widths={[6, 12, 14, 16, 16]} color={color} />
}

function Flower({ x, y, color }) {
  return (
    <g>
      {[
        [-6, -1],
        [3, -3],
        [-1, 2],
      ].map(([dx, dy], k) => (
        <g key={k}>
          <rect x={x + dx + 1} y={y + dy} width={1} height={3} fill="#3f8f4a" />
          <rect x={x + dx} y={y + dy - 2} width={3} height={2} fill={color} />
          <rect x={x + dx + 1} y={y + dy - 3} width={1} height={1} fill={color} />
          <rect x={x + dx + 1} y={y + dy - 2} width={1} height={1} fill="#fbe08a" />
        </g>
      ))}
    </g>
  )
}

function Crystal({ x, y, color }) {
  return (
    <g className="decor-glow">
      <polygon points={`${x},${y - 25} ${x + 7},${y - 11} ${x},${y + 1} ${x - 7},${y - 11}`} fill={INK} />
      <polygon points={`${x},${y - 23} ${x + 5},${y - 11} ${x},${y - 1} ${x - 5},${y - 11}`} fill={color} />
      <polygon points={`${x},${y - 23} ${x},${y - 1} ${x - 5},${y - 11}`} fill={shade(color, 0.4)} />
      <rect x={x - 2} y={y - 17} width={1} height={4} fill="#ffffff" />
    </g>
  )
}

function Pole({ x, y }) {
  return (
    <g>
      <path d={`M${x - 8} ${y - 40} Q ${x - 50} ${y - 22} ${x - 120} ${y - 36}`} stroke={INK} strokeWidth="0.8" fill="none" />
      <path d={`M${x + 8} ${y - 40} Q ${x + 40} ${y - 26} ${x + 110} ${y - 10}`} stroke={INK} strokeWidth="0.8" fill="none" />
      <rect x={x - 3} y={y - 46} width={6} height={47} fill={INK} />
      <rect x={x - 2} y={y - 45} width={4} height={45} fill="#9b9584" />
      <rect x={x} y={y - 45} width={2} height={45} fill="#7a7466" />
      <rect x={x - 10} y={y - 42} width={20} height={4} fill={INK} />
      <rect x={x - 9} y={y - 41} width={18} height={2} fill="#ccc7b9" />
    </g>
  )
}

function Box({ x, y }) {
  return (
    <g>
      <rect x={x - 7} y={y - 15} width={14} height={16} fill={INK} />
      <rect x={x - 6} y={y - 14} width={12} height={14} fill="#6a8a9a" />
      <rect x={x + 1} y={y - 14} width={5} height={14} fill="#557585" />
      <rect x={x - 4} y={y - 11} width={6} height={4} fill="#c8eeff" />
      <rect x={x - 4} y={y - 5} width={2} height={2} fill="#f8d030" className="decor-blink" />
    </g>
  )
}

function Tomb({ x, y }) {
  return (
    <g>
      <Blob x={x} y={y + 1} widths={[6, 10, 10, 10, 10, 10, 10]} color="#9b95a8" />
      <rect x={x - 1} y={y - 11} width={2} height={7} fill="#5a5470" />
      <rect x={x - 3} y={y - 9} width={6} height={2} fill="#5a5470" />
    </g>
  )
}

function Mushroom({ x, y, color }) {
  return (
    <g>
      <rect x={x - 3} y={y - 6} width={6} height={7} fill={INK} />
      <rect x={x - 2} y={y - 6} width={4} height={6} fill="#fffaf0" />
      <Blob x={x} y={y - 5} widths={[6, 12, 14, 14]} color={color} />
      <rect x={x - 4} y={y - 11} width={2} height={2} fill="#fffaf0" />
      <rect x={x + 2} y={y - 9} width={2} height={2} fill="#fffaf0" />
    </g>
  )
}

function Cactus({ x, y }) {
  return (
    <g>
      <rect x={x - 4} y={y - 22} width={8} height={23} fill={INK} />
      <rect x={x - 3} y={y - 21} width={6} height={21} fill="#5fae4a" />
      <rect x={x + 1} y={y - 21} width={2} height={21} fill="#3f8f3a" />
      <rect x={x - 10} y={y - 16} width={7} height={4} fill={INK} />
      <rect x={x - 10} y={y - 21} width={4} height={8} fill={INK} />
      <rect x={x - 9} y={y - 20} width={2} height={6} fill="#5fae4a" />
      <rect x={x - 9} y={y - 15} width={6} height={2} fill="#5fae4a" />
      <rect x={x + 3} y={y - 12} width={7} height={4} fill={INK} />
      <rect x={x + 6} y={y - 17} width={4} height={8} fill={INK} />
      <rect x={x + 7} y={y - 16} width={2} height={6} fill="#5fae4a" />
      <rect x={x + 3} y={y - 11} width={6} height={2} fill="#5fae4a" />
    </g>
  )
}

function Pillar({ x, y, color }) {
  return (
    <g>
      <rect x={x - 7} y={y - 30} width={14} height={31} fill={INK} />
      <rect x={x - 6} y={y - 29} width={12} height={4} fill={color} />
      <rect x={x - 4} y={y - 25} width={8} height={21} fill={color} />
      <rect x={x + 1} y={y - 25} width={3} height={21} fill={shade(color, -0.2)} />
      <rect x={x - 6} y={y - 4} width={12} height={4} fill={color} />
    </g>
  )
}

function Fence({ x, y }) {
  return (
    <g>
      {[-8, 0, 8].map((dx) => (
        <g key={dx}>
          <rect x={x + dx - 2} y={y + dx / 2 - 11} width={4} height={11} fill={INK} />
          <rect x={x + dx - 1} y={y + dx / 2 - 10} width={2} height={9} fill="#d9381e" />
        </g>
      ))}
      <polygon points={`${x - 10},${y - 12} ${x + 10},${y - 2} ${x + 10},${y} ${x - 10},${y - 10}`} fill="#9c2512" />
    </g>
  )
}

function Cloud({ x, y }) {
  return (
    <g className="decor-float">
      <Blob x={x} y={y - 8} widths={[8, 16, 22, 24]} color="#fffaf0" />
    </g>
  )
}

function Post({ x, y }) {
  return (
    <g>
      <rect x={x - 3} y={y - 22} width={6} height={23} fill={INK} />
      <rect x={x - 2} y={y - 21} width={4} height={21} fill="#9a6a3a" />
      <rect x={x - 9} y={y - 17} width={18} height={4} fill={INK} />
      <rect x={x - 8} y={y - 16} width={16} height={2} fill="#c98a52" />
      <Blob x={x} y={y - 20} widths={[6, 8, 8, 6]} color="#e8d8ab" />
    </g>
  )
}

function Lily({ x, y }) {
  return (
    <g className="decor-float">
      <rect x={x - 6} y={y - 2} width={12} height={4} fill="#3f9b4f" />
      <rect x={x - 4} y={y - 3} width={8} height={6} fill="#3f9b4f" />
      <rect x={x - 1} y={y - 5} width={3} height={3} fill="#f49ac1" />
    </g>
  )
}

const KINDS = { tree: Tree, pine: Pine, bush: Bush, rock: Rock, flower: Flower, crystal: Crystal, pole: Pole, box: Box, tomb: Tomb, mushroom: Mushroom, cactus: Cactus, pillar: Pillar, fence: Fence, cloud: Cloud, post: Post, lily: Lily }

function Decor({ kind, x, y, color }) {
  const Component = KINDS[kind]
  return Component ? <Component x={x} y={y} color={color} /> : null
}

export default memo(Decor)
