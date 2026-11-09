import { POKEMON_BY_ID, TRAINERS } from './index'
import { DISTRICTS } from './world'

export const MAP_W = 480
export const MAP_H = 320

// Ruas: uma avenida horizontal e duas verticais dividindo os bairros.
export const ROADS = [
  { x: 0, y: 144, w: MAP_W, h: 32 },
  { x: 152, y: 0, w: 24, h: MAP_H },
  { x: 304, y: 0, w: 24, h: MAP_H },
]

export const ZONES = {
  viridian: { x: 0, y: 0, w: 152, h: 144 },
  saffron: { x: 176, y: 0, w: 128, h: 144 },
  cerulean: { x: 328, y: 0, w: 152, h: 144 },
  pewter: { x: 0, y: 176, w: 152, h: 144 },
  center: { x: 176, y: 176, w: 128, h: 144 },
  vermillion: { x: 328, y: 176, w: 152, h: 144 },
}

export const LAKE = { x: 404, y: 0, w: 76, h: 104 }
export const SEA = { x: 328, y: 270, w: 152, h: 50 }
export const GARDEN = { x: 180, y: 252, w: 120, h: 64 }

export const GYMS = [
  { district: 'viridian', leaderId: 9, x: 28, y: 34, w: 72, h: 52, color: '#009698', dark: '#006a6c' },
  { district: 'saffron', leaderId: 7, x: 196, y: 18, w: 88, h: 60, color: '#f4c430', dark: '#c48f10' },
  { district: 'cerulean', leaderId: 3, x: 340, y: 26, w: 56, h: 50, color: '#00aaee', dark: '#0a6fb0' },
  { district: 'pewter', leaderId: 2, x: 28, y: 194, w: 72, h: 52, color: '#ccc7b9', dark: '#9b9584' },
  { district: 'vermillion', leaderId: 4, x: 346, y: 186, w: 64, h: 48, color: '#d9381e', dark: '#9c2512' },
]

const GYM_SPECIALTY = {
  viridian: 'Pokémon de terra',
  saffron: 'Pokémon psíquicos',
  cerulean: 'Pokémon de água',
  pewter: 'Pokémon de pedra',
  vermillion: 'Pokémon elétricos',
}

// Postes de luz (base do poste), acesos no modo noturno.
export const LAMPS = [
  { x: 100, y: 140 },
  { x: 292, y: 140 },
  { x: 470, y: 140 },
  { x: 100, y: 194 },
  { x: 240, y: 186 },
  { x: 300, y: 196 },
  { x: 470, y: 194 },
]

export const BUILDINGS = {
  center: { x: 184, y: 186, w: 56, h: 44 },
  mart: { x: 250, y: 190, w: 46, h: 40 },
  fountain: { x: 224, y: 104, w: 32, h: 22 },
  boat: { x: 376, y: 276, w: 48, h: 19 },
}

const TRAINER_SPOTS = {
  1: { x: 194, y: 233, district: 'center' },
  2: { x: 58, y: 250, district: 'pewter' },
  3: { x: 386, y: 84, district: 'cerulean' },
  4: { x: 372, y: 240, district: 'vermillion' },
  5: { x: 232, y: 282, district: 'center' },
  6: { x: 118, y: 98, district: 'viridian' },
  7: { x: 234, y: 82, district: 'saffron' },
  8: { x: 446, y: 236, district: 'vermillion' },
  9: { x: 58, y: 90, district: 'viridian' },
  10: { x: 226, y: 233, district: 'center' },
  11: { x: 14, y: 118, district: 'viridian' },
  12: { x: 280, y: 100, district: 'saffron' },
}

const WILD = [
  { id: 25, x: 418, y: 196, district: 'vermillion', line: 'Pika pika! Ele parece cheio de energia elétrica.' },
  { id: 54, x: 412, y: 104, district: 'cerulean', line: 'Psy...? Ele está com dor de cabeça de novo.' },
  { id: 120, x: 436, y: 30, district: 'cerulean', line: 'O Staryu brilha como uma joia no meio do lago.' },
  { id: 74, x: 108, y: 208, district: 'pewter', line: 'Um Geodude rolou pra fora das pedras!' },
  { id: 43, x: 262, y: 274, district: 'center', line: 'Um Oddish se esconde no meio das flores.' },
  { id: 10, x: 84, y: 112, district: 'viridian', line: 'Um Caterpie mastigando folhas do bosque.' },
  { id: 131, x: 336, y: 282, district: 'vermillion', line: 'Um Lapras nadando perto do cais. Que sorte!' },
  { id: 143, x: 300, y: 2, district: 'saffron', line: 'Zzz... um Snorlax dormindo bem no meio da estrada.' },
  { id: 133, x: 232, y: 140, district: 'saffron', line: 'Um Eevee curioso farejando a praça.' },
  { id: 129, x: 438, y: 288, district: 'vermillion', line: 'Splash! Splash! ...mas nada acontece.' },
  // Só aparecem no modo noturno
  { id: 92, x: 108, y: 16, district: 'viridian', night: true, line: 'Ele surgiu da escuridão do bosque. Só aparece à noite!' },
  { id: 41, x: 112, y: 262, district: 'pewter', night: true, line: 'Um Zubat saiu voando das pedras. Ele detesta a luz do dia.' },
]

const SIGNS = [
  { district: 'viridian', x: 134, y: 126 },
  { district: 'saffron', x: 180, y: 126 },
  { district: 'cerulean', x: 334, y: 126 },
  { district: 'pewter', x: 134, y: 180 },
  { district: 'vermillion', x: 334, y: 180 },
]

function trainerName(id) {
  return TRAINERS.find((t) => t.id === id)?.name
}

// Lista única de tudo que é clicável no mapa.
export const PLACES = [
  ...GYMS.map((gym) => ({
    id: `gym-${gym.district}`,
    kind: 'gym',
    name: `Ginásio de ${DISTRICTS[gym.district].name}`,
    district: gym.district,
    leaderId: gym.leaderId,
    x: gym.x,
    y: gym.y,
    w: gym.w,
    h: gym.h,
    lines: [
      `Ginásio de ${DISTRICTS[gym.district].name}.`,
      `Especialidade: ${GYM_SPECIALTY[gym.district]}. Líder: ${trainerName(gym.leaderId)}.`,
      'O líder está esperando na porta. Fale com ele!',
    ],
  })),
  {
    id: 'center',
    kind: 'building',
    name: 'Centro Pokémon',
    district: 'center',
    npc: 'nurse',
    speaker: 'Enfermeira',
    action: 'heal',
    ...BUILDINGS.center,
    lines: ['Bem-vindo ao Centro Pokémon!', 'Vamos cuidar dos seus Pokémon. Só um instante...'],
    nightLines: ['Boa noite! O Centro Pokémon funciona 24 horas.', 'Vamos cuidar dos seus Pokémon. Só um instante...'],
  },
  {
    id: 'mart',
    kind: 'building',
    name: 'Loja Pokémon',
    district: 'center',
    npc: 'clerk',
    speaker: 'Vendedor',
    ...BUILDINGS.mart,
    lines: ['Olá! Bem-vindo à Loja Pokémon.', 'Hoje temos poções, antídotos e... as Pokébolas esgotaram. Desculpe!'],
    nightLines: ['Zzz... ah! Desculpe, já estávamos fechando.', 'Volte amanhã cedo: chega um carregamento novo de Pokébolas!'],
  },
  {
    id: 'fountain',
    kind: 'object',
    name: 'Fonte da Praça',
    district: 'saffron',
    ...BUILDINGS.fountain,
    lines: ['Uma fonte de pedra com água cristalina.', 'Dizem que quem joga uma moeda aqui encontra um Pokémon raro.'],
    nightLines: ['A lua se reflete na água da fonte.', 'Dizem que, à noite, Pokémon fantasmas vêm beber água aqui...'],
  },
  {
    id: 'boat',
    kind: 'object',
    name: 'Navio S.S. Pixel',
    district: 'vermillion',
    npc: 'sailor',
    speaker: 'Marinheiro',
    ...BUILDINGS.boat,
    lines: ['Ahoy! Este é o S.S. Pixel.', 'Zarpamos quando a Pokédex estiver completa. Ainda faltam alguns!'],
  },
  ...SIGNS.map((sign) => ({
    id: `sign-${sign.district}`,
    kind: 'sign',
    name: `Placa de ${DISTRICTS[sign.district].name}`,
    district: sign.district,
    x: sign.x,
    y: sign.y,
    w: 12,
    h: 14,
    lines: [`Bairro ${DISTRICTS[sign.district].name}.`, DISTRICTS[sign.district].blurb],
  })),
  ...TRAINERS.map((trainer) => ({
    id: `trainer-${trainer.id}`,
    kind: 'trainer',
    trainerId: trainer.id,
    name: trainer.name,
    w: 12,
    h: 17,
    ...TRAINER_SPOTS[trainer.id],
  })),
  ...WILD.filter((w) => POKEMON_BY_ID.has(w.id)).map((wild) => ({
    id: `wild-${wild.id}`,
    kind: 'wild',
    pokemonId: wild.id,
    name: POKEMON_BY_ID.get(wild.id).name,
    district: wild.district,
    x: wild.x,
    y: wild.y,
    w: 32,
    h: 32,
    nightOnly: Boolean(wild.night),
    lines: [`Um ${POKEMON_BY_ID.get(wild.id).name} selvagem apareceu!`, wild.line],
  })),
]

export const PLACE_BY_ID = new Map(PLACES.map((p) => [p.id, p]))
