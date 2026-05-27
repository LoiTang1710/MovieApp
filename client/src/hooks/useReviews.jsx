import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRatingSummary, upsertRating } from '../api/review.api'

export function useRatingSummary(tmdbId, mediaType) {
  return useQuery({
    queryKey: ['reviews', 'summary', tmdbId, mediaType],
    queryFn: async () => {
      const res = await getRatingSummary(tmdbId, mediaType)
      return res.data.data
    },
    enabled: !!tmdbId && !!mediaType,
  })
}

export function useUpsertRating(tmdbId, mediaType) {
  const queryClient = useQueryClient()
  const id = Number(tmdbId)

  return useMutation({
    mutationFn: (stars) => upsertRating(id, mediaType, stars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'summary', tmdbId, mediaType] })
    },
  })
}
