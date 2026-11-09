import PixelIcon from './PixelIcon'
import { useTheme } from '../../context/ThemeContext'
import '../../css/common/ThemeToggle.css'

// Alterna entre dia e noite; o ícone mostra o modo para o qual vai mudar.
export default function ThemeToggle({ className = '' }) {
  const { isNight, toggleTheme } = useTheme()
  const label = isNight ? 'Ativar modo diurno' : 'Ativar modo noturno'
  return (
    <button type="button" className={`theme-toggle ${isNight ? 'is-night' : ''} ${className}`} onClick={toggleTheme} aria-label={label} title={label} aria-pressed={isNight}>
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__knob">
          <PixelIcon name={isNight ? 'moon' : 'sun'} size={16} />
        </span>
      </span>
      <span className="theme-toggle__text">{isNight ? 'Noite' : 'Dia'}</span>
    </button>
  )
}
