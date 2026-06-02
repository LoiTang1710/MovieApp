import { useQuery } from '@tanstack/react-query'
// Nhớ thay thế import axios này bằng config axios của dự án bạn (nếu có dùng axios instance riêng)
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// ==========================================
// 1. HOOK LẤY THỂ LOẠI (Sửa lỗi trắng màn hình)
// ==========================================
export const useMovieGenres = () => {
  return useQuery({
    queryKey: ['movie-genres'],
    queryFn: async () => {
      // Gọi API lấy thể loại dành riêng cho movie
      const response = await axios.get(`${API_BASE_URL}/medias/genres/movie`)
      return response.data?.genres || response.data || []
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache 24h
    gcTime: 30 * 60 * 60 * 1000,
  })
}

// ==========================================
// 2. HOOK LẤY DANH SÁCH PHIM (Chỉ lấy type='movie')
// ==========================================
export const useMovies = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ['movies', page, filters.year, filters.genres, filters.minRating],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page)

      // ✅ ĐÂY LÀ CHÌA KHÓA: Ép cứng tham số báo cho Backend chỉ lấy phim lẻ
      params.append('type', 'movie')

      // Gắn thêm các filter khác nếu người dùng có chọn
      if (filters.year) params.append('year', filters.year)
      if (filters.genres?.length > 0) {
        filters.genres.forEach((g) => params.append('genres', g))
      }
      if (filters.minRating) params.append('minRating', filters.minRating)

      // Gọi API (Hãy đảm bảo endpoint /medias/movies trên backend của bạn có xử lý cái ?type=movie ở trên)
      const response = await axios.get(
        `${API_BASE_URL}/medias/movies?${params}`,
      )
      return response.data
    },
    placeholderData: (previousData) => previousData, // Giữ data cũ không làm giật UI
  })
}
