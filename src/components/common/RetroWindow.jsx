import '../../css/common/RetroWindow.css'

// Janela de sistema retrô (barra listrada, botões de minimizar/fechar e sombra dura).
export default function RetroWindow({ title, children, onClose, tone = 'saffron', className = '', titleId }) {
  return (
    <section className={`retro-window retro-window--${tone} ${className}`} aria-labelledby={titleId}>
      <header className="retro-window__bar">
        <span className="retro-window__box" aria-hidden="true" />
        <span className="retro-window__stripes" aria-hidden="true" />
        <h2 className="retro-window__title" id={titleId}>
          {title}
        </h2>
        <span className="retro-window__stripes" aria-hidden="true" />
        <span className="retro-window__box retro-window__box--min" aria-hidden="true" />
        {onClose ? (
          <button type="button" className="retro-window__box retro-window__box--close" onClick={onClose} aria-label="Fechar" />
        ) : (
          <span className="retro-window__box retro-window__box--close" aria-hidden="true" />
        )}
      </header>
      <div className="retro-window__body">{children}</div>
    </section>
  )
}
