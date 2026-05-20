import {
  getMoviesVideoTrailer,
  getPopularMovies,
  getReleasedMovies,
} from '../services/movie.service.js'
import { StatusCodes } from 'http-status-codes'

export const getPopular = async (req, res) => {
  try {
    const data = await getPopularMovies()
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error at getPopularMovies', message: error.message })
  }
}
export const getTrailer = async (req, res) => {
  try {
    const { id } = req.params
    const data = await getMoviesVideoTrailer(id)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error at getMoviesVideoTrailer', message: error.message })
  }
}
export const getReleased = async (req, res) => {
  try {
    const data = await getReleasedMovies()
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    console.error(error)
     res
       .status(StatusCodes.INTERNAL_SERVER_ERROR)
       .json({
         error: 'Internal Server Error at getReleasedMovies',
         message: error.message,
       })
  }
}
