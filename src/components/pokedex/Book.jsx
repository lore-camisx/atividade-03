import { NavLink } from 'react-router-dom'
import PixelIcon from '../common/PixelIcon'
import '../../css/pokedex/Book.css'

const TABS = [
  { to: '/pokedex', label: 'Pokédex', icon: 'book', match: 'dex' },
  { to: '/pokedex/treinadores', label: 'Treinadores', icon: 'trainer', match: 'trainers' },
  { to: '/pokedex/habitat', label: 'Habitat', icon: 'leaf', match: 'habitat' },
  { to: '/pokedex/comparar', label: 'Comparar', icon: 'swords', match: 'compare' },
  { to: '/pokedex/favoritos', label: 'Favoritos', icon: 'star', match: 'favorites' },
]

// Livro aberto: abas no topo, fitas marcadoras na lateral e duas páginas.
export default function Book({ activeTab, ribbons, children }) {
  return (
    <div className="book-wrap">
      <nav className="book__tabs" aria-label="Seções da Pokédex">
        {TABS.map((tab) => (
          <NavLink
            key={tab.match}
            to={tab.to}
            className={`book__tab ${activeTab === tab.match ? 'is-active' : ''}`}
            aria-current={activeTab === tab.match ? 'page' : undefined}
            title={tab.label}
          >
            <PixelIcon name={tab.icon} size={22} />
            <span className="book__tab-label">{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="book">
        <span className="book__corner book__corner--tl" aria-hidden="true" />
        <span className="book__corner book__corner--tr" aria-hidden="true" />
        <span className="book__corner book__corner--bl" aria-hidden="true" />
        <span className="book__corner book__corner--br" aria-hidden="true" />
        {children}
        <span className="book__clasp" aria-hidden="true" />
      </div>

      <div className="book__ribbons">
        {ribbons.map((ribbon) => (
          <button
            key={ribbon.label}
            type="button"
            className="ribbon"
            style={{ '--ribbon': ribbon.color }}
            onClick={ribbon.onClick}
            disabled={ribbon.disabled}
            aria-pressed={ribbon.pressed}
            title={ribbon.label}
          >
            <span className="ribbon__body">
              <PixelIcon name={ribbon.icon} size={20} />
              <span className="ribbon__label">{ribbon.label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function BookSpread({ left, right, rightRef }) {
  return (
    <div className="book__spread">
      <section className="book__page book__page--left">{left}</section>
      <section className="book__page book__page--right" ref={rightRef}>
        {right}
      </section>
    </div>
  )
}
