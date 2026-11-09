import { memo } from 'react'
import { PixelGroup } from '../common/PixelArt'
import { PersonGroup } from '../common/Person'
import { Box, Boat, Flower, Fountain, Gym, Lamp, LampGlow, Mart, PokeCenter, Sign } from './MapArt'
import { ROCK, ROCK_PALETTE, TREE, TREE_PALETTE, TREE_PALETTE_TEAL } from '../../art/sprites'
import { BUILDINGS, GARDEN, GYMS, LAKE, LAMPS, MAP_H, MAP_W, PLACES, ROADS, SEA, ZONES } from '../../data/cityPlaces'
import { DISTRICTS, TRAINER_LOOKS } from '../../data/world'
import { overlaps, seeded } from '../../utils/pixel'
import { spriteUrl } from '../../utils/pokemon'

// ===== Cenário estático (calculado uma vez, com semente fixa) =====

const BLOCKED = [
  ...ROADS,
  LAKE,
  SEA,
  GARDEN,
  ...PLACES.map((p) => ({ x: p.x - 6, y: p.y - 6, w: p.w + 12, h: p.h + 12 })),
  // Trilhas livres da porta de cada ginásio até a rua
  ...GYMS.map((g) => ({ x: g.x + g.w / 2 - 12, y: g.y + g.h, w: 24, h: 144 })),
  { x: 330, y: 80, w: 74, h: 64 },
  ...LAMPS.map((l) => ({ x: l.x - 6, y: l.y - 22, w: 15, h: 26 })),
]

function placeTrees(zone, density, seed, palette) {
  const rand = seeded(seed)
  const trees = []
  for (let y = zone.y - 4; y < zone.y + zone.h - 12; y += 13) {
    for (let x = zone.x - 4; x < zone.x + zone.w - 10; x += 14) {
      const tx = Math.round(x + rand() * 6)
      const ty = Math.round(y + rand() * 5)
      const foot = { x: tx + 2, y: ty + 2, w: 12, h: 13 }
      if (rand() < density && !BLOCKED.some((b) => overlaps(foot, b))) {
        trees.push({ x: tx, y: ty, palette })
      }
    }
  }
  return trees
}

const TREES = [
  ...placeTrees(ZONES.viridian, 0.92, 7, TREE_PALETTE_TEAL),
  ...placeTrees({ x: 330, y: 0, w: 72, h: 30 }, 0.9, 11, TREE_PALETTE),
  ...placeTrees({ x: 176, y: 0, w: 20, h: 140 }, 0.8, 13, TREE_PALETTE),
  ...placeTrees({ x: 286, y: 0, w: 18, h: 90 }, 0.8, 17, TREE_PALETTE),
  ...placeTrees({ x: 0, y: 270, w: 30, h: 50 }, 0.8, 19, TREE_PALETTE),
  ...placeTrees({ x: 120, y: 286, w: 32, h: 34 }, 0.8, 23, TREE_PALETTE),
]

function scatter(zone, count, seed, size = 6) {
  const rand = seeded(seed)
  const items = []
  for (let i = 0; i < count * 4 && items.length < count; i++) {
    const item = { x: Math.round(zone.x + rand() * (zone.w - size)), y: Math.round(zone.y + rand() * (zone.h - size)) }
    if (!BLOCKED.some((b) => overlaps({ ...item, w: size, h: size }, b))) items.push(item)
  }
  return items
}

const ROCKS = scatter(ZONES.pewter, 9, 31, 14)
const TUFTS = [
  ...scatter(ZONES.viridian, 30, 41, 3).map((t) => ({ ...t, color: '#2a7f63' })),
  ...scatter(ZONES.cerulean, 24, 43, 3).map((t) => ({ ...t, color: '#5fa64a' })),
]
const GLINTS = [...scatter(LAKE, 14, 51, 4), ...scatter(SEA, 14, 53, 4)].map((g, i) => ({ ...g, late: i % 2 === 0 }))
const FLOWER_COLORS = ['#f49ac1', '#f4c430', '#a78bfa', '#d9381e', '#fffaf0']
const FLOWERS = (() => {
  const rand = seeded(61)
  const list = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 13; col++) {
      if ((row === 1 || row === 2) && col > 4 && col < 8) continue // trilha no meio do jardim
      list.push({ x: GARDEN.x + 6 + col * 9, y: GARDEN.y + 8 + row * 14 + Math.round(rand() * 2), color: FLOWER_COLORS[(row + col) % 5] })
    }
  }
  return list
})()

const FIREFLIES = [...scatter(ZONES.viridian, 14, 71, 2), ...scatter(GARDEN, 6, 73, 2), ...scatter({ x: 330, y: 0, w: 70, h: 140 }, 5, 79, 2)].map((f, i) => ({
  ...f,
  delay: (i % 7) * 0.37,
}))

const Patterns = memo(function Patterns() {
  return (
    <defs>
      <radialGradient id="lamp-halo">
        <stop offset="0%" stopColor="#fbe08a" stopOpacity="0.9" />
        <stop offset="45%" stopColor="#f4c430" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#f4c430" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lamp-pool">
        <stop offset="0%" stopColor="#fbe08a" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#fbe08a" stopOpacity="0" />
      </radialGradient>
      <pattern id="p-grass-teal" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#3fae84" />
        <rect x="3" y="4" width="1" height="1" fill="#2f9a72" />
        <rect x="11" y="10" width="1" height="1" fill="#2f9a72" />
        <rect x="7" y="13" width="1" height="1" fill="#5cc49a" />
      </pattern>
      <pattern id="p-grass" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#92d36e" />
        <rect x="2" y="3" width="1" height="1" fill="#74bb58" />
        <rect x="10" y="9" width="1" height="1" fill="#74bb58" />
        <rect x="6" y="12" width="1" height="1" fill="#aee38a" />
      </pattern>
      <pattern id="p-stone" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#ccc7b9" />
        <rect width="8" height="1" fill="#b3ad9d" />
        <rect x="0" y="4" width="8" height="1" fill="#b3ad9d" />
        <rect x="3" y="0" width="1" height="4" fill="#b3ad9d" />
        <rect x="7" y="4" width="1" height="4" fill="#b3ad9d" />
        <rect x="1" y="1" width="1" height="1" fill="#e9e5da" />
        <rect x="5" y="5" width="1" height="1" fill="#e9e5da" />
      </pattern>
      <pattern id="p-plaza" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#f7dc7a" />
        <rect width="8" height="8" fill="#f4cf55" />
        <rect x="8" y="8" width="8" height="8" fill="#f4cf55" />
        <rect width="16" height="1" fill="#e6b93f" />
        <rect width="1" height="16" fill="#e6b93f" />
      </pattern>
      <pattern id="p-paving" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#ece3cd" />
        <rect width="12" height="1" fill="#d6caa9" />
        <rect width="1" height="12" fill="#d6caa9" />
      </pattern>
      <pattern id="p-brick" width="12" height="6" patternUnits="userSpaceOnUse">
        <rect width="12" height="6" fill="#eb9d84" />
        <rect width="12" height="1" fill="#c96e55" />
        <rect x="0" y="3" width="12" height="1" fill="#c96e55" />
        <rect x="5" y="0" width="1" height="3" fill="#c96e55" />
        <rect x="11" y="3" width="1" height="3" fill="#c96e55" />
      </pattern>
      <pattern id="p-road" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#e8d8ab" />
        <rect x="4" y="5" width="2" height="1" fill="#d2bf8c" />
        <rect x="12" y="12" width="2" height="1" fill="#d2bf8c" />
        <rect x="9" y="2" width="1" height="1" fill="#f5e8c4" />
      </pattern>
      <pattern id="p-water" width="16" height="8" patternUnits="userSpaceOnUse">
        <rect width="16" height="8" fill="#00aaee" />
        <rect x="2" y="2" width="4" height="1" fill="#33bdf2" />
        <rect x="10" y="6" width="4" height="1" fill="#33bdf2" />
      </pattern>
    </defs>
  )
})

const Scenery = memo(function Scenery() {
  return (
    <g>
      {/* Chão de cada bairro */}
      <rect {...rectOf(ZONES.viridian)} fill="url(#p-grass-teal)" />
      <rect {...rectOf(ZONES.saffron)} fill="url(#p-plaza)" />
      <rect {...rectOf(ZONES.cerulean)} fill="url(#p-grass)" />
      <rect {...rectOf(ZONES.pewter)} fill="url(#p-stone)" />
      <rect {...rectOf(ZONES.center)} fill="url(#p-paving)" />
      <rect {...rectOf(ZONES.vermillion)} fill="url(#p-brick)" />
      {TUFTS.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={t.y + 1} width="3" height="1" fill={t.color} />
          <rect x={t.x} y={t.y} width="1" height="1" fill={t.color} />
          <rect x={t.x + 2} y={t.y} width="1" height="1" fill={t.color} />
        </g>
      ))}

      {/* Ruas com meio-fio */}
      {ROADS.map((r, i) => (
        <g key={i}>
          <rect {...rectOf(r)} fill="url(#p-road)" />
          {r.w > r.h ? (
            <>
              <rect x={r.x} y={r.y} width={r.w} height="2" fill="#c9b583" />
              <rect x={r.x} y={r.y + r.h - 2} width={r.w} height="2" fill="#c9b583" />
            </>
          ) : (
            <>
              <rect x={r.x} y={r.y} width="2" height={r.h} fill="#c9b583" />
              <rect x={r.x + r.w - 2} y={r.y} width="2" height={r.h} fill="#c9b583" />
            </>
          )}
        </g>
      ))}
      {/* Cruzamentos e faixas de pedestre */}
      {[152, 304].map((x) => (
        <g key={x}>
          <rect x={x} y={144} width={24} height={32} fill="url(#p-road)" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={x + 3 + i * 5} y={178} width={3} height={8} fill="#fffaf0" opacity="0.8" />
          ))}
        </g>
      ))}

      {/* Lago de Cerulian com margem de areia */}
      <rect x={LAKE.x - 3} y={LAKE.y} width={LAKE.w + 3} height={LAKE.h + 3} fill="#f0dfa8" />
      <rect {...rectOf(LAKE)} fill="url(#p-water)" />
      <rect x={LAKE.x} y={LAKE.y + LAKE.h - 2} width={LAKE.w} height="2" fill="#0a6fb0" />
      <rect x={LAKE.x} y={LAKE.y} width="2" height={LAKE.h} fill="#0a6fb0" />

      {/* Mar e cais de Vermillion */}
      <rect {...rectOf(SEA)} fill="url(#p-water)" />
      <rect x={SEA.x} y={SEA.y} width={SEA.w} height="4" fill="#9a5f32" />
      <rect x={SEA.x} y={SEA.y + 4} width={SEA.w} height="2" fill="#0a6fb0" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={SEA.x + 6 + i * 15} y={SEA.y - 2} width="3" height="8" fill="#6b4226" />
      ))}
      {GLINTS.map((g, i) => (
        <rect key={i} className={`map-glint ${g.late ? 'map-glint--late' : ''}`} x={g.x} y={g.y} width="4" height="1" fill="#c8eeff" />
      ))}

      {/* Jardim da Erika */}
      <Box x={GARDEN.x} y={GARDEN.y} w={GARDEN.w} h={GARDEN.h} fill="#92d36e" line="#8a5a2a" />
      <rect x={GARDEN.x + 48} y={GARDEN.y + 20} width={30} height={26} fill="#e8d8ab" />
      {FLOWERS.map((f, i) => (
        <Flower key={i} {...f} />
      ))}

      {/* Pedras de Pewter */}
      {ROCKS.map((r, i) => (
        <PixelGroup key={i} grid={ROCK} palette={ROCK_PALETTE} x={r.x} y={r.y} />
      ))}
    </g>
  )
})

// Noite: um véu azul-escuro multiplicado sobre o mapa e, por cima dele, tudo que emite luz.
const NightLayer = memo(function NightLayer() {
  return (
    <g className="map-night" aria-hidden="true">
      <rect width={MAP_W} height={MAP_H} fill="#101a4a" opacity="0.62" style={{ mixBlendMode: 'multiply' }} />
      <rect width={MAP_W} height={MAP_H} fill="#0b1030" opacity="0.18" />
      {GYMS.map((g) => (
        <Gym key={g.district} {...g} lit />
      ))}
      <PokeCenter {...BUILDINGS.center} lit />
      <Mart {...BUILDINGS.mart} lit />
      <Boat {...BUILDINGS.boat} lit />
      {/* Reflexo da lua no lago e brilho da fonte */}
      <rect x={LAKE.x + 30} y={LAKE.y + 30} width={18} height={2} fill="#fffaf0" opacity="0.7" />
      <rect x={LAKE.x + 34} y={LAKE.y + 34} width={10} height={1} fill="#fffaf0" opacity="0.5" />
      <rect x={LAKE.x + 37} y={LAKE.y + 37} width={5} height={1} fill="#fffaf0" opacity="0.35" />
      <circle cx={BUILDINGS.fountain.x + 16} cy={BUILDINGS.fountain.y + 11} r="18" fill="#00aaee" opacity="0.18" />
      {LAMPS.map((l, i) => (
        <LampGlow key={i} {...l} />
      ))}
      {FIREFLIES.map((f, i) => (
        <rect key={i} className="map-firefly" style={{ animationDelay: `${f.delay}s` }} x={f.x} y={f.y} width="1" height="1" fill="#fbe08a" />
      ))}
    </g>
  )
})

function rectOf(r) {
  return { x: r.x, y: r.y, width: r.w, height: r.h }
}

// ===== Elementos interativos =====

function PlaceArt({ place }) {
  switch (place.kind) {
    case 'gym': {
      const gym = GYMS.find((g) => g.district === place.district)
      return <Gym {...gym} />
    }
    case 'building':
      return place.id === 'center' ? <PokeCenter {...place} /> : <Mart {...place} />
    case 'object':
      return place.id === 'fountain' ? <Fountain {...place} /> : <Boat {...place} />
    case 'sign':
      return <Sign x={place.x} y={place.y} color={DISTRICTS[place.district].color} />
    case 'trainer':
      return (
        <>
          <rect x={place.x + 1} y={place.y + 15} width="10" height="3" fill="rgba(20,20,40,0.25)" />
          <g className="map-bob">
            <PersonGroup look={TRAINER_LOOKS[place.trainerId]} x={place.x} y={place.y} />
          </g>
          {place.trainerId === 11 && <Bush x={place.x - 4} y={place.y + 8} />}
        </>
      )
    case 'wild':
      return (
        <>
          <rect x={place.x + 9} y={place.y + 26} width="14" height="3" fill="rgba(20,20,40,0.22)" />
          <g className="map-bob map-bob--slow">
            <image href={spriteUrl(place.pokemonId)} x={place.x} y={place.y} width={place.w} height={place.h} />
          </g>
        </>
      )
    default:
      return null
  }
}

function Bush({ x, y }) {
  return (
    <>
      <Box x={x} y={y + 2} w={20} h={10} fill="#3fa34d" line="#173d2a" />
      <rect x={x + 3} y={y} width={8} height={4} fill="#173d2a" />
      <rect x={x + 4} y={y + 1} width={6} height={3} fill="#3fa34d" />
      <rect x={x + 3} y={y + 4} width={3} height={1} fill="#7fd36a" />
      <rect x={x + 12} y={y + 6} width={3} height={1} fill="#7fd36a" />
    </>
  )
}

function Hotspot({ place, active, onSelect, onHover }) {
  return (
    <g
      className={`hotspot hotspot--${place.kind} ${active ? 'hotspot--active' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={place.name}
      onClick={() => onSelect(place)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(place)
        }
      }}
      onMouseEnter={() => onHover(place)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(place)}
      onBlur={() => onHover(null)}
    >
      <rect x={place.x - 3} y={place.y - 3} width={place.w + 6} height={place.h + 6} fill="transparent" />
      <PlaceArt place={place} />
    </g>
  )
}

export default function CityMap({ places = PLACES, night = false, activeId, onSelect, onHover }) {
  // Tudo que tem "altura" é desenhado de cima para baixo, para sobrepor corretamente.
  const layered = [
    ...TREES.map((t, i) => ({ type: 'tree', bottom: t.y + 15, key: `t${i}`, tree: t })),
    ...LAMPS.map((l, i) => ({ type: 'lamp', bottom: l.y, key: `l${i}`, lamp: l })),
    ...places.map((p) => ({ type: 'place', bottom: p.y + p.h, key: p.id, place: p })),
  ].sort((a, b) => a.bottom - b.bottom)

  return (
    <svg className={`city-map__svg ${night ? 'is-night' : ''}`} viewBox={`0 0 ${MAP_W} ${MAP_H}`} shapeRendering="crispEdges" role="group" aria-label="Mapa da cidade">
      <Patterns />
      <Scenery />
      {layered.map((item) => {
        if (item.type === 'tree') return <PixelGroup key={item.key} grid={TREE} palette={item.tree.palette} x={item.tree.x} y={item.tree.y} />
        if (item.type === 'lamp') return <Lamp key={item.key} {...item.lamp} />
        return <Hotspot key={item.key} place={item.place} active={item.place.id === activeId} onSelect={onSelect} onHover={onHover} />
      })}
      {night && <NightLayer />}
    </svg>
  )
}
