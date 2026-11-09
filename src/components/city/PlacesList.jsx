import PixelIcon from '../common/PixelIcon'
import { DISTRICTS } from '../../data/world'
import '../../css/city/PlacesList.css'

const KIND_ICON = { gym: 'badge', building: 'home', object: 'chat', sign: 'pin', trainer: 'trainer', wild: 'spark' }
const ORDER = ['viridian', 'saffron', 'cerulean', 'pewter', 'center', 'vermillion']

// Lista acessível de tudo que existe no mapa (também ajuda no celular).
export default function PlacesList({ places, activeId, onSelect }) {
  return (
    <aside className="places" aria-label="Lugares da cidade">
      <h2 className="places__title">Guia da cidade</h2>
      {ORDER.map((key) => {
        const district = DISTRICTS[key]
        const items = places.filter((p) => p.district === key && p.kind !== 'sign')
        return (
          <details key={key} className="places__group" open={key !== 'center' ? undefined : true} style={{ '--district': district.color, '--district-ink': district.ink }}>
            <summary>
              <span className="places__chip" />
              {district.name}
              <span className="places__count">{items.length}</span>
            </summary>
            <ul>
              {items.map((place) => (
                <li key={place.id}>
                  <button type="button" className={place.id === activeId ? 'is-active' : ''} onClick={() => onSelect(place)}>
                    <PixelIcon name={KIND_ICON[place.kind]} size={14} />
                    {place.name}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )
      })}
    </aside>
  )
}
