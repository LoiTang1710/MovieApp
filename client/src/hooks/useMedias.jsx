import { useQuery } from '@tanstack/react-query'
import { mediaClient } from '../api/axiosClient'

export function useMedias() {
  const MediasCollectionQuery = useQuery({
    queryKey: ['medias'],
    queryFn: async () => {
      const [resPopular, resReleased, resTopRated, resAnime] =
        await Promise.all([
          mediaClient.get('/api/medias/popular'),
          mediaClient.get('/api/medias/released'),
          mediaClient.get('/api/medias/top_rated'),
          mediaClient.get('/api/medias/anime'),
        ])
      const popularResults = resPopular.data || []
      const highRatedMedia = popularResults.filter(
        (movie) => movie.vote_average >= 7,
      )
      const sortedMedia = highRatedMedia.sort(
        (a, b) => b.vote_average - a.vote_average,
      )
      const mediaBanner = sortedMedia.slice(0, 4)
      const bannedIds = mediaBanner.map((movie) => movie.id)
      return {
        mediaBanner,
        mediasPopular: popularResults
          .filter((movie) => !bannedIds.includes(movie.id))
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 12),
        mediasReleased: resReleased.data.slice(0, 12),
        mediasTopRated: resTopRated.data.slice(0, 12),
        mediasAnime: resAnime.data.slice(0, 12),
      }
    },
    staleTime: 60 * 1000,
  })
  const mediaBanner = MediasCollectionQuery.data?.mediaBanner || []
  const MediaTrailersQuery = useQuery({
    queryKey: ['medias', 'trailers', mediaBanner.map((m) => m.id)],
    queryFn: async () => {
      const response = await Promise.all(
        mediaBanner.map((meida) =>
          mediaClient.get(`/api/medias/trailer/${meida.id}`, {
            params: { type: meida.type },
          }),
        ),
      )
      const trailersMap = {}
      response.forEach((res, index) => {
        const item = res.data
        if (item?.results && item.results.length > 0) {
          const vids = item.results
          const trailerOfficial =
            vids.find(
              (vid) =>
                vid.site === 'YouTube' &&
                vid.type === 'Trailer' &&
                vid.name === 'Official Trailer',
            ) ||
            vids.find(
              (vid) => vid.site === 'YouTube' && vid.type === 'Trailer',
            ) ||
            vids[0]
          trailersMap[mediaBanner[index].id] = trailerOfficial.key
        } else {
          trailersMap[mediaBanner[index].id] = null
        }
      })
      return trailersMap
    },
    staleTime: 60 * 1000,
  })
  const MediaLogosQuery = useQuery({
    queryKey: ['medias', 'logos', mediaBanner.map((m) => m.id)],
    queryFn: async () => {
      const response = await Promise.all(
        mediaBanner.map((media) =>
          mediaClient.get(`/api/medias/images/${media.id}`, {
            params: { type: media.type },
          }),
        ),
      )
      const logosMap = {}
      response.forEach((res, index) => {
        const item = res.data
        if (item?.logos && item.logos.length > 0) {
          logosMap[mediaBanner[index].id] = item.logos[0].file_path
        } else {
          logosMap[mediaBanner[index].id] = null
        }
      })
      return logosMap
    },
  })
  return {
    mediasCollection: MediasCollectionQuery.data || {},
    bannerTrailers: MediaTrailersQuery.data || {},
    bannerLogos: MediaLogosQuery.data || [],
    isLoading: MediasCollectionQuery.isLoading
  }
}
