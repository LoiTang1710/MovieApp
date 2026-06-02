import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { useMediaFilters } from '../../hooks/useMediaFilters'
import { AdvancedFilter } from '../../components/common/Filters/AdvancedFilter'
import { Pagination } from '../../components/common/Pagination/Pagination'
import { MovieListSkeletonGrid } from '../../components/common/Skeletons/MovieCardSkeleton'
import MovieCard from '../MyList/Content/MovieCard'

// Lưu ý: Đảm bảo biến môi trường này trỏ đúng vào API của bạn
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const TVShows = () => {
  const navigate = useNavigate()

  // 1. Quản lý toàn bộ State qua URL thông qua Hook
  const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()

  // 2. Fetch danh sách thể loại TV Shows
  const { data: genresData, isLoading: isGenresLoading } = useQuery({
    queryKey: ['tv-genres'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/medias/genres/tv`)
      return response.data.genres || response.data || []
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache 24 tiếng vì thể loại hiếm khi đổi
    gcTime: 30 * 60 * 60 * 1000,
  })

  // 3. Fetch dữ liệu TV Shows dựa trên URL Params
  const { data, isLoading, isError, error } = useQuery({
    // queryKey chứa toàn bộ filters. Bất cứ khi nào URL đổi, TanStack sẽ tự gọi lại API.
    queryKey: [
      'tvshows',
      filters.year,
      filters.genres,
      filters.minRating,
      filters.page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', filters.page || 1)

      if (filters.year) params.append('year', filters.year)
      if (filters.genres?.length > 0) {
        filters.genres.forEach((g) => params.append('genres', g))
      }
      if (filters.minRating) params.append('minRating', filters.minRating)

      // GỌI ĐÚNG ENDPOINT DÀNH CHO TV SHOWS
      const response = await axios.get(
        `${API_BASE_URL}/medias/tv-shows?${params}`,
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Giữ data cũ mượt mà trong lúc tải data mới
  })

  const shows = data?.results || []
  const totalPages = data?.totalPages || 1
  const genres = genresData || []

  // Cuộn lên đầu trang khi đổi page hoặc filter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters])

  const handleShowClick = (show) => {
    navigate(`/video/${show.id}`)
  }

  const handleToggleLike = () => {}

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-10 text-center">
        <h2 className="text-xl font-bold text-red-400">
          Không tải được dữ liệu
        </h2>
        <p className="text-sm text-white/60">{error?.message}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Chương trình TV
          </h1>
          <p className="text-gray-400">
            Khám phá hàng ngàn bộ phim truyền hình với các bộ lọc nâng cao
          </p>
        </div>

        {/* Filter Component */}
        {!isGenresLoading && (
          <AdvancedFilter
            genresList={genres}
            filters={filters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
          />
        )}

        {/* Shows Grid */}
        {isLoading ? (
          <MovieListSkeletonGrid count={20} />
        ) : shows.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {shows.map((show) => (
                <div
                  key={`tv-${show.id}`}
                  onClick={() => handleShowClick(show)}
                  className="cursor-pointer"
                >
                  <MovieCard
                    movie={{
                      id: show.id,
                      title: show.name || show.title,
                      posterPath: show.poster_path,
                      poster: show.poster_path,
                      rating: show.vote_average,
                      liked: false,
                    }}
                    onToggleLike={handleToggleLike}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={filters.page || 1}
              totalPages={Math.min(totalPages, 500)} // Giới hạn API của TMDB thường là 500 trang
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <h2 className="text-xl font-bold text-white/80">
              Không tìm thấy chương trình TV
            </h2>
            <p className="text-sm text-white/50">Hãy thử thay đổi bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TVShows
