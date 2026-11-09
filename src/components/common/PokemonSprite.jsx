import { useEffect, useState } from 'react'
import { spriteUrl } from '../../utils/pokemon'
import '../../css/common/PokemonSprite.css'

// Sprite em pixel art; sem internet, exibe um "?" pixelado no lugar.
export default function PokemonSprite({ pokemon, size = 96, shiny = false, back = false, bob = false, className = '' }) {
  const [failed, setFailed] = useState(false)
  const src = spriteUrl(pokemon.id, { shiny, back })

  useEffect(() => setFailed(false), [src])

  return (
    <div className={`sprite ${bob ? 'sprite--bob' : ''} ${className}`} style={{ width: size, height: size }}>
      {failed ? (
        <span className="sprite__missing" role="img" aria-label={pokemon.name}>
          ?
        </span>
      ) : (
        <img src={src} alt={pokemon.name} width={size} height={size} loading="lazy" draggable="false" onError={() => setFailed(true)} />
      )}
    </div>
  )
}
