import { useQuery } from "@tanstack/react-query"
import { mediaClient } from "../api/axiosClient"

export const useTvEpisodes = (mediaId, type, seasonNumber) => {
    return useQuery({
      queryKey: ['tv', 'episodes', mediaId, seasonNumber],
      queryFn: async() => {
        const res = await mediaClient.get(`/api/medias/tv/${mediaId}/episodes`, {params: {season: seasonNumber}})
        return res.data
      },
      enabled: type === 'tv' && !!mediaId
    })
}