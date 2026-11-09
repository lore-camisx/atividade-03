import { Link, isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'
import Person from '../components/common/Person'
import RetroWindow from '../components/common/RetroWindow'
import { TRAINER_LOOKS } from '../data/world'
import { seeded } from '../utils/pixel'
import { spriteUrl } from '../utils/pokemon'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import '../css/pages/ErrorPage.css'

// Criatura "bugada" feita de blocos que piscam (arte original).
const GLITCH_BLOCKS = (() => {
  const rand = seeded(404)
  const colors = ['#2a1d24', '#00aaee', '#d9381e', '#f4c430', '#ccc7b9', '#009698']
  const blocks = []
  for (let y = 0; y < 14; y++) {
    const width = y < 4 ? 4 : y < 9 ? 7 : 5
    for (let x = 0; x < width; x++) {
      if (rand() > 0.18) blocks.push({ x, y, color: colors[Math.floor(rand() * colors.length)], delay: (x + y) % 5 })
    }
  }
  return blocks
})()

function GlitchCreature() {
  return (
    <svg className="err-art err-art--glitch" viewBox="-1 -1 9 16" width="120" height="200" shapeRendering="crispEdges" aria-hidden="true">
      {GLITCH_BLOCKS.map((b, i) => (
        <rect key={i} className="err-art__block" style={{ animationDelay: `${b.delay * 0.15}s` }} x={b.x} y={b.y} width="1" height="1" fill={b.color} />
      ))}
    </svg>
  )
}

function ConfusedPsyduck() {
  return (
    <div className="err-art err-art--confused" aria-hidden="true">
      <span className="err-art__q err-art__q--1">?</span>
      <span className="err-art__q err-art__q--2">?</span>
      <span className="err-art__q err-art__q--3">?</span>
      <img src={spriteUrl(54)} alt="" width="144" height="144" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
    </div>
  )
}

function LostTrainer() {
  return (
    <div className="err-art err-art--lost" aria-hidden="true">
      <span className="err-art__dots">...</span>
      <Person look={TRAINER_LOOKS[1]} size={110} />
    </div>
  )
}

function ErrorScreen({ code, title, message, detail, art, tone = 'saffron', actions }) {
  useDocumentTitle(title)
  return (
    <main className="error-screen">
      <RetroWindow title={`Mensagem do sistema · ${code}`} tone={tone} className="error-screen__window" titleId="error-title">
        {art}
        <h1 className="error-screen__title">{title}</h1>
        <p className="error-screen__message">{message}</p>
        {detail && <p className="error-screen__detail">{detail}</p>}
        <div className="error-screen__actions">{actions}</div>
      </RetroWindow>
      <p className="error-screen__copy">© 2026 Pokédex · Sistema Pixel</p>
    </main>
  )
}

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <ErrorScreen
      code="404"
      title="Página não encontrada"
      message="O Psyduck procurou por todo canto, mas esta página não existe."
      detail="Error 404 · Page not found"
      art={<ConfusedPsyduck />}
      actions={
        <>
          <button type="button" className="px-btn" onClick={() => navigate(-1)}>
            Voltar
          </button>
          <Link to="/" className="px-btn px-btn--saffron error-screen__ok">
            OK
          </Link>
        </>
      }
    />
  )
}

export default function ErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    if (error.statusText === 'pokemon' || error.statusText === 'trainer') {
      const isPokemon = error.statusText === 'pokemon'
      return (
        <ErrorScreen
          code="404"
          tone={isPokemon ? 'cerulean' : 'pewter'}
          title={isPokemon ? 'Pokémon não registrado' : 'Treinador não encontrado'}
          message={
            isPokemon
              ? 'Esse número não existe nesta Pokédex. Algo estranho apareceu no lugar...'
              : 'Nenhum treinador com esse número passou pela cidade.'
          }
          detail={isPokemon ? 'Dex entry not found' : 'Trainer not found'}
          art={isPokemon ? <GlitchCreature /> : <LostTrainer />}
          actions={
            <Link to={isPokemon ? '/pokedex' : '/pokedex/treinadores'} className="px-btn px-btn--saffron error-screen__ok">
              OK
            </Link>
          }
        />
      )
    }
    return <NotFoundPage />
  }

  const detail = error instanceof Error ? error.message : String(error?.statusText ?? error ?? 'Erro desconhecido')

  return (
    <ErrorScreen
      code="ERR"
      tone="vermillion"
      title="A Pokédex travou!"
      message="Um erro inesperado bagunçou os pixels. Tente reiniciar."
      detail={detail}
      art={<GlitchCreature />}
      actions={
        <>
          <button type="button" className="px-btn" onClick={() => window.location.reload()}>
            Reiniciar
          </button>
          <a href="/" className="px-btn px-btn--saffron error-screen__ok">
            OK
          </a>
        </>
      }
    />
  )
}
