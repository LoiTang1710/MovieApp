import { useQuery } from '@tanstack/react-query'
// 1. IMPORT axiosClient CHUẨN CỦA DỰ ÁN (Nhớ check lại đúng đường dẫn file nhé)
import { mediaClient } from '../api/axiosClient'

// ==========================================
// 1. HOOK LẤY THỂ LOẠI
// ==========================================
export const useMovieGenres = () => {
  return useQuery({
    queryKey: ['movie-genres'],
    queryFn: async () => {
      // 2. Dùng mediaClient, KHÔNG CẦN CỘNG URL VÌ NÓ ĐÃ TỰ ĐỘNG CẤU HÌNH SẴN
      const response = await mediaClient.get('/medias/genres/movie')
      return response.data?.genres || response.data || []
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 30 * 60 * 60 * 1000,
  })
}

// ==========================================
// 2. HOOK LẤY DANH SÁCH PHIM
// ==========================================
export const useMovies = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ['movies', page, filters.year, filters.genres, filters.minRating],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('type', 'movie')

      if (filters.year) params.append('year', filters.year)
      if (filters.genres?.length > 0) {
        filters.genres.forEach((g) => params.append('genres', g))
      }
      if (filters.minRating) params.append('minRating', filters.minRating)

      // 3. Thay thế axios bằng mediaClient
      const response = await mediaClient.get(`/medias/movies?${params}`)

      return response.data // Bỏ .data đi nếu bản thân interceptor chưa bóc tách
    },
    placeholderData: (previousData) => previousData,
  })
}
