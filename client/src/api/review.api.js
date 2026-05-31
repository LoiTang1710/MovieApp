import { authClient } from './axiosClient'

export const getRatingSummary = (tmdbId, mediaType) =>
  authClient.get(`/reviews/${tmdbId}/summary`, { params: { mediaType } })

export const upsertRating = (tmdbId, mediaType, stars) =>
  authClient.put(`/reviews/${tmdbId}`, { mediaType, stars })
