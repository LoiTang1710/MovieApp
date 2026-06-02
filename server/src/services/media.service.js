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

export const getMediasSearch = async (query) => {
  return tmdbFetchAll(
    `/search/movie?query=${encodeURIComponent(query)}&language=vi-VN`,
    `/search/tv?query=${encodeURIComponent(query)}&language=vi-VN`,
  )
}

export const getMoviesList = async (page = 1, filters = {}) => {
  const pageSize = 20
  const { year = null, genres = [], minRating = 0 } = filters

  // Chỉ gọi /discover/movie
  let baseUrl = `/discover/movie?language=vi-VN&sort_by=popularity.desc&page=${page}&vote_average.gte=${minRating}`

  if (year) {
    baseUrl += `&primary_release_year=${year}`
  }

  if (genres.length > 0) {
    baseUrl += `&with_genres=${genres.join('|')}`
  }

  const movieData = await tmdbFetch(baseUrl)
  const results = (movieData.results || []).map((movie) => ({
    ...movie,
    type: 'movie',
  }))

  return {
    results: results.slice(0, pageSize), // TMDB mặc định trả 20, nhưng cứ giữ hàm cắt cho an toàn
    page,
    totalPages: movieData.total_pages || 1,
    totalResults: movieData.total_results || 0,
  }
}

export const getTVShowsList = async (page = 1, filters = {}) => {
  const pageSize = 20
  const { year = null, genres = [], minRating = 0 } = filters

  let baseUrl = `/discover/tv?language=vi-VN&sort_by=popularity.desc&page=${page}&vote_average.gte=${minRating}`

  if (year) {
    baseUrl += `&first_air_date_year=${year}`
  }

  if (genres.length > 0) {
    baseUrl += `&with_genres=${genres.join('|')}`
  }

  const tvData = await tmdbFetch(baseUrl)
  const results = (tvData.results || []).map((tv) => ({ ...tv, type: 'tv' }))

  return {
    results: results.slice(0, pageSize),
    page,
    totalPages: tvData.total_pages || 1,
    totalResults: tvData.total_results || 0,
  }
}

export const getTVGenres = async () => {
  return tmdbFetch('/genre/tv/list?language=vi-VN')
}
export const getMovieGenres = async () => {
  return tmdbFetch('/genre/movie/list?language=vi-VN')
}

