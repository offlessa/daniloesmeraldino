// Cidades das obras. O mapa da região (src/data/regionMap.json, malha de municípios do IBGE
// de Porto Alegre a Itajaí) é gerado em projeção lat/long simples: a posição do pin é uma
// conta direta a partir da latitude e longitude da sede da cidade.

export const STATE_NAMES: Record<string, string> = { SC: 'Santa Catarina', RS: 'Rio Grande do Sul' }

// Sede das cidades: [latitude, longitude]. Cidade da região sem coordenada aqui ganha o
// pin no meio do município.
export const CITIES: Record<string, [number, number]> = {
  'tubarao-sc': [-28.4667, -49.0069],
  'capivari-de-baixo-sc': [-28.4447, -48.9583],
  'laguna-sc': [-28.4825, -48.7808],
  'pescaria-brava-sc': [-28.3906, -48.8858],
  'jaguaruna-sc': [-28.6147, -49.0258],
  'sangao-sc': [-28.6328, -49.1306],
  'treze-de-maio-sc': [-28.5536, -49.1497],
  'gravatal-sc': [-28.3236, -49.0408],
  'pedras-grandes-sc': [-28.4344, -49.1872],
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
  'antonio-carlos-sc': [-27.5172, -48.7661],
  'itajai-sc': [-26.9078, -48.6619],
  'blumenau-sc': [-26.9194, -49.0661],
  'lages-sc': [-27.8161, -50.3261],
  'torres-rs': [-29.335, -49.7269],
  'capao-da-canoa-rs': [-29.7456, -50.0097],
  'xangri-la-rs': [-29.8064, -50.0519],
  'osorio-rs': [-29.8869, -50.2697],
  'porto-alegre-rs': [-30.0346, -51.2177],
  'viamao-rs': [-30.0811, -51.0233],
  'gramado-rs': [-29.3789, -50.8739],
  'caxias-do-sul-rs': [-29.1678, -51.1794],
}

export const DEFAULT_LOCATION = 'Tubarão, SC'

export const cityKey = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')

/** "Tubarão, SC" → cidade, estado e a chave usada no mapa ("tubarao-sc"). */
export function parseLocation(location: string) {
  const [city, uf = ''] = location.split(/\s*[,/-]\s*(?=[A-Za-z]{2}$)/)
  const state = uf.toUpperCase()
  if (!STATE_NAMES[state]) return null
  return { city: city.trim(), state: STATE_NAMES[state], key: `${cityKey(city)}-${cityKey(uf)}` }
}
