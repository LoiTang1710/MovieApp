import * as myListService from '../services/collection.service.js'
import { catchAsync } from '../utils/catchAsync.js' // Nhớ điều chỉnh lại đường dẫn cho đúng với project của bạn

export const getCollections = catchAsync(async (req, res) => {
  const userId = req.session.user.id

  const collections = await myListService.getUserCollections(userId)
  res.json(collections)
})

export const getCollectionMovies = catchAsync(async (req, res) => {
  const { collectionId } = req.params
  const userId = req.session.user.id

  const movies = await myListService.getMoviesInCollection(collectionId, userId)
  res.json(movies)
})

export const createCollection = catchAsync(async (req, res) => {
  const userId = req.session.user.id
  const { collectionName, iconKey } = req.body

  const newCollection = await myListService.createCollection(
    userId,
    collectionName,
    iconKey,
  )
  res.status(201).json(newCollection)
})

export const deleteCollection = catchAsync(async (req, res) => {
  const { collectionId } = req.params
  const userId = req.session.user.id

  await myListService.deleteCollection(collectionId, userId)
  res.json({ message: 'Đã xóa thành công' })
})

export const toggleLike = catchAsync(async (req, res) => {
  const { movieId } = req.params
  const userId = req.session.user.id
  const movieData = req.body // Gồm title, posterPath, rating, year

  const result = await myListService.toggleFavouriteMovie(
    userId,
    movieId,
    movieData,
  )
  res.json(result)
})
