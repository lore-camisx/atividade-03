import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PixelArt, { PixelGroup } from '../common/PixelArt'
import PixelIcon from '../common/PixelIcon'
import Decor from './Decor'
import Terrain, { TileHighlight } from './Terrain'
import Weather from './Weather'
import { ITEMS } from './items'
import { VIEW, findPath, heightAt, project, tileAt, walkable } from './iso'
import { GRID, PHRASES, START_TILE, habitatFor } from '../../data/habitats'
import { spriteUrl } from '../../utils/pokemon'
import { useTheme } from '../../context/ThemeContext'
import { seeded } from '../../utils/pixel'
import '../../css/pokedex/Habitat.css'

const TICK = 90
const STEP = 0.2
const SLEEP_AFTER = 40000
const MAX_BERRIES = 3

// Vaga-lumes do modo noturno, em posições fixas sobre o diorama.
const FIREFLIES = (() => {
  const rand = seeded(88)
  return Array.from({ length: 12 }, (_, k) => ({ x: 40 + Math.round(rand() * 176), y: 50 + Math.round(rand() * 120), delay: (k % 6) * 0.45 }))
})()

const pick = (list) => list[Math.floor(Math.random() * list.length)]
const clamp = (n) => Math.max(0, Math.min(100, n))
let uid = 0

function moodLabel(mood, mode) {
  if (mode === 'sleep') return 'Dormindo'
  if (mood >= 80) return 'Radiante'
  if (mood >= 55) return 'Feliz'
  if (mood >= 30) return 'Tranquilo'
  return 'Carente'
}

// Diorama isométrico onde o Pokémon anda, come, brinca e reage ao usuário.
export default function Diorama({ pokemon }) {
  const habitat = habitatFor(pokemon)
  const { isNight } = useTheme()
  const types = useMemo(() => pokemon.types.map((t) => t.name), [pokemon])
  const svgRef = useRef(null)

  const [pos, setPos] = useState(START_TILE)
  const [mode, setMode] = useState('idle') // idle | walk | sleep
  const [facing, setFacing] = useState(1) // 1 = olhando para a esquerda (sprite original), -1 = direita
  const [items, setItems] = useState([])
  const [mood, setMood] = useState(60)
  const [bubble, setBubble] = useState(null)
  const [hearts, setHearts] = useState([])
  const [hop, setHop] = useState(0)
  const [follow, setFollow] = useState(false)
  const [hoverTile, setHoverTile] = useState(null)
  const [drag, setDrag] = useState(null)

  // Refs espelham o estado para o laço de animação não usar valores antigos.
  const state = useRef({})
  state.current = { pos, mode, items, follow }
  const path = useRef([])
  const goal = useRef(null)
  const lastInteraction = useRef(Date.now())
  const lastMove = useRef(Date.now())
  const clicks = useRef([])
  const lastFollow = useRef(0)

  const canWalk = useCallback((i, j) => walkable(i, j, habitat, types), [habitat, types])

  const say = useCallback((kindOrText) => {
    setBubble({ text: PHRASES[kindOrText] ? pick(PHRASES[kindOrText]) : kindOrText, key: ++uid })
  }, [])

  const love = useCallback((count) => {
    const batch = Array.from({ length: count }, (_, k) => ({ id: ++uid, dx: (k - (count - 1) / 2) * 14 + Math.round(Math.random() * 6) }))
    setHearts((h) => [...h, ...batch])
    setTimeout(() => setHearts((h) => h.filter((x) => !batch.includes(x))), 1100)
  }, [])

  useEffect(() => {
    if (!bubble) return
    const timer = setTimeout(() => setBubble(null), 2200)
    return () => clearTimeout(timer)
  }, [bubble])

  const touch = () => {
    lastInteraction.current = Date.now()
  }

  const goTo = useCallback(
    (tile, nextGoal = null) => {
      const from = { i: Math.round(state.current.pos.i), j: Math.round(state.current.pos.j) }
      const route = findPath(from, tile, canWalk)
      if (!route) {
        say('blocked')
        return false
      }
      path.current = route
      goal.current = nextGoal
      setMode('walk')
      return true
    },
    [canWalk, say],
  )

  function randomFreeTile(near, minDist = 1, maxDist = 3) {
    const options = []
    for (let j = 0; j < GRID; j++) {
      for (let i = 0; i < GRID; i++) {
        const dist = Math.abs(i - near.i) + Math.abs(j - near.j)
        if (dist >= minDist && dist <= maxDist && canWalk(i, j) && findPath(near, { i, j }, canWalk)) options.push({ i, j })
      }
    }
    return options.length ? pick(options) : null
  }

  // Chegou ao destino: come a fruta ou chuta a bola para outro lugar e corre atrás.
  function arrive() {
    const target = goal.current
    goal.current = null
    lastMove.current = Date.now()
    if (!target) return
    const item = state.current.items.find((it) => it.id === target.id)
    if (!item) return
    if (item.kind === 'berry') {
      setItems((list) => list.filter((it) => it.id !== item.id))
      setMood((m) => clamp(m + 15))
      setHop((n) => n + 1)
      say('eat')
      love(3)
    } else {
      setMood((m) => clamp(m + 8))
      setHop((n) => n + 1)
      say('play')
      const here = { i: item.i, j: item.j }
      const next = target.count < 3 ? randomFreeTile(here, 2, 3) : null
      if (next) {
        setItems((list) => list.map((it) => (it.id === item.id ? { ...it, ...next } : it)))
        setTimeout(() => goTo(next, { id: item.id, count: target.count + 1 }), 650)
      } else {
        love(2)
      }
    }
  }

  // Laço de animação a ~11 quadros por segundo (movimento "em passos", como pixel art).
  const tick = useRef(() => {})
  tick.current = () => {
    const now = Date.now()
    const { mode: m, pos: p, follow: f } = state.current

    if (m === 'walk') {
      const next = path.current[0]
      if (!next) {
        setMode('idle')
        arrive()
        return
      }
      const di = next.i - p.i
      const dj = next.j - p.j
      const screenDx = di - dj
      if (screenDx !== 0) setFacing(screenDx > 0 ? -1 : 1)
      const dist = Math.abs(di) + Math.abs(dj)
      if (dist <= STEP) {
        setPos(next)
        path.current = path.current.slice(1)
        if (path.current.length === 0) {
          setMode('idle')
          arrive()
        }
      } else {
        setPos({ i: p.i + Math.sign(di) * Math.min(STEP, Math.abs(di)), j: p.j + Math.sign(dj) * Math.min(STEP, Math.abs(dj)) })
      }
      return
    }

    if (m === 'idle') {
      if (now - lastInteraction.current > SLEEP_AFTER) {
        setMode('sleep')
        setBubble({ text: 'Zzz...', key: ++uid })
      } else if (!f && now - lastMove.current > 5000 + Math.random() * 4000) {
        lastMove.current = now
        const target = randomFreeTile({ i: Math.round(p.i), j: Math.round(p.j) }, 1, 3)
        if (target) goTo(target)
      }
    }
  }

  useEffect(() => {
    if (isNight) setBubble({ text: 'Boa noite! ☾', key: ++uid })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const loop = setInterval(() => tick.current(), TICK)
    const decay = setInterval(() => setMood((m) => clamp(m - 1)), 4000)
    return () => {
      clearInterval(loop)
      clearInterval(decay)
    }
  }, [])

  // Converte a posição do ponteiro na tela para coordenadas do SVG.
  function svgPoint(clientX, clientY) {
    const svg = svgRef.current
    const ctm = svg?.getScreenCTM()
    if (!ctm) return null
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    return { x: pt.x, y: pt.y }
  }

  function wake() {
    if (state.current.mode === 'sleep') {
      setMode('idle')
      say('wake')
      setHop((n) => n + 1)
      return true
    }
    return false
  }

  function pet() {
    touch()
    if (wake()) return
    const now = Date.now()
    clicks.current = [...clicks.current.filter((t) => now - t < 2000), now]
    setHop((n) => n + 1)
    if (clicks.current.length >= 6) {
      clicks.current = []
      setMood((m) => clamp(m - 3))
      say('dizzy')
    } else {
      setMood((m) => clamp(m + 4))
      say('pet')
      love(2)
    }
  }

  function placeItem(kind, tile) {
    touch()
    wake()
    if (!tile || !canWalk(tile.i, tile.j)) {
      say('blocked')
      return
    }
    const id = ++uid
    setItems((list) => {
      const others = kind === 'ball' ? list.filter((it) => it.kind !== 'ball') : list
      const berries = others.filter((it) => it.kind === 'berry')
      const trimmed = kind === 'berry' && berries.length >= MAX_BERRIES ? others.filter((it) => it.id !== berries[0].id) : others
      return [...trimmed, { id, kind, i: tile.i, j: tile.j }]
    })
    // Espera o item entrar no estado antes de mandar o Pokémon buscar.
    setTimeout(() => goTo(tile, { id, count: 0 }), 0)
  }

  function onSceneClick(event) {
    const pt = svgPoint(event.clientX, event.clientY)
    const tile = pt && tileAt(pt.x, pt.y)
    if (!tile) return
    touch()
    wake()
    goTo(tile)
  }

  function onScenePointerMove(event) {
    const pt = svgPoint(event.clientX, event.clientY)
    if (!pt) return
    const tile = tileAt(pt.x, pt.y)
    setHoverTile(tile)
    const { mode: m, pos: p } = state.current
    const me = project(p.i, p.j)
    if (m === 'idle') setFacing(pt.x > me.x ? -1 : 1)
    if (follow && tile && Date.now() - lastFollow.current > 350) {
      lastFollow.current = Date.now()
      touch()
      if (wake()) return
      const here = { i: Math.round(p.i), j: Math.round(p.j) }
      if ((tile.i !== here.i || tile.j !== here.j) && canWalk(tile.i, tile.j)) goTo(tile)
    }
  }

  function onSceneKeyDown(event) {
    const moves = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
    if (moves[event.key]) {
      event.preventDefault()
      event.stopPropagation()
      touch()
      wake()
      const p = state.current.pos
      const [di, dj] = moves[event.key]
      goTo({ i: Math.round(p.i) + di, j: Math.round(p.j) + dj })
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      pet()
    }
  }

  // Arrastar um item da bandeja até o diorama (ou só clicar, que solta perto do Pokémon).
  function onItemPointerDown(event, kind) {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrag({ kind, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, active: false })
  }

  function onItemPointerMove(event) {
    if (!drag) return
    const moved = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6
    setDrag({ ...drag, x: event.clientX, y: event.clientY, active: drag.active || moved })
    const pt = svgPoint(event.clientX, event.clientY)
    setHoverTile(pt ? tileAt(pt.x, pt.y) : null)
  }

  function onItemPointerUp(event) {
    if (!drag) return
    const { kind, active } = drag
    setDrag(null)
    if (active) {
      const pt = svgPoint(event.clientX, event.clientY)
      const rect = svgRef.current.getBoundingClientRect()
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
      if (inside && pt) placeItem(kind, tileAt(pt.x, pt.y))
    } else {
      dropNear(kind)
    }
  }

  function dropNear(kind) {
    const p = state.current.pos
    placeItem(kind, randomFreeTile({ i: Math.round(p.i), j: Math.round(p.j) }, 1, 2))
  }

  function callHome() {
    touch()
    wake()
    if (goTo(START_TILE)) say('Tô indo!')
  }

  // ===== Desenho =====
  const me = project(pos.i, pos.j, heightAt(Math.round(pos.i), Math.round(pos.j)))
  const SPRITE = 56
  const entities = [
    ...habitat.decor.map((dec) => ({ depth: dec.i + dec.j, key: `d-${dec.kind}-${dec.i}-${dec.j}`, node: <Decor kind={dec.kind} color={dec.color} {...project(dec.i, dec.j)} /> })),
    ...items.map((it) => {
      const c = project(it.i, it.j)
      const art = ITEMS[it.kind]
      return {
        depth: it.i + it.j - 0.01,
        key: `i-${it.id}`,
        node: (
          <g className={`habitat-item habitat-item--${it.kind}`} style={{ transform: `translate(${c.x - 4}px, ${c.y - 9}px)` }}>
            <rect x="1" y="7" width="7" height="2" fill="rgba(0,0,0,0.2)" />
            <PixelGroup grid={art.grid} palette={art.palette} />
          </g>
        ),
      }
    }),
    {
      depth: pos.i + pos.j + 0.02,
      key: 'pokemon',
      node: (
        <g
          className={`habitat-mon ${mode === 'sleep' ? 'is-sleeping' : ''} ${mode === 'walk' ? 'is-walking' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`Fazer carinho em ${pokemon.name}`}
          onClick={(e) => {
            e.stopPropagation()
            pet()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              pet()
            }
          }}
        >
          <rect x={me.x - 9} y={me.y - 1} width="18" height="3" fill="rgba(0,0,0,0.22)" />
          <g key={hop} className="habitat-mon__hop">
            <g transform={`translate(${me.x} 0) scale(${facing} 1) translate(${-me.x} 0)`}>
              <image href={spriteUrl(pokemon.id)} x={me.x - SPRITE / 2} y={me.y - SPRITE + 8} width={SPRITE} height={SPRITE} />
            </g>
          </g>
        </g>
      ),
    },
  ].sort((a, b) => a.depth - b.depth)

  const hoverOk = hoverTile && canWalk(hoverTile.i, hoverTile.j)
  const overlay = (dy = 0) => ({ left: `${(me.x / VIEW.w) * 100}%`, top: `${((me.y - SPRITE + 8 + dy) / VIEW.h) * 100}%` })

  return (
    <div className="habitat">
      <div className="habitat__stage" style={{ '--sky': habitat.sky }} data-night={habitat.night || undefined}>
        <svg
          ref={svgRef}
          className="habitat__svg"
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          shapeRendering="crispEdges"
          tabIndex={0}
          role="application"
          aria-label={`Habitat ${habitat.name}. Clique em um bloco para o Pokémon andar até lá; use as setas para movê-lo e Enter para fazer carinho.`}
          onClick={onSceneClick}
          onPointerMove={onScenePointerMove}
          onPointerLeave={() => setHoverTile(null)}
          onKeyDown={onSceneKeyDown}
        >
          <Terrain habitat={habitat} />
          <TileHighlight tile={hoverTile} ok={hoverOk} />
          {entities.map((e) => (
            <g key={e.key}>{e.node}</g>
          ))}
          {isNight && !habitat.night && (
            <g className="habitat-night" aria-hidden="true">
              <rect width={VIEW.w} height={VIEW.h} fill="#1a2260" opacity="0.36" style={{ mixBlendMode: 'multiply' }} />
              {FIREFLIES.map((f, k) => (
                <rect key={k} className="habitat-firefly" style={{ animationDelay: `${f.delay}s` }} x={f.x} y={f.y} width="1.5" height="1.5" fill="#fbe08a" />
              ))}
            </g>
          )}
          <Weather kind={habitat.weather} color={habitat.particle} />
        </svg>

        {bubble && (
          <span key={bubble.key} className="habitat__bubble" style={overlay(-4)} role="status">
            {bubble.text}
          </span>
        )}
        {hearts.map((h) => (
          <span key={h.id} className="habitat__heart" style={{ ...overlay(6), marginLeft: h.dx }} aria-hidden="true">
            <PixelIcon name="heart" size={14} />
          </span>
        ))}
        <span className="habitat__label">{habitat.name}</span>
      </div>

      <div className="habitat__hud">
        <div className="habitat__mood" aria-label={`Humor: ${moodLabel(mood, mode)}, ${mood} de 100`}>
          <span className="habitat__mood-title">
            <PixelIcon name="heart" size={14} /> Humor: <strong>{moodLabel(mood, mode)}</strong>
          </span>
          <span className="habitat__mood-track">
            <span style={{ width: `${mood}%` }} />
          </span>
        </div>

        <div className="habitat__tray" aria-label="Itens">
          {Object.entries(ITEMS).map(([kind, item]) => (
            <button
              key={kind}
              type="button"
              className="habitat__item-btn"
              onPointerDown={(e) => onItemPointerDown(e, kind)}
              onPointerMove={onItemPointerMove}
              onPointerUp={onItemPointerUp}
              onPointerCancel={() => setDrag(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  dropNear(kind)
                }
              }}
              title={`Arraste a ${item.label.toLowerCase()} até o diorama ou clique para soltar perto`}
            >
              <PixelArt grid={item.grid} palette={item.palette} size={22} />
              {item.label}
            </button>
          ))}
          <button type="button" className={`px-btn px-btn--small ${follow ? 'px-btn--saffron' : ''}`} aria-pressed={follow} onClick={() => setFollow((f) => !f)}>
            <PixelIcon name="pin" size={14} /> Seguir cursor
          </button>
          <button type="button" className="px-btn px-btn--small" onClick={callHome}>
            <PixelIcon name="chat" size={14} /> Chamar
          </button>
        </div>

        <p className="habitat__tips">
          Clique no Pokémon para fazer carinho · clique num bloco para ele andar · arraste a fruta ou a bola até o cenário
          {habitat.liquid ? ` · só Pokémon do tipo certo entram na ${habitat.liquid.label}` : ''}
        </p>
      </div>

      {drag?.active && (
        <span className="habitat__ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <PixelArt grid={ITEMS[drag.kind].grid} palette={ITEMS[drag.kind].palette} size={32} />
        </span>
      )}
    </div>
  )
}
