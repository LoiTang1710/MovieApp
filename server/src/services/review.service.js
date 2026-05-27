import prisma from '../config/database.config.js'
import { AppError } from '../utils/AppError.js'
import { StatusCodes } from 'http-status-codes'
import { validateMediaType, validateStars } from './moderation.service.js'

const recalculateStats = async (tmdbId, mediaType) => {
  const agg = await prisma.mediaRating.aggregate({
    where: { tmdbId, mediaType },
    _avg: { stars: true },
    _count: { stars: true },
  })

  const averageStars = Math.round((agg._avg.stars ?? 0) * 10) / 10
  const totalRatings = agg._count.stars ?? 0

  return prisma.mediaRatingStats.upsert({
    where: { tmdbId_mediaType: { tmdbId, mediaType } },
    update: { averageStars, totalRatings },
    create: { tmdbId, mediaType, averageStars, totalRatings },
  })
}

export const upsertRating = async (userId, tmdbId, mediaType, starsInput) => {
  validateMediaType(mediaType)
  const stars = validateStars(starsInput)
  const tmdbIdNum = Number(tmdbId)

  if (!Number.isInteger(tmdbIdNum) || tmdbIdNum <= 0) {
    throw new AppError('tmdbId không hợp lệ.', StatusCodes.BAD_REQUEST, 'INVALID_TMDB_ID')
  }

  const rating = await prisma.mediaRating.upsert({
    where: {
      userId_tmdbId_mediaType: { userId, tmdbId: tmdbIdNum, mediaType },
    },
    update: { stars },
    create: { userId, tmdbId: tmdbIdNum, mediaType, stars },
  })

  const stats = await recalculateStats(tmdbIdNum, mediaType)

  return {
    stars: rating.stars,
    averageStars: stats.averageStars,
    totalRatings: stats.totalRatings,
  }
}

export const getRatingSummary = async (tmdbId, mediaType, userId = null) => {
  validateMediaType(mediaType)
  const tmdbIdNum = Number(tmdbId)

  if (!Number.isInteger(tmdbIdNum) || tmdbIdNum <= 0) {
    throw new AppError('tmdbId không hợp lệ.', StatusCodes.BAD_REQUEST, 'INVALID_TMDB_ID')
  }

  const stats = await prisma.mediaRatingStats.findUnique({
    where: { tmdbId_mediaType: { tmdbId: tmdbIdNum, mediaType } },
  })

  let userRating = null
  if (userId) {
    const mine = await prisma.mediaRating.findUnique({
      where: {
        userId_tmdbId_mediaType: { userId, tmdbId: tmdbIdNum, mediaType },
      },
    })
    userRating = mine?.stars ?? null
  }

  return {
    averageStars: stats?.averageStars ?? 0,
    totalRatings: stats?.totalRatings ?? 0,
    userRating,
  }
}
