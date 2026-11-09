import '../../css/common/Logo.css'

// Logotipo em camadas: sombra (Solid), preenchimento (Solid) e contorno (Hollow).
export default function Logo({ text = 'Pokédex', size = 'large', as: Tag = 'h1' }) {
  return (
    <Tag className={`logo logo--${size}`} aria-label={text}>
      <span className="logo__layer logo__shadow" aria-hidden="true">{text}</span>
      <span className="logo__layer logo__fill" aria-hidden="true">{text}</span>
      <span className="logo__layer logo__outline" aria-hidden="true">{text}</span>
    </Tag>
  )
}
