import { useQuery } from '@tanstack/react-query'
import { mediaClient } from '../api/axiosClient'

export function useSearch(query) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return []
      const response = await mediaClient.get('/medias/search', {
        params: { q: query },
      })
      return response.data
    },
    enabled: !!query,
    staleTime: 60 * 1000,
  })
}
