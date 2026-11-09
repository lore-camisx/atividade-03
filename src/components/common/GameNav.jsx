import { NavLink } from 'react-router-dom'
import PixelIcon from './PixelIcon'
import ThemeToggle from './ThemeToggle'
import '../../css/common/GameNav.css'

const LINKS = [
  { to: '/', label: 'Início', icon: 'home', end: true },
  { to: '/cidade', label: 'Cidade', icon: 'map' },
  { to: '/pokedex', label: 'Pokédex', icon: 'book' },
]

export default function GameNav({ className = '' }) {
  return (
    <nav className={`game-nav ${className}`} aria-label="Navegação principal">
      {LINKS.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end} className="game-nav__link">
          <PixelIcon name={link.icon} size={16} />
          <span>{link.label}</span>
        </NavLink>
      ))}
      <ThemeToggle />
    </nav>
  )
}
