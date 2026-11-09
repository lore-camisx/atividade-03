import raw from './pokedex-data.json'

const TYPELESS = raw.types.find((t) => t.name === 'Typeless')

// Alguns registros (ex.: Mew) vêm sem tipo no JSON; tratamos como "Typeless".
export const POKEMON = raw.pokemon.map((p) => (p.types.length > 0 ? p : { ...p, types: [TYPELESS] }))
export const POKEMON_BY_ID = new Map(POKEMON.map((p) => [p.id, p]))

export const TRAINERS = raw.trainers
export const TRAINER_BY_ID = new Map(TRAINERS.map((t) => [t.id, t]))

// Apenas os tipos que aparecem em algum Pokémon, na ordem do JSON.
export const USED_TYPES = raw.types
  .map((t) => t.name)
  .filter((name) => POKEMON.some((p) => p.types.some((t) => t.name === name)))

export function teamOf(trainer) {
  return trainer.pokemonIds.map((id) => POKEMON_BY_ID.get(id)).filter(Boolean)
}

export function ownersOf(pokemonId) {
  return TRAINERS.filter((t) => t.pokemonIds.includes(pokemonId))
}
