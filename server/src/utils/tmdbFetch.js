import { env } from '../config/environment.config.js'

export const tmdbFetch = async (endpoint, option) => {
  const url = `${env.TMDB_BASE_URL}${endpoint}`
  const defaultOption = {
    ...option,
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
    },
  }
  const response = await fetch(url, defaultOption)
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`)
  }

  const data = await response.json()
  return data
}
