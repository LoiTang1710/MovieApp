import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovies } from '../../hooks/useMovies'
import { YearFilter } from '../../components/common/Filters/YearFilter'
import { Pagination } from '../../components/common/Pagination/Pagination'
import { MovieListSkeletonGrid } from '../../components/common/Skeletons/MovieCardSkeleton'
import MovieCard from '../MyList/Content/MovieCard'

const Movies = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedYear, setSelectedYear] = useState(null)

  const { data, isLoading, isError, error } = useMovies(currentPage, selectedYear)

  const handleYearChange = (year) => {
    setSelectedYear(year)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`)
  }

  const handleToggleLike = (movieId) => {
    console.log('Toggle like for:', movieId)
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-10 text-center">
        <h2 className="text-xl font-bold text-red-400">Không tải được dữ liệu</h2>
        <p className="text-sm text-white/60">{error?.message}</p>
      </div>
    )
  }

  const movies = data?.results || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tất cả Phim</h1>
            <p className="text-gray-400">
              Khám phá bộ sưu tập phim và chương trình TV phong phú
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <YearFilter
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
            />
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <MovieListSkeletonGrid count={20} />
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => (
                <div
                  key={`${movie.type}-${movie.id}`}
                  onClick={() => handleMovieClick(movie)}
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <h2 className="text-xl font-bold text-white/80">
              Không tìm thấy phim
            </h2>
            <p className="text-sm text-white/50">
              Hãy thử thay đổi bộ lọc hoặc quay lại sau
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Movies
