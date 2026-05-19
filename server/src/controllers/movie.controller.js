import { getMoviesVideoTrailer, getPopularMovies } from '../services/movie.service.js'
import { StatusCodes } from 'http-status-codes'

export const getPopular = async (req, res) => {
  try {
    const data = await getPopularMovies()
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error', message: error.message })
  }
}
export const getTrailer = async(req, res) => {
  try {
    const { id } = req.params;
    const data = await getMoviesVideoTrailer(id)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Internal Server Error', message: error.message})
  }
}