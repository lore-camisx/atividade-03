import Person from '../common/Person'
import { TRAINER_LOOKS } from '../../data/world'
import '../../css/pokedex/SlotGrid.css'

export default function TrainerGrid({ trainers, selectedId, onSelect }) {
  return (
    <ul className="slots">
      {trainers.map((trainer) => (
        <li key={trainer.id}>
          <button
            type="button"
            className={`slot slot--trainer ${trainer.id === selectedId ? 'slot--selected' : ''}`}
            onClick={() => onSelect(trainer)}
            aria-pressed={trainer.id === selectedId}
            title={trainer.name}
          >
            <span className="slot__id">{trainer.badges}★</span>
            <Person look={TRAINER_LOOKS[trainer.id]} size={60} />
            <span className="slot__name">{trainer.name}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
