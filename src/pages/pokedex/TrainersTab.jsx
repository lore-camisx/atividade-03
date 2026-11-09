import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookSpread } from '../../components/pokedex/Book'
import PageIntro from '../../components/pokedex/PageIntro'
import TrainerGrid from '../../components/pokedex/TrainerGrid'
import TrainerPage from '../../components/pokedex/TrainerPage'
import { TRAINERS, TRAINER_BY_ID } from '../../data'
import { useArrowNavigation } from '../../hooks/useArrowNavigation'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useScrollIntoViewOnMobile } from '../../hooks/useScrollIntoViewOnMobile'

const SORTS = {
  id: (a, b) => a.id - b.id,
  name: (a, b) => a.name.localeCompare(b.name),
  badges: (a, b) => b.badges - a.badges || a.name.localeCompare(b.name),
  team: (a, b) => b.pokemonIds.length - a.pokemonIds.length || a.name.localeCompare(b.name),
}

export default function TrainersTab() {
  const { trainerId } = useParams()
  const navigate = useNavigate()
  const [sort, setSort] = useState('id')
  const sorted = useMemo(() => [...TRAINERS].sort(SORTS[sort]), [sort])
  const selected = trainerId ? TRAINER_BY_ID.get(Number(trainerId)) : null
  useDocumentTitle(selected ? selected.name : 'Treinadores')

  const index = selected ? sorted.findIndex((t) => t.id === selected.id) : -1
  const go = (delta) => selected && navigate(`/pokedex/treinadores/${sorted[(index + delta + sorted.length) % sorted.length].id}`)
  useArrowNavigation(() => go(-1), () => go(1), Boolean(selected))
  const rightRef = useScrollIntoViewOnMobile(selected?.id)

  const left = (
    <>
      <div className="trainers-head">
        <h2 className="book-heading">Treinadores</h2>
        <label className="controls__field">
          <span>Ordem</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="id">Padrão</option>
            <option value="name">Nome</option>
            <option value="badges">Insígnias</option>
            <option value="team">Tamanho do time</option>
          </select>
        </label>
      </div>
      <TrainerGrid trainers={sorted} selectedId={selected?.id} onSelect={(t) => navigate(`/pokedex/treinadores/${t.id}`)} />
      <p className="book-footnote">{TRAINERS.length} treinadores registrados · use ← → para folhear</p>
    </>
  )

  const right = selected ? (
    <TrainerPage trainer={selected} />
  ) : (
    <PageIntro title="Quadro de treinadores">
      <p>Escolha um treinador para ver insígnias, time e onde encontrá-lo na cidade.</p>
    </PageIntro>
  )

  return <BookSpread left={left} right={right} rightRef={rightRef} />
}
