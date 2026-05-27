import { authClient } from './axiosClient'

export const getRatingSummary = (tmdbId, mediaType) =>
  authClient.get(`/api/reviews/${tmdbId}/summary`, { params: { mediaType } })

export const upsertRating = (tmdbId, mediaType, stars) =>
  authClient.put(`/api/reviews/${tmdbId}`, { mediaType, stars })
