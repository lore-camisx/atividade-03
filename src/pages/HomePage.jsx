import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import NightScene from '../components/home/NightScene'
import ThemeToggle from '../components/common/ThemeToggle'
import { POKEMON } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import '../css/home/HomePage.css'

export default function HomePage() {
  useDocumentTitle(null)
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [cursor, setCursor] = useState(0)
  const itemRefs = useRef([])

  const options = useMemo(
    () => [
      { label: 'Explorar a cidade', hint: 'Converse com líderes e Pokémon', to: '/cidade' },
      { label: 'Abrir a Pokédex', hint: `${POKEMON.length} Pokémon registrados`, to: '/pokedex' },
      { label: 'Treinadores', hint: 'Insígnias e times', to: '/pokedex/treinadores' },
      { label: 'Pokémon aleatório', hint: 'Deixe o destino escolher', to: () => `/pokedex/${POKEMON[Math.floor(Math.random() * POKEMON.length)].id}` },
    ],
    [],
  )

  function choose(option) {
    navigate(typeof option.to === 'function' ? option.to() : option.to)
  }

  // Controles de "videogame": Enter inicia, setas movem o cursor do menu.
  useEffect(() => {
    function onKeyDown(event) {
      if (!started && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        setStarted(true)
      } else if (started && event.key === 'ArrowDown') {
        event.preventDefault()
        setCursor((c) => (c + 1) % options.length)
      } else if (started && event.key === 'ArrowUp') {
        event.preventDefault()
        setCursor((c) => (c - 1 + options.length) % options.length)
      } else if (started && event.key === 'Escape') {
        setStarted(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [started, options.length])

  useEffect(() => {
    if (started) itemRefs.current[cursor]?.focus()
  }, [started, cursor])

  return (
    <main className="home">
      <NightScene />
      <ThemeToggle className="home__toggle" />

      <div className="home__content">
        <div className="home__title">
          <Logo text="Pokédex" />
          <p className="home__subtitle">Edição Kanto · Pixel Art</p>
          <p className="home__year">2026</p>
        </div>

        {!started ? (
          <div className="home__start">
            <button type="button" className="start-btn" onClick={() => setStarted(true)}>
              Start
            </button>
            <p className="home__press blink">Pressione Enter ou clique em START</p>
          </div>
        ) : (
          <nav className="home-menu" aria-label="Menu principal">
            <ul>
              {options.map((option, index) => (
                <li key={option.label}>
                  <button
                    type="button"
                    ref={(el) => (itemRefs.current[index] = el)}
                    className={index === cursor ? 'is-active' : ''}
                    onMouseEnter={() => setCursor(index)}
                    onFocus={() => setCursor(index)}
                    onClick={() => choose(option)}
                  >
                    <span className="home-menu__cursor" aria-hidden="true">
                      ▶
                    </span>
                    <span className="home-menu__label">{option.label}</span>
                    <span className="home-menu__hint">{option.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="home-menu__help">↑ ↓ para escolher · Enter para confirmar · Esc para voltar</p>
          </nav>
        )}
      </div>

      <footer className="home__footer">Atividade 03 · React + Vite · Sprites: PokéAPI</footer>
    </main>
  )
}
