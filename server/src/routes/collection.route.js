import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { createCollection, deleteCollection, getCollectionMovies, getCollections, toggleLike } from '../controllers/collection.controller.js'



const router = express.Router()

// GET /api/collections
router.use(isAuthenticated)
router.get('/', getCollections)
router.post('/', createCollection)
router.delete('/:collectionId', deleteCollection)
router.get('/:collectionId/movies', getCollectionMovies)
router.post('/movies/:movieId/favourite', toggleLike)

export default router
