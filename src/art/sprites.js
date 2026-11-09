// Sprites originais em pixel art, descritos como grades de caracteres.
// Cada caractere aponta para uma cor da paleta passada junto com a grade.

export const INK = '#2a1d24'

// Personagem visto de frente (12x17). h = cabelo/boné, b = aba/franja, c/d = roupa.
export const PERSON = [
  '....kkkk....',
  '..kkhhhhkk..',
  '.khhhhhhhhk.',
  '.khhhhhhhhk.',
  '.kbbbbbbbbk.',
  '.kssssssssk.',
  '.kskssssksk.',
  '.kssssssssk.',
  '..kksssskk..',
  '.kcccccccck.',
  'ksccddddccsk',
  'ksccccccccsk',
  '.kkppppppkk.',
  '..kppkkppk..',
  '..kpk..kpk..',
  '..kok..kok..',
  '..kkk..kkk..',
]

export function personPalette({ hair, brim = hair, skin = '#f5c9a0', shirt, detail = shirt, pants, shoes = '#3a2a2a' }) {
  return { k: INK, h: hair, b: brim, s: skin, c: shirt, d: detail, p: pants, o: shoes }
}

// Árvore vista de cima (16x16).
export const TREE = [
  '.....kkkkkk.....',
  '...kkllggggkk...',
  '..kllgggggggdk..',
  '.kllggggggggddk.',
  '.klgggggggggddk.',
  'klggggggggggddgk',
  'kgggggggggggddgk',
  'kggdggggggggdddk',
  '.kgddggggggdddk.',
  '.kggdddggdddddk.',
  '..kkdddddddddkk.',
  '....kkkttkkk....',
  '......kttk......',
  '......kttk......',
  '.....kkttkk.....',
  '................',
]

export const TREE_PALETTE = { k: '#173d2a', l: '#7fd36a', g: '#3fa34d', d: '#21703a', t: '#6b4226' }
export const TREE_PALETTE_TEAL = { k: '#0b2f30', l: '#3fd0b8', g: '#009698', d: '#006a6c', t: '#5a3a22' }
export const TREE_PALETTE_NIGHT = { k: '#061a1e', l: '#2f8f7a', g: '#14605a', d: '#0b3d40', t: '#2e2018' }

// Pinheiro (8x13) usado nas silhuetas da tela inicial.
export const PINE = [
  '...gg...',
  '...gg...',
  '..gggg..',
  '..gggg..',
  '.gggggg.',
  '..gggg..',
  '.gggggg.',
  'gggggggg',
  '.gggggg.',
  'gggggggg',
  'gggggggg',
  '...tt...',
  '...tt...',
]

export const CLOUD = [
  '........wwww............',
  '......wwwwwwww..wwww....',
  '...wwwwwwwwwwwwwwwwwww..',
  '.wwwwwwwwwwwwwwwwwwwwwww',
  'wwwwwwwwwwwwwwwwwwwwwwww',
  '.ssssssssssssssssssssss.',
]

export const ROCK = [
  '....kkkk....',
  '..kkllllkk..',
  '.kllllllddk.',
  'kllllllldddk',
  'kllllldddddk',
  'kllldddddddk',
  '.kkkkkkkkkk.',
]

export const ROCK_PALETTE = { k: '#5c5648', l: '#e9e5da', d: '#9b9584' }

// Lua cheia gerada por código: círculo com sombra, brilho e crateras.
export const MOON = (() => {
  const size = 16
  const r = 7.6
  const craters = [
    [5, 5, 1.6],
    [10, 9, 2.1],
    [5, 11, 1.2],
    [11, 4, 1],
  ]
  const rows = []
  for (let y = 0; y < size; y++) {
    let row = ''
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - size / 2
      const dy = y + 0.5 - size / 2
      const d = Math.hypot(dx, dy)
      if (d > r) {
        row += '.'
      } else if (craters.some(([cx, cy, cr]) => Math.hypot(x - cx, y - cy) <= cr)) {
        row += 'c'
      } else if (d > r - 1.4 && dx + dy > 2) {
        row += 'd'
      } else if (d < r - 2 && dx + dy < -6) {
        row += 'l'
      } else {
        row += 'y'
      }
    }
    rows.push(row)
  }
  return rows
})()

export const MOON_PALETTE = { y: '#f4c430', l: '#fbe08a', d: '#c48f10', c: '#dba91f' }
