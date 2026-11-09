import PixelIcon from '../common/PixelIcon'
import { SORT_OPTIONS, TYPE_LABELS } from '../../utils/pokemon'
import { USED_TYPES } from '../../data'
import '../../css/pokedex/GridControls.css'

// Pesquisa, filtro de tipo e ordenação no topo da página esquerda.
export default function GridControls({ filters, setFilters, view, onView }) {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }))

  return (
    <div className="controls">
      <label className="controls__search">
        <PixelIcon name="search" size={18} />
        <span className="sr-only">Pesquisar Pokémon por nome ou número</span>
        <input
          type="search"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder="Pesquisar Pokémon..."
          autoComplete="off"
          spellCheck="false"
        />
        {filters.query && (
          <button type="button" onClick={() => update({ query: '' })} aria-label="Limpar pesquisa">
            <PixelIcon name="close" size={10} />
          </button>
        )}
      </label>

      <div className="controls__row">
        <label className="controls__field">
          <span>Tipo</span>
          <select value={filters.type} onChange={(e) => update({ type: e.target.value })}>
            <option value="">Todos</option>
            {USED_TYPES.map((type) => (
              <option key={type} value={type}>
                {TYPE_LABELS[type] ?? type}
              </option>
            ))}
          </select>
        </label>
        <label className="controls__field">
          <span>Ordem</span>
          <select value={filters.sortKey} onChange={(e) => update({ sortKey: e.target.value })}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="controls__dir"
          onClick={() => update({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
          aria-label={filters.sortDir === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'}
          title={filters.sortDir === 'asc' ? 'Crescente' : 'Decrescente'}
        >
          {filters.sortDir === 'asc' ? '▲' : '▼'}
        </button>
        {onView && (
          <div className="controls__view" role="group" aria-label="Modo de exibição">
            {[
              ['grid', 'Grade'],
              ['list', 'Lista'],
            ].map(([value, label]) => (
              <button key={value} type="button" className={view === value ? 'is-active' : ''} aria-pressed={view === value} onClick={() => onView(value)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
