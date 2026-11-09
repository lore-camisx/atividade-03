// Mundo da cidade: bairros (cores da paleta), visual dos treinadores e falas.

export const DISTRICTS = {
  viridian: { name: 'Viridian', color: '#009698', ink: '#fffaf0', blurb: 'Bosque denso, grama alta e um ginásio cercado de mistério.' },
  saffron: { name: 'Saffron', color: '#f4c430', ink: '#2a1d24', blurb: 'O centro dourado da cidade, cheio de prédios e energia psíquica.' },
  cerulean: { name: 'Cerulian', color: '#00aaee', ink: '#fffaf0', blurb: 'Um lago azul onde Pokémon de água vivem tranquilos.' },
  pewter: { name: 'Pewter', color: '#ccc7b9', ink: '#2a1d24', blurb: 'Ruas de pedra cinza e rochas para todo lado.' },
  vermillion: { name: 'Vermillion', color: '#d9381e', ink: '#fffaf0', blurb: 'O porto da cidade, com cais de madeira e brisa do mar.' },
  center: { name: 'Praça Central', color: '#ece3cd', ink: '#2a1d24', blurb: 'Centro Pokémon, loja e o jardim florido.' },
}

// Cores de cada treinador do JSON, usadas no sprite pixelado.
export const TRAINER_LOOKS = {
  1: { hair: '#d9381e', brim: '#fffaf0', shirt: '#0a6fb0', detail: '#fffaf0', pants: '#2b4a7a' }, // Ash
  2: { hair: '#5a3a22', skin: '#c9925f', shirt: '#e07b2a', detail: '#5a7d2a', pants: '#6b4226' }, // Brock
  3: { hair: '#f08a30', shirt: '#f4c430', detail: '#d9381e', pants: '#00aaee' }, // Misty
  4: { hair: '#f2d16b', skin: '#e0b080', shirt: '#6b7a3a', detail: '#4d5a28', pants: '#4d5a28' }, // Lt. Surge
  5: { hair: '#2a2a3a', brim: '#d9381e', shirt: '#3f8f4f', detail: '#f4c430', pants: '#2f6b3b' }, // Erika
  6: { hair: '#3a2a5a', brim: '#2a1d24', shirt: '#5a3a8a', detail: '#9b9584', pants: '#3a2a5a' }, // Koga
  7: { hair: '#1f4a4a', shirt: '#b02a6a', detail: '#2a1d24', pants: '#2a1d24' }, // Sabrina
  8: { hair: '#e9e5da', brim: '#f5c9a0', shirt: '#fffaf0', detail: '#d9381e', pants: '#3a3a4a' }, // Blaine
  9: { hair: '#2a1d24', shirt: '#b5651d', detail: '#7a3f12', pants: '#3a2a2a' }, // Giovanni
  10: { hair: '#8a5a2a', shirt: '#6a4a9a', detail: '#2a1d24', pants: '#22305a' }, // Gary
  11: { hair: '#c0306a', shirt: '#fffaf0', detail: '#d9381e', pants: '#2a1d24' }, // Team Rocket
  12: { hair: '#c03030', shirt: '#22305a', detail: '#f08a30', pants: '#22305a' }, // Lance
}

export const NPC_LOOKS = {
  nurse: { hair: '#f49ac1', brim: '#fffaf0', shirt: '#fffaf0', detail: '#f49ac1', pants: '#f49ac1', shoes: '#fffaf0' },
  clerk: { hair: '#0a6fb0', brim: '#0a6fb0', shirt: '#00aaee', detail: '#fffaf0', pants: '#22305a' },
  sailor: { hair: '#fffaf0', brim: '#22305a', shirt: '#fffaf0', detail: '#22305a', pants: '#22305a' },
}

// Falas de cada treinador (sem IA: roteiro fixo, como em um jogo).
export const TRAINER_LINES = {
  1: ['Ei! Eu sou o Ash, de Pallet!', 'Meu sonho é ser um Mestre Pokémon. O Pikachu está sempre comigo!', 'Quer ver o meu time?'],
  2: ['Sou o Brock, líder do ginásio de Pewter.', 'Meus Pokémon de pedra são duros como rocha!', 'Ah, e se precisar de uma receita, sou ótimo cozinheiro.'],
  3: ['Oi! Misty, líder de Cerulian.', 'Pokémon de água são os mais lindos, não acha?', 'Cuidado pra não espantar os Staryu do lago!'],
  4: ['Ha! Lt. Surge, de Vermillion!', 'Meus Pokémon elétricos me salvaram na guerra.', 'Vai encarar um choque de 10.000 volts?'],
  5: ['Olá... sou a Erika.', 'Cuido das flores deste jardim com meus Pokémon de planta.', 'Sinta o perfume e relaxe um pouco.'],
  6: ['Fwahahaha! Koga, mestre ninja.', 'Veneno e ilusão: as armas de um ninja.', 'Você nem me viu chegar, não é?'],
  7: ['Eu sou Sabrina. Já sabia que você viria.', 'Meus Pokémon psíquicos leem a sua mente.', 'Seu próximo passo... vai ser abrir a Pokédex.'],
  8: ['Hah! Blaine, o mestre do fogo!', 'Charada: o que fica mais quente quanto mais você esfria?', 'Errou! Volte quando souber a resposta.'],
  9: ['Giovanni. Líder do ginásio de Viridian.', 'Poder é tudo. Meus Pokémon de terra provam isso.', 'Não conte a ninguém que me viu por aqui.'],
  10: ['Fala, perdedor! Gary Oak, o próximo campeão.', 'Meu time é mais forte que o seu, pode apostar.', 'Smell ya later!'],
  11: ['Prepare-se para a encrenca!', 'E encrenca em dobro! Somos a Equipe Rocket!', 'Shhh... estamos escondidos nos arbustos.'],
  12: ['Sou Lance, mestre dos dragões.', 'Dragões são criaturas lendárias e quase invencíveis.', 'Treine bastante e nos enfrentaremos na Liga.'],
}
