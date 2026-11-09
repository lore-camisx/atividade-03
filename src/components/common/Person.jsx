import PixelArt, { PixelGroup } from './PixelArt'
import { PERSON, personPalette } from '../../art/sprites'
import { useMemo } from 'react'

// Personagem pixelado; aceita as cores do visual de cada treinador.
export default function Person({ look, size = 48, className = '', title }) {
  const palette = useMemo(() => personPalette(look), [look])
  return <PixelArt grid={PERSON} palette={palette} size={size} className={className} title={title} />
}

export function PersonGroup({ look, ...props }) {
  const palette = useMemo(() => personPalette(look), [look])
  return <PixelGroup grid={PERSON} palette={palette} {...props} />
}
