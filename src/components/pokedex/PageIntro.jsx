import '../../css/pokedex/PageIntro.css'

// Página direita antes de escolher algo: seta pixelada apontando para a esquerda.
export default function PageIntro({ title, children }) {
  return (
    <div className="page-intro">
      <span className="page-intro__arrow" aria-hidden="true" />
      <h2 className="page-intro__title">{title}</h2>
      <div className="page-intro__text">{children}</div>
    </div>
  )
}
