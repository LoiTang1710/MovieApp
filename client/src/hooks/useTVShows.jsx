import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const useTVShowsList = (page = 1, filters = {}) => {
  const { year, genres, minRating } = filters

  return useQuery({
    queryKey: ['tv-shows', page, year, genres, minRating],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page)
      if (year) params.append('year', year)
      if (genres?.length > 0) {
        genres.forEach((g) => params.append('genres', g))
      }
      if (minRating) params.append('minRating', minRating)

      const response = await axios.get(
        `${API_BASE_URL}/medias/tv-shows?${params}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useTVGenres = () => {
  return useQuery({
    queryKey: ['tv-genres'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/medias/genres/tv`)
      return response.data.genres || []
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 30 * 60 * 60 * 1000, // 30 hours
  })
}
