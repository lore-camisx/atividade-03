// Converte uma grade de caracteres em retângulos, juntando pixels vizinhos da mesma cor
// em uma única faixa horizontal (menos elementos no SVG).
export function gridToRuns(grid, palette) {
  const runs = []
  grid.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const char = row[x]
      const color = palette[char]
      if (!color) {
        x += 1
        continue
      }
      let width = 1
      while (row[x + width] === char) width += 1
      runs.push({ x, y, width, color })
      x += width
    }
  })
  return runs
}

// Gerador pseudoaleatório com semente: o mapa sai igual em toda renderização.
export function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

export function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}
