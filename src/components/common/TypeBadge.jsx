import { TYPE_LABELS, typeColor, typeInk } from '../../utils/pokemon'
import '../../css/common/TypeBadge.css'

export default function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{ '--type-bg': typeColor(type), '--type-ink': typeInk(type) }}>
      {TYPE_LABELS[type] ?? type}
    </span>
  )
}
