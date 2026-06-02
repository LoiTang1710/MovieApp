import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const useMovies = (page = 1, year = null) => {
  return useQuery({
    queryKey: ['movies', page, year],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page)
      if (year) params.append('year', year)

      const response = await axios.get(`${API_BASE_URL}/medias/movies?${params}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
