import { useMemo } from 'react'
import { gridToRuns } from '../../utils/pixel'

// Desenha uma grade de pixels como <g> (dentro de outro SVG) ou como <svg> independente.
export function PixelGroup({ grid, palette, x = 0, y = 0, scale = 1, flip = false, className, ...rest }) {
  const runs = useMemo(() => gridToRuns(grid, palette), [grid, palette])
  const width = grid[0].length
  const transform = flip
    ? `translate(${x + width * scale} ${y}) scale(${-scale} ${scale})`
    : `translate(${x} ${y}) scale(${scale})`

  return (
    <g transform={transform} className={className} {...rest}>
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.width} height="1" fill={r.color} />
      ))}
    </g>
  )
}

export default function PixelArt({ grid, palette, size, className = '', title, style }) {
  const width = grid[0].length
  const height = grid.length
  return (
    <svg
      className={`pixel-art ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      width={size ? (size * width) / Math.max(width, height) : undefined}
      height={size ? (size * height) / Math.max(width, height) : undefined}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={style}
    >
      <PixelGroup grid={grid} palette={palette} />
    </svg>
  )
}
