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
export const getEpisodes = catchAsync(async(req,res) => {
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
  const { page = 1, year } = req.query
  const data = await getMoviesList(parseInt(page), year ? parseInt(year) : null)
  res.status(StatusCodes.OK).json(data)
})
