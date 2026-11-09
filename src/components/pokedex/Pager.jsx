import PixelIcon from '../common/PixelIcon'
import '../../css/pokedex/Pager.css'

export default function Pager({ page, pages, onPage, info }) {
  return (
    <div className="pager">
      <button type="button" className="pager__btn" onClick={() => onPage(page - 1)} disabled={page <= 0} aria-label="Página anterior">
        <PixelIcon name="left" size={14} />
      </button>
      <div className="pager__info">
        <strong>
          Pág. {pages === 0 ? 0 : page + 1}/{pages}
        </strong>
        <span>{info}</span>
      </div>
      <button type="button" className="pager__btn" onClick={() => onPage(page + 1)} disabled={page >= pages - 1} aria-label="Próxima página">
        <PixelIcon name="right" size={14} />
      </button>
    </div>
  )
}
