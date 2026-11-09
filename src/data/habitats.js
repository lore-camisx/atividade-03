// Habitats do diorama isométrico: um por tipo principal do Pokémon.
// Todos usam o mesmo relevo (fundo alto, frente baixa); mudam cores, decoração, líquido e clima.

export const GRID = 7

// Altura de cada bloco (linha j, coluna i). O fundo é mais alto, como degraus.
export const HEIGHTS = [
  [3, 3, 3, 2, 2, 2, 2],
  [3, 3, 3, 2, 2, 2, 2],
  [3, 3, 3, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 1, 1],
  [2, 2, 2, 2, 1, 1, 1],
  [2, 2, 2, 2, 1, 1, 1],
  [2, 2, 2, 2, 1, 1, 1],
]

// Região do "lago" (água, lava, gelo...) na parte baixa da direita.
export const LIQUID_TILES = [
  [4, 3],
  [5, 3],
  [6, 3],
  [4, 4],
  [5, 4],
  [6, 4],
  [5, 5],
  [6, 5],
]

export const START_TILE = { i: 2, j: 4 }

// Decoração usada por vários habitats (posições na grade).
const d = (kind, i, j, color) => ({ kind, i, j, color })

export const HABITATS = {
  Normal: {
    name: 'Quintal',
    top: '#a8d878',
    left: '#7a9a52',
    right: '#5f7f3f',
    sky: '#f4efe0',
    decor: [d('tree', 1, 1, '#7fd36a'), d('fence', 0, 3), d('fence', 1, 3), d('bush', 6, 0, '#5fae4a'), d('flower', 3, 6, '#f4c430'), d('flower', 5, 6, '#f49ac1'), d('rock', 6, 6, '#ccc7b9')],
    weather: 'petals',
    particle: '#fffaf0',
  },
  Fire: {
    name: 'Vulcão adormecido',
    top: '#7a5248',
    left: '#553630',
    right: '#3f2622',
    sky: '#f6e2d2',
    liquid: { color: '#f08030', shine: '#f8d030', walk: ['Fire'], label: 'lava' },
    decor: [d('rock', 1, 1, '#5a4040'), d('crystal', 0, 2, '#f8d030'), d('rock', 2, 0, '#6b4a4a'), d('crystal', 6, 6, '#f08030'), d('rock', 0, 6, '#5a4040')],
    weather: 'embers',
    particle: '#f8a030',
  },
  Water: {
    name: 'Lago cristalino',
    top: '#92d36e',
    left: '#4f9a82',
    right: '#357a66',
    sky: '#e6f5fb',
    liquid: { color: '#00aaee', shine: '#c8eeff', walk: ['Water'], label: 'água' },
    decor: [d('tree', 1, 1, '#5fc49a'), d('rock', 0, 3, '#ccc7b9'), d('lily', 5, 4), d('flower', 2, 6, '#00aaee'), d('rock', 6, 6, '#9b9584'), d('bush', 3, 0, '#4fae6a')],
    weather: 'bubbles',
    particle: '#7fd0f5',
  },
  Grass: {
    name: 'Bosque florido',
    top: '#9ad47a',
    left: '#5d9b5a',
    right: '#467c44',
    sky: '#f7efe8',
    decor: [d('tree', 1, 1, '#f4a6c0'), d('tree', 5, 4, '#f7b8cf'), d('bush', 0, 4, '#5fae4a'), d('flower', 3, 6, '#f49ac1'), d('flower', 6, 6, '#fffaf0'), d('flower', 2, 0, '#f49ac1'), d('bush', 6, 1, '#6cc24a')],
    weather: 'petals',
    particle: '#f7b8cf',
  },
  Electric: {
    name: 'Usina da cidade',
    top: '#8fd0c4',
    left: '#4f9aa0',
    right: '#357a82',
    sky: '#f2f4ee',
    decor: [d('pole', 0, 0), d('box', 2, 1), d('tree', 5, 1, '#f4a6c0'), d('bush', 0, 5, '#5fae4a'), d('box', 6, 5), d('bush', 4, 6, '#6cc24a')],
    weather: 'sparks',
    particle: '#f8d030',
  },
  Ice: {
    name: 'Geleira',
    top: '#f2f8ff',
    left: '#a8c8e8',
    right: '#86aacd',
    sky: '#eaf4fb',
    liquid: { color: '#bfe9fb', shine: '#ffffff', walk: ['*'], label: 'gelo' },
    decor: [d('pine', 1, 1, '#e9f4ff'), d('crystal', 0, 3, '#98d8f8'), d('pine', 3, 0, '#d2e8f8'), d('crystal', 6, 6, '#bfe9fb'), d('rock', 1, 6, '#e9e5da')],
    weather: 'snow',
    particle: '#ffffff',
  },
  Fighting: {
    name: 'Dojô',
    top: '#d8a46a',
    left: '#9a6a3a',
    right: '#7a4f2a',
    sky: '#f5ece0',
    decor: [d('post', 1, 1), d('post', 6, 4), d('fence', 0, 3), d('fence', 1, 3), d('fence', 2, 3), d('bush', 6, 0, '#5fae4a'), d('rock', 0, 6, '#ccc7b9')],
    weather: null,
  },
  Poison: {
    name: 'Pântano tóxico',
    top: '#8a9a5a',
    left: '#5a6a3a',
    right: '#46532c',
    sky: '#efe8f2',
    liquid: { color: '#a040a0', shine: '#d890e0', walk: ['Poison'], label: 'lodo' },
    decor: [d('mushroom', 1, 1, '#a040a0'), d('mushroom', 2, 0, '#d9381e'), d('bush', 0, 4, '#5a7a3a'), d('mushroom', 6, 6, '#a040a0'), d('rock', 0, 6, '#6a5a6a')],
    weather: 'bubbles',
    particle: '#c070c8',
  },
  Ground: {
    name: 'Deserto',
    top: '#ecd08a',
    left: '#c0a058',
    right: '#9a7e40',
    sky: '#fbf2df',
    decor: [d('cactus', 1, 1), d('rock', 2, 0, '#b89a6a'), d('cactus', 6, 4), d('rock', 0, 5, '#c9a878'), d('rock', 5, 6, '#a88a5a')],
    weather: 'dust',
    particle: '#d8b878',
  },
  Flying: {
    name: 'Ilha nas nuvens',
    top: '#b4e08a',
    left: '#8ab0c8',
    right: '#6a90aa',
    sky: '#e4f4fd',
    decor: [d('tree', 1, 1, '#7fd36a'), d('cloud', 5, 3), d('cloud', 0, 5), d('flower', 3, 6, '#fffaf0'), d('bush', 6, 0, '#7fd36a')],
    weather: 'feathers',
    particle: '#fffaf0',
  },
  Psychic: {
    name: 'Templo psíquico',
    top: '#f2c4dc',
    left: '#b77a9e',
    right: '#955c80',
    sky: '#f8eef4',
    decor: [d('pillar', 0, 0, '#e9e5da'), d('pillar', 2, 0, '#e9e5da'), d('crystal', 1, 1, '#c080f0'), d('crystal', 6, 5, '#f85888'), d('flower', 4, 6, '#c080f0'), d('pillar', 0, 6, '#e9e5da')],
    weather: 'sparkles',
    particle: '#f85888',
  },
  Bug: {
    name: 'Floresta densa',
    top: '#7cbb5a',
    left: '#4f8a3a',
    right: '#3a6b2a',
    sky: '#eef4e4',
    decor: [d('pine', 1, 1, '#3f8f4a'), d('pine', 0, 3, '#2f7a3a'), d('mushroom', 2, 0, '#f08030'), d('bush', 5, 3, '#5fae4a'), d('mushroom', 6, 6, '#d9381e'), d('tree', 4, 0, '#6cc24a')],
    weather: 'leaves',
    particle: '#8fd16b',
  },
  Rock: {
    name: 'Montanha',
    top: '#c9c3b4',
    left: '#8f897a',
    right: '#726c5e',
    sky: '#f1efe8',
    decor: [d('rock', 1, 1, '#9b9584'), d('rock', 0, 2, '#b3ad9d'), d('pine', 2, 0, '#4f8a5a'), d('crystal', 6, 4, '#b8a038'), d('rock', 5, 6, '#9b9584'), d('rock', 0, 6, '#b3ad9d')],
    weather: 'dust',
    particle: '#b3ad9d',
  },
  Ghost: {
    name: 'Cemitério antigo',
    top: '#5a4a7a',
    left: '#3a2e55',
    right: '#2a2142',
    sky: '#1d1a33',
    night: true,
    decor: [d('tomb', 1, 1), d('tomb', 2, 0), d('tree', 0, 3, '#705898'), d('tomb', 6, 4), d('tomb', 5, 6), d('mushroom', 0, 6, '#a040a0')],
    weather: 'wisps',
    particle: '#b8a0f8',
  },
  Dragon: {
    name: 'Ruínas dracônicas',
    top: '#8a8aa8',
    left: '#5a5a7a',
    right: '#44445e',
    sky: '#ecebf4',
    liquid: { color: '#7038f8', shine: '#b8a0f8', walk: ['Dragon'], label: 'energia' },
    decor: [d('pillar', 0, 0, '#b8b8d0'), d('pillar', 2, 1, '#b8b8d0'), d('crystal', 1, 0, '#7038f8'), d('rock', 0, 5, '#6a6a88'), d('pillar', 3, 6, '#b8b8d0')],
    weather: 'sparkles',
    particle: '#b8a0f8',
  },
  Steel: {
    name: 'Fábrica',
    top: '#c8c8dc',
    left: '#8a8aa2',
    right: '#6c6c84',
    sky: '#eef0f4',
    decor: [d('box', 1, 1), d('pole', 2, 0), d('pillar', 0, 3, '#9a9ab4'), d('box', 6, 4), d('box', 5, 6), d('pillar', 0, 6, '#9a9ab4')],
    weather: 'sparks',
    particle: '#ffffff',
  },
  Typeless: {
    name: 'Tela em branco',
    top: '#f4f0f4',
    left: '#c8c0d0',
    right: '#aaa2b4',
    sky: '#fbf8fb',
    checker: true,
    decor: [d('crystal', 1, 1, '#f49ac1'), d('crystal', 6, 5, '#00aaee'), d('cloud', 0, 5)],
    weather: 'sparkles',
    particle: '#f49ac1',
  },
}

export function habitatFor(pokemon) {
  return HABITATS[pokemon.types[0].name] ?? HABITATS.Typeless
}

// Decorações que não bloqueiam a passagem.
export const PASSABLE_DECOR = new Set(['flower', 'lily', 'cloud'])

export const PHRASES = {
  pet: ['Hehe!', '♪♪', 'Mais carinho!', 'Que gostoso!', '♥', 'Yay!'],
  greet: ['Oi!', 'Olá, treinador!', '!', 'Vamos brincar?'],
  eat: ['Nham nham!', 'Delícia!', 'Mais uma?', 'Que fruta boa!'],
  play: ['Peguei!', 'De novo!', 'Wheee!', 'Joga mais!'],
  dizzy: ['Calma aí!', '@_@', 'Tô tonto...'],
  wake: ['Hã?!', 'Acordei!', '...bom dia?'],
  blocked: ['Não consigo ir até lá...', 'Hmm, caminho bloqueado.'],
}
