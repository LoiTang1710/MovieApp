import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { mediaClient } from "../api/axiosClient"

export const useTvEpisodes = (mediaId, type, seasonNumber) => {
    return useQuery({
      queryKey: ['tv', 'episodes', mediaId, seasonNumber],
      queryFn: async() => {
        const res = await mediaClient.get(`/api/medias/tv/${mediaId}/episodes`, {params: {season: seasonNumber}})
        return res.data
      },
      enabled: type === 'tv' && !!mediaId,
      placeholderData: keepPreviousData,
      select: (data) => {
        const episodes = data?.episodes || []
        const sortedAsc = [...episodes].sort((a,b) => a.episode_number - b.episode_number)
        const CHUNK_SIZE = 50
        const chunks = []
        for(let i = 0; i < sortedAsc.length; i+= CHUNK_SIZE){
            chunks.push(sortedAsc.slice(i,i + CHUNK_SIZE))
        }
        return { ...data, chunkedEpisodes: chunks }
      }
    })
}