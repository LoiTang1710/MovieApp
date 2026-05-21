import {
  getAnimeMovies,
  getMoviesVideoTrailer,
  getPopularMovies,
  getReleasedMovies,
  getTopRatedMovies,
} from '../services/movie.service.js'
import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'

export const getPopular = catchAsync(async (req, res) => {
  const data = await getPopularMovies()
  res.status(StatusCodes.OK).json(data)
})

export const getTrailer = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = await getMoviesVideoTrailer(id)
  res.status(StatusCodes.OK).json(data)
})

export const getReleased = catchAsync(async (req, res) => {
  const data = await getReleasedMovies()
  res.status(StatusCodes.OK).json(data)
})

export const getTopRated = catchAsync(async (req, res) => {
  const data = await getTopRatedMovies()
  res.status(StatusCodes.OK).json(data)
})

export const getAnime = catchAsync(async (req, res) => {
  const data = await getAnimeMovies()
  res.status(StatusCodes.OK).json(data)
})
