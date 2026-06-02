import {
  getDetailEpisodes,
  getImagesPopular,
  getMediaDetail,
  getMediasAnime,
  getMediasPopular,
  getMediasReleased,
  getMediasTopRated,
  getMediasTrailer,
  getMediasSearch,
  getMoviesList,
  getTVShowsList,
  getTVGenres,
  getMovieGenres,
} from '../services/media.service.js'
import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'

export const getSearch = catchAsync(async (req, res) => {
  const { q } = req.query
  if (!q) return res.status(StatusCodes.OK).json([])
  const data = await getMediasSearch(q)
  res.status(StatusCodes.OK).json(data)
})

export const getImages = catchAsync(async (req, res) => {
  const { id } = req.params
  const type = req.query.type
  const data = await getImagesPopular(type, id)
  res.status(StatusCodes.OK).json(data)
})
export const getDetail = catchAsync(async (req, res) => {
  const { id } = req.params
  const type = req.query.type
  const data = await getMediaDetail(id, type)
  res.status(StatusCodes.OK).json(data)
})
export const getEpisodes = catchAsync(async (req, res) => {
  const { id } = req.params
  const season = req.query.season || 1
  const data = await getDetailEpisodes(id, season)
  res.status(200).json(data)
})

export const getPopulars = catchAsync(async (req, res) => {
  const data = await getMediasPopular()
  res.status(StatusCodes.OK).json(data)
})

export const getTrailers = catchAsync(async (req, res) => {
  const { id } = req.params
  const type = req.query.type || 'movie'
  const data = await getMediasTrailer(id, type)
  res.status(StatusCodes.OK).json(data)
})

export const getReleases = catchAsync(async (req, res) => {
  const data = await getMediasReleased()
  res.status(StatusCodes.OK).json(data)
})
export const getTopRates = catchAsync(async (req, res) => {
  const data = await getMediasTopRated()
  res.status(StatusCodes.OK).json(data)
})
export const getAnimes = catchAsync(async (req, res) => {
  const data = await getMediasAnime()
  res.status(StatusCodes.OK).json(data)
})

export const getMovies = catchAsync(async (req, res) => {
  // Lấy thêm genres và minRating từ query params của url
  const { page = 1, year, genres, minRating } = req.query

  const filters = {
    year: year ? parseInt(year) : null,
    genres: genres
      ? Array.isArray(genres)
        ? genres.map(Number)
        : [parseInt(genres)]
      : [],
    minRating: minRating ? parseFloat(minRating) : 0,
  }

  // Truyền full object filters vào getMoviesList
  const data = await getMoviesList(parseInt(page), filters)
  res.status(StatusCodes.OK).json(data)
})

export const getTVShows = catchAsync(async (req, res) => {
  const { page = 1, year, genres, minRating } = req.query
  const filters = {
    year: year ? parseInt(year) : null,
    genres: genres
      ? Array.isArray(genres)
        ? genres.map(Number)
        : [parseInt(genres)]
      : [],
    minRating: minRating ? parseFloat(minRating) : 0,
  }
  const data = await getTVShowsList(parseInt(page), filters)
  res.status(StatusCodes.OK).json(data)
})

export const getGenresTv = catchAsync(async (req, res) => {
  const data = await getTVGenres()
  res.status(StatusCodes.OK).json(data)
})

export const getGenresMovie = catchAsync(async (req, res) => {
  const data = await getMovieGenres()
  res.status(StatusCodes.OK).json(data)
})