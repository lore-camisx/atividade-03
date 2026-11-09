import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GameNav from '../components/common/GameNav'
import Logo from '../components/common/Logo'
import CityMap from '../components/city/CityMap'
import DialogueBox from '../components/city/DialogueBox'
import PlacesList from '../components/city/PlacesList'
import { MAP_H, MAP_W, PLACES, PLACE_BY_ID } from '../data/cityPlaces'
import { DISTRICTS } from '../data/world'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTheme } from '../context/ThemeContext'
import '../css/city/CityPage.css'

const LEGEND = ['viridian', 'saffron', 'cerulean', 'pewter', 'vermillion']

export default function CityPage() {
  useDocumentTitle('Cidade')
  const [params, setParams] = useSearchParams()
  const [hovered, setHovered] = useState(null)
  const { isNight } = useTheme()
  // Alguns Pokémon só aparecem à noite.
  const places = PLACES.filter((p) => !p.nightOnly || isNight)
  // O lugar aberto fica na URL (?local=...), assim a Pokédex consegue linkar direto para um treinador.
  const found = PLACE_BY_ID.get(params.get('local'))
  const active = found && (!found.nightOnly || isNight) ? found : null

  const select = useCallback(
    (placeOrId) => {
      const id = typeof placeOrId === 'string' ? placeOrId : placeOrId.id
      setParams({ local: id }, { replace: true })
    },
    [setParams],
  )
  const close = useCallback(() => setParams({}, { replace: true }), [setParams])

  // No celular o mapa rola de lado: centraliza o lugar aberto na área visível.
  const scrollRef = useRef(null)
  useEffect(() => {
    const el = scrollRef.current
    if (!active || !el || el.scrollWidth <= el.clientWidth) return
    const center = ((active.x + active.w / 2) / MAP_W) * el.scrollWidth
    el.scrollTo({ left: center - el.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  const label = hovered ?? null
  const leaderPlace = active?.kind === 'gym' ? `trainer-${active.leaderId}` : null

  return (
    <div className="city">
      <header className="city__header">
        <GameNav />
        <Logo text="Cidade" size="medium" />
        <ul className="city__legend" aria-label="Bairros">
          {LEGEND.map((key) => (
            <li key={key} style={{ '--district': DISTRICTS[key].color }}>
              {DISTRICTS[key].name}
            </li>
          ))}
        </ul>
      </header>

      <div className="city__layout">
        <div className="city__map-frame">
          <p className="city__hint">
            <span className="blink">▶</span> {isNight ? 'Boa noite! Alguns Pokémon só aparecem no escuro... ' : ''}Clique em personagens, Pokémon, ginásios e placas para conversar.
          </p>
          <div className="city__scroll" ref={scrollRef}>
            <div className="city-map">
              <CityMap places={places} night={isNight} activeId={active?.id} onSelect={select} onHover={setHovered} />
              {label && (
                <span
                  className="city-map__label"
                  style={{ left: `${((label.x + label.w / 2) / MAP_W) * 100}%`, top: `${(label.y / MAP_H) * 100}%` }}
                >
                  {label.name}
                </span>
              )}
              {active && (
                <span
                  className="city-map__marker"
                  aria-hidden="true"
                  style={{ left: `${((active.x + active.w / 2) / MAP_W) * 100}%`, top: `${(active.y / MAP_H) * 100}%` }}
                >
                  !
                </span>
              )}
            </div>
          </div>
        </div>

        <PlacesList places={places} activeId={active?.id} onSelect={select} />
      </div>

      {active && <DialogueBox key={active.id} place={active} onClose={close} onSelectPlace={select} trainerPlaceId={leaderPlace} />}
    </div>
  )
}
