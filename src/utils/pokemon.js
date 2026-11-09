// Utilitários compartilhados pela Pokédex: sprites, cores de tipo e atributos.

const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

// Sprites oficiais em pixel art hospedados pelo projeto PokéAPI.
export function spriteUrl(id, { shiny = false, back = false } = {}) {
  const parts = [SPRITE_BASE]
  if (back) parts.push('back')
  if (shiny) parts.push('shiny')
  return `${parts.join('/')}/${id}.png`
}

export function formatId(id) {
  return `#${String(id).padStart(3, '0')}`
}

export const STATS = [
  { key: 'hp', label: 'HP', short: 'HP', icon: 'heart' },
  { key: 'attack', label: 'Ataque', short: 'ATK', icon: 'sword' },
  { key: 'defense', label: 'Defesa', short: 'DEF', icon: 'shield' },
  { key: 'specialAttack', label: 'Atq. Especial', short: 'SP.ATK', icon: 'spark' },
  { key: 'specialDefense', label: 'Def. Especial', short: 'SP.DEF', icon: 'gem' },
  { key: 'speed', label: 'Velocidade', short: 'SPD', icon: 'boot' },
]

// Valor máximo possível de um atributo base, usado para escalar as barras.
export const STAT_MAX = 255

export function totalStats(pokemon) {
  return STATS.reduce((sum, s) => sum + pokemon.stats[s.key], 0)
}

export const TYPE_COLORS = {
  Typeless: '#9e9e9e',
  Normal: '#b8b48a',
  Fire: '#f08030',
  Water: '#5d8ef0',
  Grass: '#6cc24a',
  Electric: '#f8d030',
  Ice: '#98d8d8',
  Fighting: '#c03028',
  Poison: '#a040a0',
  Ground: '#e0c068',
  Flying: '#a890f0',
  Psychic: '#f85888',
  Bug: '#a8b820',
  Rock: '#b8a038',
  Ghost: '#705898',
  Dark: '#705848',
  Dragon: '#7038f8',
  Steel: '#b8b8d0',
}

export const TYPE_LABELS = {
  Typeless: 'Sem tipo',
  Normal: 'Normal',
  Fire: 'Fogo',
  Water: 'Água',
  Grass: 'Planta',
  Electric: 'Elétrico',
  Ice: 'Gelo',
  Fighting: 'Lutador',
  Poison: 'Veneno',
  Ground: 'Terra',
  Flying: 'Voador',
  Psychic: 'Psíquico',
  Bug: 'Inseto',
  Rock: 'Pedra',
  Ghost: 'Fantasma',
  Dark: 'Sombrio',
  Dragon: 'Dragão',
  Steel: 'Aço',
}

export function typeColor(name) {
  return TYPE_COLORS[name] ?? TYPE_COLORS.Typeless
}

// Escolhe tinta clara ou escura conforme a luminância da cor do tipo.
export function typeInk(name) {
  const hex = typeColor(name).slice(1)
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1b1b2f' : '#fffaf0'
}

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

// Pesquisa por nome (parcial, sem acentos) ou por ID (com ou sem "#").
export function matchesQuery(pokemon, query) {
  const q = normalize(query).replace(/^#/, '')
  if (!q) return true
  if (/^\d+$/.test(q)) {
    return String(pokemon.id) === String(Number(q)) || formatId(pokemon.id).includes(q)
  }
  return normalize(pokemon.name).includes(q)
}

export const SORT_OPTIONS = [
  { value: 'id', label: 'Nº' },
  { value: 'name', label: 'Nome' },
  ...STATS.map((s) => ({ value: s.key, label: s.short })),
  { value: 'total', label: 'Total' },
]

export function sortValue(pokemon, key) {
  if (key === 'id') return pokemon.id
  if (key === 'name') return pokemon.name
  if (key === 'total') return totalStats(pokemon)
  return pokemon.stats[key]
}

// Aplica pesquisa e filtro de tipo, depois ordena (estado derivado da Pokédex).
export function filterAndSort(list, { query = '', type = '', sortKey = 'id', sortDir = 'asc' }) {
  const direction = sortDir === 'asc' ? 1 : -1
  return list
    .filter((p) => matchesQuery(p, query))
    .filter((p) => !type || p.types.some((t) => t.name === type))
    .sort((a, b) => {
      const va = sortValue(a, sortKey)
      const vb = sortValue(b, sortKey)
      const diff = typeof va === 'string' ? va.localeCompare(vb) : va - vb
      return (diff || a.id - b.id) * direction
    })
}
