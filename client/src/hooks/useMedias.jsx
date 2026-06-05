import { useQuery } from '@tanstack/react-query'
import { mediaClient } from '../api/axiosClient'

export function useMedias() {
  const MediasCollectionQuery = useQuery({
    queryKey: ['medias'],
    retry: 2,
    queryFn: async () => {
      const [resPopular, resReleased, resTopRated, resAnime] =
        await Promise.all([
          mediaClient.get('/medias/popular'),
          mediaClient.get('/medias/released'),
          mediaClient.get('/medias/top_rated'),
          mediaClient.get('/medias/anime'),
        ])
      const popularResults = Array.isArray(resPopular.data) ? resPopular.data : []
      const released = Array.isArray(resReleased.data) ? resReleased.data : []
      const topRated = Array.isArray(resTopRated.data) ? resTopRated.data : []
      const anime = Array.isArray(resAnime.data) ? resAnime.data : []

      const highRatedMedia = popularResults.filter(
        (movie) => (movie.vote_average ?? 0) >= 7,
      )
      const sortedMedia = [...highRatedMedia].sort(
        (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0),
      )
      const mediaBanner = sortedMedia.length > 0
        ? sortedMedia.slice(0, 4)
        : [...popularResults]
            .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
            .slice(0, 4)
      const bannedIds = mediaBanner.map((movie) => movie.id)
      return {
        mediaBanner,
        mediasPopular: popularResults
          .filter((movie) => !bannedIds.includes(movie.id))
          .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
          .slice(0, 12),
        mediasReleased: released.slice(0, 12),
        mediasTopRated: topRated.slice(0, 12),
        mediasAnime: anime.slice(0, 12),
      }
    },
    staleTime: 5*  60 * 1000,
  })
  const mediaBanner = MediasCollectionQuery.data?.mediaBanner || []
  const MediaTrailersQuery = useQuery({
    queryKey: ['medias', 'trailers', mediaBanner.map((m) => m.id)],
    queryFn: async () => {
      const response = await Promise.all(
        mediaBanner.map((meida) =>
          mediaClient.get(`/medias/trailer/${meida.id}`, {
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
    enabled: mediaBanner.length > 0,
    // staleTime: 60 * 1000,
  })
  const MediaLogosQuery = useQuery({
    queryKey: ['medias', 'logos', mediaBanner.map((m) => m.id)],
    queryFn: async () => {
      const response = await Promise.all(
        mediaBanner.map((media) =>
          mediaClient.get(`/medias/images/${media.id}`, {
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
    enabled: mediaBanner.length > 0
  })
  return {
    mediasCollection: MediasCollectionQuery.data || {},
    bannerTrailers: MediaTrailersQuery.data || {},
    bannerLogos: MediaLogosQuery.data || [],
    isLoading: MediasCollectionQuery.isLoading,
    isError: MediasCollectionQuery.isError,
    error: MediasCollectionQuery.error,
  }
}
