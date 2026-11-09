import RetroWindow from '../common/RetroWindow'
import '../../css/pokedex/EmptyPage.css'

// Mensagem de "nada por aqui" com tufos de grama balançando.
export default function EmptyPage({ title, text, action }) {
  return (
    <div className="empty-page" role="status">
      <RetroWindow title={title} tone="cerulean">
        <div className="empty-page__grass" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="empty-page__text">{text}</p>
        {action}
      </RetroWindow>
    </div>
  )
}
