/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export const HomeContext = createContext({})

export const HomeProvider = ({ children }) => {
  const [loved, setLoved] = useState(false)
  const [moviesBanner, setMoviesBanner] = useState([])
  const [moviesPopular, setMoviesPopular] = useState([])
  const [activeMovieId, setActiveMovieId] = useState()
  const [movieTrailer, setMovieTrailer] = useState(null)

  useEffect(() => {
    const fetchPopularData = async () => {
      try {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/movies/popular`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        }).then(async (res) => {
          const data = await res.json()
          console.log('data: ', data)

          const highRatedMovies = data.results.filter(
            (movie) => movie.vote_average >= 7,
          )
          const sortedMovies = highRatedMovies.sort(
            (a, b) => b.vote_average - a.vote_average,
          )
          const bannerMovies = sortedMovies.slice(0, 4)
          const popularCardMovies = data.results.filter(
            (movie) => movie.id !== bannerMovies.id,
          )
          setMoviesBanner(bannerMovies)
          setActiveMovieId(bannerMovies[0].id)
          setMoviesPopular(popularCardMovies)
        })
      } catch (error) {
        console.error(error)
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
            console.log('trailerKey: ', trailer.key)
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
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}
export const useHome = () => {
  return useContext(HomeContext)
}