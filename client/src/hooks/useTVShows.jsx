import { useQuery } from '@tanstack/react-query'
// 1. IMPORT mediaClient CHUẨN CỦA DỰ ÁN
import { mediaClient } from '../api/axiosClient'

// ==========================================
// 1. HOOK LẤY DANH SÁCH TV SHOWS
// ==========================================
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

      // 2. Dùng mediaClient, bỏ hoàn toàn API_BASE_URL
      const response = await mediaClient.get(`/medias/tv-shows?${params}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// ==========================================
// 2. HOOK LẤY THỂ LOẠI TV SHOWS
// ==========================================
export const useTVGenres = () => {
  return useQuery({
    queryKey: ['tv-genres'],
    queryFn: async () => {
      // 3. Dùng mediaClient cho gọi thể loại
      const response = await mediaClient.get('/medias/genres/tv')

      // Đề phòng API trả về bọc trong data.genres hoặc trả trực tiếp mảng
      return response.data?.genres || response.data || []
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache 24h
    gcTime: 30 * 60 * 60 * 1000,
  })
}
