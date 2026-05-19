/* eslint-disable no-useless-catch */
import { env } from '../config/environment.config.js'

export const getPopularMovies = async () => {
  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/popular', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
      },
    })
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}
export const getMoviesVideoTrailer = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
        },
      },
    )
    if(!response.ok){
       throw new Error(`TMDB API Error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}
