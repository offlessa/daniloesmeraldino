// Mapas dos estados (recortados das artes em public/images/Logos) e as cidades onde há projetos.
// Os desenhos seguem a projeção lat/long simples, então a posição do pin é uma regra de três
// entre os extremos do estado.

export type StateCode = 'SC' | 'RS'

export const STATES: Record<
  StateCode,
  { name: string; image: string; ratio: number; west: number; east: number; north: number; south: number }
> = {
  SC: {
    name: 'Santa Catarina',
    image: '/images/web/mapas/sc.png',
    ratio: 893 / 558,
    west: -53.836,
    east: -48.358,
    north: -25.955,
    south: -29.351,
  },
  RS: {
    name: 'Rio Grande do Sul',
    image: '/images/web/mapas/rs.png',
    ratio: 894 / 756,
    west: -57.643,
    east: -49.691,
    north: -27.082,
    south: -33.751,
  },
}

// [latitude, longitude]
const CITIES: Record<string, [number, number]> = {
  'tubarao-sc': [-28.4667, -49.0069],
  'capivari-de-baixo-sc': [-28.4447, -48.9583],
  'laguna-sc': [-28.4825, -48.7808],
  'pescaria-brava-sc': [-28.3906, -48.8858],
  'jaguaruna-sc': [-28.6147, -49.0258],
  'sangao-sc': [-28.6328, -49.1306],
  'treze-de-maio-sc': [-28.5536, -49.1497],
  'gravatal-sc': [-28.3236, -49.0408],
  'armazem-sc': [-28.2464, -49.0181],
  'braco-do-norte-sc': [-28.2753, -49.1658],
  'imbituba-sc': [-28.24, -48.6703],
  'garopaba-sc': [-28.0275, -48.6192],
  'criciuma-sc': [-28.6775, -49.3697],
  'icara-sc': [-28.7133, -49.3092],
  'urussanga-sc': [-28.5181, -49.3206],
  'cocal-do-sul-sc': [-28.6008, -49.3258],
  'florianopolis-sc': [-27.5954, -48.548],
  'biguacu-sc': [-27.4942, -48.6556],
  'torres-rs': [-29.335, -49.7269],
  'capao-da-canoa-rs': [-29.7456, -50.0097],
  'xangri-la-rs': [-29.8064, -50.0519],
  'porto-alegre-rs': [-30.0346, -51.2177],
  'gramado-rs': [-29.3789, -50.8739],
  'caxias-do-sul-rs': [-29.1678, -51.1794],
}

export const DEFAULT_LOCATION = 'Tubarão, SC'

const key = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')

/** "Tubarão, SC" → estado, cidade e posição do pin em % sobre o desenho do estado. */
export function locate(location: string) {
  const [city, uf] = location.split(/\s*[,/-]\s*(?=[A-Za-z]{2}$)/)
  const state = STATES[(uf ?? '').toUpperCase() as StateCode]
  const coords = CITIES[`${key(city)}-${key(uf ?? '')}`]
  if (!state || !coords) return null
  const [lat, lon] = coords
  return {
    city: city.trim(),
    state,
    x: ((lon - state.west) / (state.east - state.west)) * 100,
    y: ((state.north - lat) / (state.north - state.south)) * 100,
  }
}
