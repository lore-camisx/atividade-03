import { GRID, HEIGHTS, LIQUID_TILES, PASSABLE_DECOR } from '../../data/habitats'

// Projeção isométrica 2:1 — cada bloco tem 32x16 px no topo e 8 px por nível de altura.
export const TILE_W = 32
export const TILE_H = 16
export const LEVEL = 8
export const ORIGIN = { x: 128, y: 82 }
export const VIEW = { w: 256, h: 200 }

const LIQUID = new Set(LIQUID_TILES.map(([i, j]) => `${i},${j}`))

export function isLiquid(i, j) {
  return LIQUID.has(`${i},${j}`)
}

export function heightAt(i, j) {
  return HEIGHTS[j]?.[i] ?? 0
}

// Centro do topo de um bloco (aceita coordenadas fracionárias para o Pokémon andando).
export function project(i, j, h = heightAt(Math.round(i), Math.round(j))) {
  return {
    x: ORIGIN.x + (i - j) * (TILE_W / 2),
    y: ORIGIN.y + (i + j) * (TILE_H / 2) - h * LEVEL,
  }
}

// Qual bloco está sob um ponto do SVG: testa os topos da frente para trás.
export function tileAt(x, y) {
  const tiles = []
  for (let j = 0; j < GRID; j++) for (let i = 0; i < GRID; i++) tiles.push({ i, j })
  tiles.sort((a, b) => b.i + b.j - (a.i + a.j))
  return (
    tiles.find(({ i, j }) => {
      const c = project(i, j)
      return Math.abs(x - c.x) / (TILE_W / 2) + Math.abs(y - c.y) / (TILE_H / 2) <= 1
    }) ?? null
  )
}

export function walkable(i, j, habitat, pokemonTypes, items = []) {
  if (i < 0 || j < 0 || i >= GRID || j >= GRID) return false
  if (habitat.decor.some((dec) => dec.i === i && dec.j === j && !PASSABLE_DECOR.has(dec.kind))) return false
  if (isLiquid(i, j) && habitat.liquid) {
    const walk = habitat.liquid.walk
    if (!walk.includes('*') && !pokemonTypes.some((t) => walk.includes(t))) return false
  }
  return !items.some((it) => it.blocking && it.i === i && it.j === j)
}

// Busca em largura: menor caminho de bloco em bloco (sem diagonais, degraus de no máximo 1 nível).
export function findPath(from, to, canWalk) {
  const key = (p) => `${p.i},${p.j}`
  if (!canWalk(to.i, to.j)) return null
  const queue = [from]
  const cameFrom = new Map([[key(from), null]])
  while (queue.length) {
    const current = queue.shift()
    if (current.i === to.i && current.j === to.j) {
      const path = []
      let step = current
      while (step && key(step) !== key(from)) {
        path.unshift(step)
        step = cameFrom.get(key(step))
      }
      return path
    }
    for (const [di, dj] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const next = { i: current.i + di, j: current.j + dj }
      if (cameFrom.has(key(next)) || !canWalk(next.i, next.j)) continue
      if (Math.abs(heightAt(next.i, next.j) - heightAt(current.i, current.j)) > 1) continue
      cameFrom.set(key(next), current)
      queue.push(next)
    }
  }
  return null
}
