import prisma from '../config/database.config.js'
import { AppError } from '../utils/AppError.js'
import { StatusCodes } from 'http-status-codes'

const BAD_WORDS = [
  'địt',
  'lồn',
  'cặc',
  'đụ',
  'đéo',
  'vcl',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'damn',
]

const URL_REGEX = /https?:\/\/[^\s]+/gi
const MAX_COMMENTS_PER_MINUTE = 5
const MIN_CONTENT_LENGTH = 3
const MAX_CONTENT_LENGTH = 1000
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000

export const validateMediaType = (mediaType) => {
  if (!['movie', 'tv'].includes(mediaType)) {
    throw new AppError('mediaType phải là movie hoặc tv.', StatusCodes.BAD_REQUEST, 'INVALID_MEDIA_TYPE')
  }
}

export const validateStars = (stars) => {
  const value = Number(stars)
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new AppError('Điểm đánh giá phải từ 1 đến 5 sao.', StatusCodes.BAD_REQUEST, 'INVALID_STARS')
  }
  return value
}

const containsProfanity = (text) => {
  const normalized = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
  return BAD_WORDS.some((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'iu').test(normalized)
  })
}

const countUrls = (text) => (text.match(URL_REGEX) || []).length

export const validateCommentContent = async (userId, content) => {
  const trimmed = content?.trim()

  if (!trimmed || trimmed.length < MIN_CONTENT_LENGTH) {
    throw new AppError(
      `Bình luận phải có ít nhất ${MIN_CONTENT_LENGTH} ký tự.`,
      StatusCodes.BAD_REQUEST,
      'CONTENT_TOO_SHORT',
    )
  }

  if (trimmed.length > MAX_CONTENT_LENGTH) {
    throw new AppError(
      `Bình luận không được vượt quá ${MAX_CONTENT_LENGTH} ký tự.`,
      StatusCodes.BAD_REQUEST,
      'CONTENT_TOO_LONG',
    )
  }

  if (containsProfanity(trimmed)) {
    throw new AppError(
      'Bình luận chứa từ ngữ không phù hợp.',
      StatusCodes.BAD_REQUEST,
      'PROFANITY',
    )
  }

  if (countUrls(trimmed) > 2) {
    throw new AppError('Bình luận chứa quá nhiều liên kết.', StatusCodes.BAD_REQUEST, 'SPAM_LINKS')
  }

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
  const recentCount = await prisma.comment.count({
    where: {
      userId,
      createdAt: { gte: oneMinuteAgo },
      status: { not: 'DELETED' },
    },
  })

  if (recentCount >= MAX_COMMENTS_PER_MINUTE) {
    throw new AppError(
      'Bạn đang gửi bình luận quá nhanh. Vui lòng thử lại sau.',
      StatusCodes.TOO_MANY_REQUESTS,
      'RATE_LIMIT',
    )
  }

  const duplicateSince = new Date(Date.now() - DUPLICATE_WINDOW_MS)
  const duplicate = await prisma.comment.findFirst({
    where: {
      userId,
      content: trimmed,
      createdAt: { gte: duplicateSince },
      status: { not: 'DELETED' },
    },
  })

  if (duplicate) {
    throw new AppError('Bạn đã gửi bình luận tương tự gần đây.', StatusCodes.BAD_REQUEST, 'DUPLICATE')
  }

  return trimmed
}
