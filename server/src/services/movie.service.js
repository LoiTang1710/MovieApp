import { env } from '../config/environment.config.js'

const tmdbFetch = async (endpoint, option) => {
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
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => new Error(`TMDB API Error: ${err}`))

  const data = await response.json()
  return data
}

export const getPopularMovies = () => {
  return tmdbFetch('/movie/popular?language=vi-VN')
}
export const getMoviesVideoTrailer = async (movieId) => {
  return tmdbFetch(`/movie/${movieId}/videos?language=en-US`)
}
export const getReleasedMovies = async () => {
  return tmdbFetch('/movie/now_playing?language=vi-VN')
}
export const getTopRatedMovies = async () => {
  return tmdbFetch('/movie/top_rated?language=vi-VN')
}
export const getAnime = async () => {
  return tmdbFetch(
    '/discover/tv?&with_original_language=zh&with_genres=16&sort_by=popularity.desc&language=vi-VN',
  )
}
