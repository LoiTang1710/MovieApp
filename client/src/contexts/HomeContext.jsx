/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export const HomeContext = createContext({})

export const HomeProvider = ({ children }) => {
  const [loved, setLoved] = useState(false)
  const [moviesBanner, setMoviesBanner] = useState([])
  const [moviesPopular, setMoviesPopular] = useState([])
  const [moviesReleased, setMoviesReleased] = useState([])
  const [moviesWatching, setMoviesWatching] = useState([])
  const [moviesTopRated, setMoviesTopRated] = useState([])
  const [moviesAnime, setMoviesAnime] = useState([])
  const [activeMovieId, setActiveMovieId] = useState()
  const [bannerTrailers, setBannerTrailers] = useState({})
  

  useEffect(() => {
    const fetchPopularData = async () => {
      try {
        const [resPopular, resReleased, resTopRated, resAnime] = await Promise.all([
          fetch(`${import.meta.env.VITE_SERVER_URL}/api/movies/popular`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
            },
          }),
          fetch(`${import.meta.env.VITE_SERVER_URL}/api/movies/released`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
            },
          }),
          fetch(`${import.meta.env.VITE_SERVER_URL}/api/movies/toprated`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
            },
          }),
          fetch(`${import.meta.env.VITE_SERVER_URL}/api/movies/anime`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
            },
          }),
        ])
        // console.log("resPopular: ", resPopular)
        // Phòng thủ: Nếu response không thành công (ví dụ lỗi 404, 500) thì dừng lại luôn
        if (!resPopular.ok || !resReleased.ok || !resTopRated.ok || !resAnime.ok) throw new Error(`HTTP error!`)

        const [dataPopular, dataReleased, dataTopRated, dataAnime] = await Promise.all([
          resPopular.json(),
          resReleased.json(),
          resTopRated.json(),
          resAnime.json()
        ])

        // 2. Kiểm tra dữ liệu an toàn trước khi xử lý mảng để tránh crash app
        const popularResults = dataPopular?.results || []

        const highRatedMovies = popularResults.filter(
          (movie) => movie.vote_average >= 7,
        )
        const sortedMovies = highRatedMovies.sort(
          (a, b) => b.vote_average - a.vote_average,
        )
        const bannerMovies = sortedMovies.slice(0, 4)

        // 4. Xử lý lấy danh sách Phim Phổ biến (Lọc bỏ các phim đã lên Banner, lấy 12 phim)
        const bannedIds = bannerMovies.map((movie) => movie.id)
        const popularCardMovies = popularResults
          .filter((movie) => !bannedIds.includes(movie.id))
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 12)

        setMoviesBanner(bannerMovies)
        if (bannerMovies.length > 0) {
          setActiveMovieId(bannerMovies[0].id)
        }
        setMoviesPopular(popularCardMovies)
        setMoviesReleased(dataReleased.results.slice(0, 12))
        setMoviesTopRated(dataTopRated.results.slice(0,12))
        // console.log("dataTopRated: ", dataTopRated)
        setMoviesAnime(dataAnime.results.slice(0,12))
      } catch (error) {
        console.error('Lỗi khi fetch và xử lý phim:', error)
      }
    }

    fetchPopularData()
  }, [])

  useEffect(() => {
    if (!activeMovieId) return
    const fetchBannerTrailers = async () => {
      try {
        const fetchPromiseTrailers = moviesBanner.map((movie) =>
          fetch(
            `${import.meta.env.VITE_SERVER_URL}/api/movies/trailer/${movie.id}`,
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
            trailersMap[moviesBanner[index].id] = trailerOfficial.key
          } else {
            trailersMap[moviesBanner[index].id] = null
          }
        })
        setBannerTrailers(trailersMap)
      } catch (error) {
        console.log(error)
      }
    }
    fetchBannerTrailers()
  }, [activeMovieId, moviesBanner])
  return (
    <HomeContext.Provider
      value={{
        moviesBanner,
        setMoviesBanner,
        moviesPopular,
        setMoviesPopular,
        activeMovieId,
        setActiveMovieId,
        loved,
        setLoved,
        moviesReleased,
        setMoviesReleased,
        moviesWatching,
        setMoviesWatching,
        moviesTopRated,
        setMoviesTopRated,
        bannerTrailers,
        moviesAnime,
        
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}
export const useHome = () => {
  return useContext(HomeContext)
}
