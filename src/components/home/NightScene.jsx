import { memo } from 'react'
import { PixelGroup } from '../common/PixelArt'
import { CLOUD, MOON, MOON_PALETTE, PINE, TREE, TREE_PALETTE_NIGHT } from '../../art/sprites'
import { seeded } from '../../utils/pixel'
import { spriteUrl } from '../../utils/pokemon'

const W = 320
const H = 180

const rand = seeded(2026)
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: Math.floor(rand() * W),
  y: Math.floor(rand() * 112),
  big: rand() > 0.85,
  delay: (i % 6) * 0.4,
}))
const SPARKLES = [
  [70, 20],
  [150, 60],
  [262, 30],
  [210, 92],
  [118, 102],
  [296, 74],
]
const FIREFLIES = Array.from({ length: 14 }, (_, i) => ({
  x: 20 + Math.floor(rand() * 280),
  y: 120 + Math.floor(rand() * 40),
  delay: (i % 7) * 0.5,
}))

// Montanhas em "escada": cada degrau tem 4px, dando a silhueta pixelada.
function steppedRidge(seed, baseY, amplitude) {
  const r = seeded(seed)
  let y = baseY
  let d = `M0 ${H} L0 ${y}`
  for (let x = 0; x <= W; x += 4) {
    y = Math.max(baseY - amplitude, Math.min(baseY + 6, y + Math.round((r() - 0.5) * 3) * 2))
    d += ` L${x} ${y} L${x + 4} ${y}`
  }
  return `${d} L${W} ${H} Z`
}

const RIDGE_FAR = steppedRidge(5, 104, 26)
const RIDGE_NEAR = steppedRidge(9, 122, 12)
const PINE_FAR = { g: '#0d4d55', t: '#0d4d55' }
const PINE_NEAR = { g: '#0a3a40', t: '#0a3a40' }
const CLOUD_DARK = { w: '#1f4a82', s: '#173b6c' }

// Cenário noturno da tela inicial, inteiro em SVG pixelado.
function NightScene() {
  return (
    <svg className="night" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" aria-hidden="true">
      {/* Céu em faixas */}
      <rect width={W} height={H} fill="#0b1a3a" />
      <rect y="40" width={W} height="40" fill="#0f2350" />
      <rect y="80" width={W} height="30" fill="#132e63" />
      <rect y="110" width={W} height="40" fill="#183b76" />

      {STARS.map((s, i) => (
        <rect key={i} className="night__star" style={{ animationDelay: `${s.delay}s` }} x={s.x} y={s.y} width={s.big ? 2 : 1} height={s.big ? 2 : 1} fill={s.big ? '#fbe08a' : '#cfe8ff'} />
      ))}
      {SPARKLES.map(([x, y], i) => (
        <g key={i} className="night__sparkle" style={{ animationDelay: `${i * 0.35}s` }} fill="#7fd0f5">
          <rect x={x} y={y - 2} width="1" height="5" />
          <rect x={x - 2} y={y} width="5" height="1" />
        </g>
      ))}

      {/* Lua com halo em anéis */}
      <circle cx="52" cy="30" r="26" fill="#f4c430" opacity="0.06" />
      <circle cx="52" cy="30" r="19" fill="#f4c430" opacity="0.1" />
      <PixelGroup grid={MOON} palette={MOON_PALETTE} x={40} y={18} scale={1.5} />

      <g className="night__shooting">
        <rect x="230" y="18" width="6" height="1" fill="#fffaf0" />
        <rect x="236" y="17" width="4" height="1" fill="#cfe8ff" opacity="0.6" />
      </g>

      {/* Nuvens passando */}
      <g className="night__cloud night__cloud--a">
        <PixelGroup grid={CLOUD} palette={CLOUD_DARK} x={0} y={42} scale={2} />
      </g>
      <g className="night__cloud night__cloud--b">
        <PixelGroup grid={CLOUD} palette={CLOUD_DARK} x={0} y={70} scale={1.5} />
      </g>

      <path d={RIDGE_FAR} fill="#16407a" />
      <path d={RIDGE_NEAR} fill="#0f4d63" />
      {Array.from({ length: 22 }, (_, i) => (
        <PixelGroup key={`pf${i}`} grid={PINE} palette={PINE_FAR} x={i * 15 - 4} y={108 + ((i * 7) % 5)} scale={1} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <PixelGroup key={`pn${i}`} grid={PINE} palette={PINE_NEAR} x={i * 21 + 6} y={118 + ((i * 5) % 6)} scale={1.4} />
      ))}

      {/* Chão: grama, trilha e flores */}
      <rect y="146" width={W} height="34" fill="#1f6e4a" />
      <rect y="146" width={W} height="2" fill="#2f9a62" />
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={`g${i}`} x={i * 8 + (i % 3)} y={144} width="2" height="2" fill="#2f9a62" />
      ))}
      <rect y="156" width={W} height="12" fill="#c7a86a" />
      <rect y="156" width={W} height="1" fill="#a8894f" />
      <rect y="167" width={W} height="1" fill="#a8894f" />
      {Array.from({ length: 18 }, (_, i) => (
        <rect key={`p${i}`} x={i * 18 + 5} y={160 + (i % 3) * 2} width="2" height="1" fill="#a8894f" />
      ))}
      {[30, 64, 120, 190, 236, 288].map((x, i) => (
        <g key={`f${i}`}>
          <rect x={x} y={150} width="1" height="3" fill="#2f9a62" />
          <rect x={x - 1} y={149} width="3" height="1" fill={i % 2 ? '#f4c430' : '#f49ac1'} />
          <rect x={x} y={148} width="1" height="1" fill={i % 2 ? '#f4c430' : '#f49ac1'} />
        </g>
      ))}

      {/* Árvores grandes emoldurando a cena */}
      <PixelGroup grid={TREE} palette={TREE_PALETTE_NIGHT} x={-26} y={86} scale={4.4} />
      <PixelGroup grid={TREE} palette={TREE_PALETTE_NIGHT} x={278} y={80} scale={4.6} flip />

      {/* Pokémon passeando pela trilha */}
      <g className="night__walker">
        <image href={spriteUrl(25)} x="0" y="140" width="24" height="24" className="night__step" />
        <image href={spriteUrl(1)} x="26" y="140" width="24" height="24" className="night__step night__step--late" />
      </g>

      {FIREFLIES.map((f, i) => (
        <rect key={`ff${i}`} className="night__firefly" style={{ animationDelay: `${f.delay}s` }} x={f.x} y={f.y} width="1" height="1" fill="#fbe08a" />
      ))}
    </svg>
  )
}

export default memo(NightScene)
