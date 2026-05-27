import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'
import * as commentService from '../services/comment.service.js'

export const createComment = catchAsync(async (req, res) => {
  const data = await commentService.createComment(req.user.id, req.body)
  res.status(StatusCodes.CREATED).json({ message: 'Đã đăng bình luận.', data })
})

export const createReply = catchAsync(async (req, res) => {
  const { parentId } = req.params
  const { content } = req.body
  const data = await commentService.createReply(req.user.id, parentId, content)
  res.status(StatusCodes.CREATED).json({ message: 'Đã trả lời bình luận.', data })
})

export const listComments = catchAsync(async (req, res) => {
  const { tmdbId, mediaType, page, limit } = req.query

  if (!tmdbId || !mediaType) {
    throw new AppError(
      'Thiếu tmdbId hoặc mediaType trong query.',
      StatusCodes.BAD_REQUEST,
      'MISSING_QUERY_PARAMS',
    )
  }

  const data = await commentService.listComments(tmdbId, mediaType, {
    page,
    limit,
    userId: req.user?.id,
  })
  res.status(StatusCodes.OK).json({ data })
})

export const toggleLike = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = await commentService.toggleLike(req.user.id, id)
  res.status(StatusCodes.OK).json({ data })
})
