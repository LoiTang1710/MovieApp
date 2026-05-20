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
  const [activeMovieId, setActiveMovieId] = useState()
  const [movieTrailer, setMovieTrailer] = useState(null)

  useEffect(() => {
    const fetchPopularData = async () => {
      try {
        const [resPopular, resReleased] = await Promise.all([
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
        ])

        // Phòng thủ: Nếu response không thành công (ví dụ lỗi 404, 500) thì dừng lại luôn
        if (!resPopular.ok || !resReleased.ok) throw new Error(`HTTP error!`)

        const [dataPopular, dataReleased] = await Promise.all([
          resPopular.json(),
          resReleased.json(),
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
      } catch (error) {
        console.error('Lỗi khi fetch và xử lý phim Popular:', error)
      }
    }

    fetchPopularData()
  }, [])

  useEffect(() => {
    if (!activeMovieId) return
    const fetchTrailer = async () => {
      try {
        await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/movies/trailer/${activeMovieId}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
            },
          },
        ).then(async (res) => {
          const data = await res.json()
          if (data && data.results) {
            const trailer =
              data.results.find(
                (vid) => vid.site === 'YouTube' && vid.type === 'Trailer',
              ) || data.results[0]
            // console.log('trailerKey: ', trailer.key)
            setMovieTrailer(trailer ? trailer.key : null)
          } else {
            setMovieTrailer(null)
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetchTrailer()
  }, [activeMovieId])
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
        movieTrailer,
        setMovieTrailer,
        moviesReleased,
        setMoviesReleased,
        moviesWatching,
        setMoviesWatching,
        moviesTopRated,
        setMoviesTopRated,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}
export const useHome = () => {
  return useContext(HomeContext)
}
