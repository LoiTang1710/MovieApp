import express from 'express'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { optionalVerifyToken } from '../middlewares/optionalAuth.middleware.js'
import { getSummary, upsertRating } from '../controllers/review.controller.js'

const router = express.Router()

router.get('/:tmdbId/summary', optionalVerifyToken, getSummary)
router.put('/:tmdbId', verifyToken, upsertRating)

export default router
