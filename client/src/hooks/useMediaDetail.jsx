import { useQuery } from '@tanstack/react-query'
import { mediaClient } from '../api/axiosClient'

export function useMediaDetails(mediaId, type) {
  return useQuery({
    queryKey: ['media', 'detail', type, mediaId],
    queryFn: async () => {
      const res = await mediaClient.get(`/medias/detail/${mediaId}`, {
        params: {
          type,
        },
      })
      console.log(res.data)
      return res.data
    },
    enabled: !!mediaId && !!type,
  })
}
