import PixelIcon from './PixelIcon'
import { STAT_MAX } from '../../utils/pokemon'
import '../../css/common/StatBar.css'

// Barra segmentada: cada bloco equivale a uma fração do valor máximo do atributo.
export default function StatBar({ stat, value, color, highlight = false }) {
  const percent = Math.min(100, Math.round((value / STAT_MAX) * 100))

  return (
    <div className={`stat ${highlight ? 'stat--win' : ''}`}>
      <span className="stat__label">
        <PixelIcon name={stat.icon} size={14} />
        {stat.short}
      </span>
      <span className="stat__value">{value}</span>
      <span className="stat__track" role="meter" aria-label={stat.label} aria-valuemin={0} aria-valuemax={STAT_MAX} aria-valuenow={value}>
        <span className="stat__fill" style={{ width: `${percent}%`, '--fill': color }} />
      </span>
    </div>
  )
}
