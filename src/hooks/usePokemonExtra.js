import { useEffect, useState } from 'react'

const API = 'https://pokeapi.co/api/v2'

// Busca dados complementares (altura, peso e descrição) na PokéAPI.
// É opcional: se a rede falhar, a Pokédex continua usando apenas o JSON local.
export function usePokemonExtra(id) {
  const [state, setState] = useState({ status: 'idle', data: null })

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    setState({ status: 'loading', data: null })

    Promise.all([
      fetch(`${API}/pokemon/${id}`, { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(r.status)
        return r.json()
      }),
      fetch(`${API}/pokemon-species/${id}`, { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(r.status)
        return r.json()
      }),
    ])
      .then(([pokemon, species]) => {
        const entry =
          species.flavor_text_entries.find((e) => e.language.name === 'pt-br') ??
          species.flavor_text_entries.find((e) => e.language.name === 'en')
        setState({
          status: 'done',
          data: {
            height: pokemon.height / 10,
            weight: pokemon.weight / 10,
            genus: species.genera.find((g) => g.language.name === 'en')?.genus,
            flavor: entry?.flavor_text.replace(/[\f\n\r­]+/g, ' '),
          },
        })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', data: null })
      })

    return () => controller.abort()
  }, [id])

  return state
}
