import { tmdbFetch } from '../utils/tmdbFetch.js'

const tmdbFetchAll = async (movie_endpoint, tv_endpoint, option) => {
  const [movieData, tvData] = await Promise.all([
    tmdbFetch(movie_endpoint, option),
    tmdbFetch(tv_endpoint, option),
  ])

  const movies = movieData.results.map((movie) => ({ ...movie, type: 'movie' }))
  const tvs = tvData.results.map((tv) => ({ ...tv, type: 'tv' }))

  const combinedData = [...(movies || []), ...(tvs || [])]
  return combinedData.sort((a, b) => b.popularity - a.popularity)
}
export const getImagesPopular = async (type, id) => {
  return tmdbFetch(`/${type}/${id}/images?include_image_language=vi-VN,en-US`)
}
export const getMediaDetail = async (id, type) => {
  return tmdbFetch(`/${type}/${id}?language=vi-VN&append_to_response=credits`)
}
export const getDetailEpisodes = async(id, type, seasonNumber = 1) => {
  return tmdbFetch(`/tv/${id}/season/${seasonNumber}?language=vi-VN`)
}
export const getMediasPopular = async () => {
  return tmdbFetchAll(
    '/movie/popular?language=vi-VN',
    '/tv/popular?language=vi-VN',
  )
}
export const getMediasTrailer = async (id, type) => {
  return tmdbFetch(`/${type}/${id}/videos?language=en-US`)
}
export const getMediasReleased = async () => {
  return tmdbFetchAll(
    '/movie/now_playing?language=vi-VN',
    '/tv/on_the_air?language=vi-VN',
  )
}
export const getMediasTopRated = async () => {
  return tmdbFetchAll(
    '/movie/top_rated?language=vi-VN',
    '/tv/top_rated?language=vi-VN',
  )
}
export const getMediasAnime = async () => {
  return tmdbFetchAll(
    '/discover/movie?&with_original_language=zh&with_genres=16&sort_by=popularity.desc&language=vi-VN',
    '/discover/tv?&with_original_language=zh&with_genres=16&sort_by=popularity.desc&language=vi-VN',
  )
}
