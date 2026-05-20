import { env } from '../config/environment.config.js'

const tmdbFetch = async (endpoint,option) => {
  const url = `${env.TMDB_BASE_URL}${endpoint}`
  const defaultOption = {
    ...option,
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
      ...option.headers,
    },
  }
  const response = await fetch(url, defaultOption)
   if (!response.ok) {
     throw new Error(`TMDB API Error: ${response.status}`)
   }

   const data = await response.json()
   return data
}



export const getPopularMovies =  () => {
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

