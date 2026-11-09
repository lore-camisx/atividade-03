// Peças de cenário do mapa da cidade, desenhadas com retângulos em "pixels de mapa".
import { INK } from '../../art/sprites'

// Retângulo com contorno de 1 pixel.
export function Box({ x, y, w, h, fill, line = INK }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={line} />
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill={fill} />
    </>
  )
}

function Shadow({ x, y, w, h }) {
  return <rect x={x + 3} y={y + 3} width={w} height={h} fill="rgba(20, 20, 40, 0.22)" />
}

// Janela acesa (modo noturno): vidro amarelo com um halo em volta.
function LitWindow({ x, y, w = 8, h = 6 }) {
  return (
    <>
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} fill="#f4c430" opacity="0.3" />
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill="#fbe08a" />
    </>
  )
}

function Window({ x, y, w = 8, h = 6 }) {
  return (
    <>
      <Box x={x} y={y} w={w} h={h} fill="#7fd0f5" />
      <rect x={x + 1} y={y + 1} width={w - 2} height={2} fill="#c8eeff" />
    </>
  )
}

function Door({ x, y, w = 10, h = 12, fill = '#4a3a4a' }) {
  return (
    <>
      <Box x={x} y={y} w={w} h={h} fill={fill} />
      <rect x={x + 2} y={y + 2} width={w - 4} height={h - 6} fill="#7fd0f5" opacity="0.6" />
      <rect x={x - 2} y={y + h} width={w + 4} height={2} fill="#9b9584" />
    </>
  )
}

// Telhado listrado: faixas horizontais escuras a cada 4 pixels.
function Roof({ x, y, w, h, color, dark }) {
  const stripes = []
  for (let sy = y + 4; sy < y + h - 2; sy += 4) {
    stripes.push(<rect key={sy} x={x + 1} y={sy} width={w - 2} height={1} fill={dark} />)
  }
  return (
    <>
      <Box x={x} y={y} w={w} h={h} fill={color} />
      {stripes}
      <rect x={x + 1} y={y + 1} width={w - 2} height={2} fill="rgba(255, 255, 255, 0.35)" />
    </>
  )
}

export function Gym({ x, y, w, h, color, dark, lit }) {
  const roofH = Math.round(h * 0.5)
  const wallY = y + roofH - 2
  const wallH = h - roofH + 2
  const doorX = x + Math.round(w / 2) - 6
  if (lit) {
    return (
      <>
        <LitWindow x={x + 6} y={wallY + 5} />
        <LitWindow x={x + w - 14} y={wallY + 5} />
        <LitWindow x={doorX} y={y + h - 13} w={12} h={10} />
      </>
    )
  }
  return (
    <>
      <Shadow x={x} y={y} w={w} h={h} />
      <Box x={x + 2} y={wallY} w={w - 4} h={wallH} fill="#f7f1e3" />
      <rect x={x + 3} y={wallY + wallH - 4} width={w - 6} height={3} fill="#ddd1b4" />
      <Window x={x + 6} y={wallY + 5} />
      <Window x={x + w - 14} y={wallY + 5} />
      <Door x={doorX} y={y + h - 13} w={12} h={12} />
      <Roof x={x - 2} y={y} w={w + 4} h={roofH} color={color} dark={dark} />
      {/* Placa com a cor do bairro sobre a porta */}
      <Box x={doorX - 4} y={wallY + 2} w={20} h={6} fill={color} />
      <rect x={doorX + 1} y={wallY + 4} width={10} height={2} fill="#fffaf0" />
    </>
  )
}

export function PokeCenter({ x, y, w, h, lit }) {
  const roofH = 20
  if (lit) {
    return (
      <>
        <LitWindow x={x + 6} y={y + roofH + 4} w={10} />
        <LitWindow x={x + w - 16} y={y + roofH + 4} w={10} />
        <LitWindow x={x + w / 2 - 6} y={y + h - 13} w={12} h={10} />
        <circle cx={x + w / 2} cy={y + 10} r="11" fill="#d9381e" opacity="0.35" />
      </>
    )
  }
  return (
    <>
      <Shadow x={x} y={y} w={w} h={h} />
      <Box x={x + 2} y={y + roofH - 2} w={w - 4} h={h - roofH + 2} fill="#fffaf0" />
      <Window x={x + 6} y={y + roofH + 4} w={10} />
      <Window x={x + w - 16} y={y + roofH + 4} w={10} />
      <Door x={x + w / 2 - 6} y={y + h - 13} w={12} h={12} fill="#7fd0f5" />
      <Roof x={x - 2} y={y} w={w + 4} h={roofH} color="#d9381e" dark="#9c2512" />
      {/* Emblema: círculo meio vermelho, meio branco */}
      <rect x={x + w / 2 - 5} y={y + 4} width={10} height={12} fill={INK} />
      <rect x={x + w / 2 - 6} y={y + 6} width={12} height={8} fill={INK} />
      <rect x={x + w / 2 - 4} y={y + 5} width={8} height={4} fill="#d9381e" />
      <rect x={x + w / 2 - 5} y={y + 7} width={10} height={2} fill="#d9381e" />
      <rect x={x + w / 2 - 5} y={y + 10} width={10} height={3} fill="#fffaf0" />
      <rect x={x + w / 2 - 4} y={y + 13} width={8} height={2} fill="#fffaf0" />
      <rect x={x + w / 2 - 1} y={y + 8} width={2} height={3} fill="#fffaf0" />
    </>
  )
}

export function Mart({ x, y, w, h, lit }) {
  const roofH = 18
  if (lit) {
    return (
      <>
        <LitWindow x={x + 5} y={y + roofH + 3} w={10} />
        <circle cx={x + w / 2} cy={y + 9} r="10" fill="#00aaee" opacity="0.3" />
      </>
    )
  }
  return (
    <>
      <Shadow x={x} y={y} w={w} h={h} />
      <Box x={x + 2} y={y + roofH - 2} w={w - 4} h={h - roofH + 2} fill="#fffaf0" />
      <Window x={x + 5} y={y + roofH + 3} w={10} />
      <Door x={x + w - 18} y={y + h - 13} w={12} h={12} fill="#7fd0f5" />
      <Roof x={x - 2} y={y} w={w + 4} h={roofH} color="#00aaee" dark="#0a6fb0" />
      <Box x={x + 8} y={y + 5} w={w - 16} h={8} fill="#fffaf0" />
      <rect x={x + 11} y={y + 8} width={w - 22} height={2} fill="#0a6fb0" />
    </>
  )
}

export function Fountain({ x, y }) {
  return (
    <>
      <Box x={x} y={y} w={32} h={22} fill="#ccc7b9" />
      <rect x={x + 3} y={y + 3} width={26} height={16} fill="#00aaee" />
      <rect x={x + 3} y={y + 3} width={26} height={2} fill="#0a6fb0" />
      <Box x={x + 13} y={y + 6} w={6} h={10} fill="#e9e5da" />
      <rect className="map-glint" x={x + 6} y={y + 12} width={3} height={1} fill="#c8eeff" />
      <rect className="map-glint map-glint--late" x={x + 22} y={y + 9} width={3} height={1} fill="#c8eeff" />
      <rect className="map-spray" x={x + 15} y={y + 2} width={2} height={3} fill="#c8eeff" />
    </>
  )
}

export function Sign({ x, y, color }) {
  return (
    <>
      <rect x={x + 5} y={y + 7} width={2} height={7} fill="#6b4226" />
      <Box x={x} y={y} w={12} h={9} fill={color} />
      <rect x={x + 3} y={y + 3} width={6} height={1} fill="rgba(0,0,0,0.35)" />
      <rect x={x + 3} y={y + 5} width={4} height={1} fill="rgba(0,0,0,0.35)" />
    </>
  )
}

export function Boat({ x, y, lit }) {
  if (lit) {
    return (
      <>
        <LitWindow x={x + 15} y={y + 2} w={6} h={4} />
        <LitWindow x={x + 23} y={y + 2} w={6} h={4} />
        <rect className="map-lamp-glow" x={x + 36} y={y - 1} width={3} height={3} fill="#d9381e" />
      </>
    )
  }
  return (
    <>
      <rect x={x + 2} y={y + 16} width={44} height={3} fill="rgba(13, 55, 104, 0.4)" />
      <Box x={x} y={y + 8} w={48} h={10} fill="#fffaf0" />
      <rect x={x + 1} y={y + 14} width={46} height={3} fill="#d9381e" />
      <Box x={x + 12} y={y} w={20} h={9} fill="#fffaf0" />
      <Window x={x + 15} y={y + 2} w={6} h={4} />
      <Window x={x + 23} y={y + 2} w={6} h={4} />
      <rect x={x + 36} y={y + 2} width={3} height={7} fill="#2a1d24" />
    </>
  )
}

export function Flower({ x, y, color }) {
  return (
    <>
      <rect x={x + 1} y={y} width={1} height={1} fill={color} />
      <rect x={x} y={y + 1} width={3} height={1} fill={color} />
      <rect x={x + 1} y={y + 1} width={1} height={1} fill="#fbe08a" />
      <rect x={x + 1} y={y + 2} width={1} height={1} fill={color} />
      <rect x={x + 1} y={y + 3} width={1} height={1} fill="#2f8f4a" />
    </>
  )
}

// Poste de luz: base em (x, y), lâmpada no topo.
export function Lamp({ x, y }) {
  return (
    <>
      <rect x={x - 1} y={y - 2} width={5} height={3} fill="rgba(20,20,40,0.25)" />
      <rect x={x} y={y - 16} width={3} height={16} fill={INK} />
      <rect x={x + 1} y={y - 15} width={1} height={14} fill="#6e6890" />
      <Box x={x - 2} y={y - 20} w={7} h={5} fill="#e9e5da" />
    </>
  )
}

export function LampGlow({ x, y }) {
  return (
    <g className="map-lamp-glow">
      <ellipse cx={x + 1.5} cy={y + 1} rx="16" ry="7" fill="url(#lamp-pool)" />
      <circle cx={x + 1.5} cy={y - 17.5} r="12" fill="url(#lamp-halo)" />
      <rect x={x - 1} y={y - 19} width={5} height={3} fill="#fffaf0" />
    </g>
  )
}
