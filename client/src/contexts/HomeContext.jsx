/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export const HomeContext = createContext({})

export const HomeProvider = ({ children }) => {
  const [loved, setLoved] = useState(false)
  const [mediaBanner, setMediaBanner] = useState([])
  const [mediasPopular, setMediasPopular] = useState([])
  const [mediasReleased, setMediasReleased] = useState([])
  const [mediasWatching, setMediasWatching] = useState([])
  const [mediasTopRated, setMediasTopRated] = useState([])
  const [mediasAnime, setMediasAnime] = useState([])
  const [activeMediaId, setActiveMediaId] = useState()
  const [bannerTrailers, setBannerTrailers] = useState({})

  useEffect(() => {
    const fetchPopularData = async () => {
      try {
        const server_url = import.meta.env.VITE_SERVER_URL
        const option = {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        }
        const [resPopular, resReleased, resTopRated, resAnime] =
          await Promise.all([
            fetch(`${server_url}/api/medias/popular`, option),
            fetch(`${server_url}/api/medias/released`, option),
            fetch(`${server_url}/api/medias/top_rated`, option),
            fetch(`${server_url}/api/medias/anime`, option),
          ])

        if (
          !resPopular.ok ||
          !resReleased.ok ||
          !resTopRated.ok ||
          !resAnime.ok
        )
          throw new Error(`HTTP error!`)

        const [dataPopular, dataReleased, dataTopRated, dataAnime] =
          await Promise.all([
            resPopular.json(),
            resReleased.json(),
            resTopRated.json(),
            resAnime.json(),
          ])
          console.log("dataReleased: ", dataReleased)
          console.log("dataTopRated: ", dataTopRated)
        const popularResults = dataPopular || []
        const highRatedMedia = popularResults.filter(
          (movie) => movie.vote_average >= 7,
        )
        const sortedMedia = highRatedMedia.sort(
          (a, b) => b.vote_average - a.vote_average,
        )
        const bannerMedias = sortedMedia.slice(0, 4)
        const bannedIds = bannerMedias.map((movie) => movie.id)

        setMediaBanner(bannerMedias)
        if (bannerMedias.length > 0) {
          setActiveMediaId(bannerMedias[0].id)
        }
        setMediasPopular(
          popularResults
            .filter((movie) => !bannedIds.includes(movie.id))
            .sort((a, b) => b.vote_average - a.vote_average)
            .slice(0, 12),
        )
        // console.log("dataReleased: ", dataReleased.results)
        setMediasReleased(dataReleased.slice(0, 12))
        setMediasTopRated(dataTopRated.slice(0, 12))
        setMediasAnime(dataAnime.slice(0, 12))
      } catch (error) {
        console.error('Lỗi khi fetch và xử lý phim:', error)
      }
    }

    fetchPopularData()
  }, [])

  useEffect(() => {
    if (mediaBanner.length === 0) return
    // Check if we already have trailers for the current banner movies
    const missingTrailers = mediaBanner.some(
      (movie) => bannerTrailers[movie.id] === undefined,
    )
    if (!missingTrailers) return

    const fetchBannerTrailers = async () => {
      try {
        const fetchPromiseTrailers = mediaBanner.map((movie) =>
          fetch(
            `${import.meta.env.VITE_SERVER_URL}/api/medias/trailer/${movie.id}?type=${movie.type}`,
            {
              method: 'GET',
              headers: {
                accept: 'application/json',
              },
            },
          ),
        )
        const response = await Promise.all(fetchPromiseTrailers)
        // console.log('response: ', response)

        const data = await Promise.all(
          response.map((res) => {
            if (!res.ok)
              throw new Error('Lỗi khi fetch một trong các trailer banner')
            return res.json()
          }),
        )
        // console.log("data: ", data)
        const trailersMap = {}
        data.forEach((item, index) => {
          // console.log('item: ', item)
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
        setBannerTrailers(trailersMap)
      } catch (error) {
        console.log(error)
      }
    }
    fetchBannerTrailers()
  }, [mediaBanner, bannerTrailers])
  return (
    <HomeContext.Provider
      value={{
        mediaBanner,
        setMediaBanner,
        activeMediaId,
        loved,
        setLoved,
        bannerTrailers,
        setMediasWatching,
        mediasPopular,
        mediasReleased,
        mediasTopRated,
        mediasAnime,
        mediasWatching,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}
export const useHome = () => {
  return useContext(HomeContext)
}
