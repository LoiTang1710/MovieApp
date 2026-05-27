import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'
import * as reviewService from '../services/review.service.js'

export const upsertRating = catchAsync(async (req, res) => {
  const { tmdbId } = req.params
  const { mediaType, stars } = req.body
  const data = await reviewService.upsertRating(req.user.id, tmdbId, mediaType, stars)
  res.status(StatusCodes.OK).json({ message: 'Đánh giá thành công.', data })
})

export const getSummary = catchAsync(async (req, res) => {
  const { tmdbId } = req.params
  const { mediaType } = req.query

  if (!mediaType) {
    throw new AppError(
      'Thiếu mediaType trong query.',
      StatusCodes.BAD_REQUEST,
      'MISSING_MEDIA_TYPE',
    )
  }

  const data = await reviewService.getRatingSummary(tmdbId, mediaType, req.user?.id)
  res.status(StatusCodes.OK).json({ data })
})
