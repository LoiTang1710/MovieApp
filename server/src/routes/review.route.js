import express from 'express'
import { verifyUserSession, optionalVerifyUserSession } from '../middlewares/userAuth.middleware.js'
import { getSummary, upsertRating } from '../controllers/review.controller.js'

const router = express.Router()

router.get('/:tmdbId/summary', optionalVerifyUserSession, getSummary)
router.put('/:tmdbId', verifyUserSession, upsertRating)

export default router
