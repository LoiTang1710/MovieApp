import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Import lại các hook gọi API chuẩn của bạn từ thư mục hooks
import { useMovies, useMovieGenres } from '../../hooks/useMovies'
import { useMediaFilters } from '../../hooks/useMediaFilters'
import { AdvancedFilter } from '../../components/common/Filters/AdvancedFilter'
import { Pagination } from '../../components/common/Pagination/Pagination'
import { MovieListSkeletonGrid } from '../../components/common/Skeletons/MovieCardSkeleton'
import MovieCard from '../MyList/Content/MovieCard'

const Movies = () => {
  const navigate = useNavigate()

  // 1. Quản lý State qua URL
  const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()

  // 2. Lấy danh sách thể loại (Dùng hook chuẩn của bạn)
  const { data: genresData, isLoading: isGenresLoading } = useMovieGenres()

  // 3. Lấy dữ liệu phim (Truyền page và toàn bộ filters vào hook chuẩn của bạn)
  const { data, isLoading, isError, error } = useMovies(filters.page, filters)

  const movies = data?.results || []
  const totalPages = data?.totalPages || 1
  const genres = genresData || []

  // Cuộn lên đầu trang khi đổi page hoặc filter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters])

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
          <h1 className="text-3xl font-bold text-white mb-2">Tất cả Phim</h1>
          <p className="text-gray-400">
            Khám phá bộ sưu tập phim lẻ phong phú với bộ lọc nâng cao
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

        {/* Movies Grid */}
        {isLoading ? (
          <MovieListSkeletonGrid count={20} />
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => (
                <div
                  key={`movie-${movie.id}`}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="cursor-pointer"
                >
                  <MovieCard
                    movie={{
                      id: movie.id,
                      title: movie.title || movie.name,
                      posterPath: movie.poster_path,
                      poster: movie.poster_path,
                      rating: movie.vote_average,
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
              totalPages={Math.min(totalPages, 500)}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <h2 className="text-xl font-bold text-white/80">
              Không tìm thấy phim
            </h2>
            <p className="text-sm text-white/50">Hãy thử thay đổi bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Movies
