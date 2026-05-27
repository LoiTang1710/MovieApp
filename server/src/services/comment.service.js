import prisma from '../config/database.config.js'
import { AppError } from '../utils/AppError.js'
import { StatusCodes } from 'http-status-codes'
import { validateCommentContent, validateMediaType } from './moderation.service.js'
import { formatUserPublic } from '../utils/formatUser.js'

const parseTmdbId = (tmdbId) => {
  const tmdbIdNum = Number(tmdbId)
  if (!Number.isInteger(tmdbIdNum) || tmdbIdNum <= 0) {
    throw new AppError('tmdbId không hợp lệ.', StatusCodes.BAD_REQUEST, 'INVALID_TMDB_ID')
  }
  return tmdbIdNum
}

const formatComment = (comment, userId, likedCommentIds = new Set()) => ({
  id: comment.id,
  content: comment.content,
  likeCount: comment.likeCount,
  likedByMe: likedCommentIds.has(comment.id),
  createdAt: comment.createdAt,
  user: formatUserPublic(comment.user),
  replies: (comment.replies || []).map((reply) =>
    formatComment(reply, userId, likedCommentIds),
  ),
})

export const createComment = async (userId, { tmdbId, mediaType, content }) => {
  validateMediaType(mediaType)
  const tmdbIdNum = parseTmdbId(tmdbId)
  const trimmed = await validateCommentContent(userId, content)

  const comment = await prisma.comment.create({
    data: {
      userId,
      tmdbId: tmdbIdNum,
      mediaType,
      content: trimmed,
    },
    include: { user: true },
  })

  return formatComment(comment, userId)
}

export const createReply = async (userId, parentId, content) => {
  const trimmed = await validateCommentContent(userId, content)

  const parent = await prisma.comment.findFirst({
    where: {
      id: parentId,
      status: 'APPROVED',
      parentId: null,
    },
  })

  if (!parent) {
    throw new AppError('Bình luận gốc không tồn tại.', StatusCodes.NOT_FOUND, 'PARENT_NOT_FOUND')
  }

  const reply = await prisma.comment.create({
    data: {
      userId,
      tmdbId: parent.tmdbId,
      mediaType: parent.mediaType,
      content: trimmed,
      parentId: parent.id,
    },
    include: { user: true },
  })

  return formatComment(reply, userId)
}

export const listComments = async (tmdbId, mediaType, { page = 1, limit = 20, userId = null }) => {
  validateMediaType(mediaType)
  const tmdbIdNum = parseTmdbId(tmdbId)
  const pageNum = Math.max(1, Number(page) || 1)
  const take = Math.min(Math.max(1, Number(limit) || 20), 50)
  const skip = (pageNum - 1) * take

  const where = {
    tmdbId: tmdbIdNum,
    mediaType,
    parentId: null,
    status: 'APPROVED',
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        user: true,
        replies: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'asc' },
          include: { user: true },
        },
      },
    }),
    prisma.comment.count({ where }),
  ])

  let likedCommentIds = new Set()
  if (userId && comments.length > 0) {
    const allIds = comments.flatMap((c) => [c.id, ...c.replies.map((r) => r.id)])
    const likes = await prisma.commentLike.findMany({
      where: { userId, commentId: { in: allIds } },
      select: { commentId: true },
    })
    likedCommentIds = new Set(likes.map((l) => l.commentId))
  }

  return {
    items: comments.map((c) => formatComment(c, userId, likedCommentIds)),
    pagination: {
      page: pageNum,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  }
}

export const toggleLike = async (userId, commentId) => {
  const comment = await prisma.comment.findFirst({
    where: { id: commentId, status: 'APPROVED' },
  })

  if (!comment) {
    throw new AppError('Bình luận không tồn tại.', StatusCodes.NOT_FOUND, 'COMMENT_NOT_FOUND')
  }

  const existing = await prisma.commentLike.findUnique({
    where: { userId_commentId: { userId, commentId } },
  })

  if (existing) {
    await prisma.$transaction([
      prisma.commentLike.delete({ where: { id: existing.id } }),
      prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } },
      }),
    ])
    return { liked: false, likeCount: Math.max(0, comment.likeCount - 1) }
  }

  await prisma.$transaction([
    prisma.commentLike.create({ data: { userId, commentId } }),
    prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    }),
  ])

  return { liked: true, likeCount: comment.likeCount + 1 }
}

export const deleteCommentByAdmin = async (commentId) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })

  if (!comment) {
    throw new AppError('Bình luận không tồn tại.', StatusCodes.NOT_FOUND, 'COMMENT_NOT_FOUND')
  }

  await prisma.comment.updateMany({
    where: {
      OR: [{ id: commentId }, { parentId: commentId }],
    },
    data: { status: 'DELETED' },
  })

  return { id: commentId, status: 'DELETED' }
}
