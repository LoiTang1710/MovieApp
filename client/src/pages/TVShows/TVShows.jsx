import { useEffect } from 'react'

import { useMediaFilters } from '../../hooks/useMediaFilters'
import { AdvancedFilter } from '../../components/common/Filters/AdvancedFilter'
import { Pagination } from '../../components/common/Pagination/Pagination'
import { MovieListSkeletonGrid } from '../../components/common/Skeletons/MovieCardSkeleton'
import MediaCard_2 from '../../components/common/Movies/MediaCollection/MediaGrid/MediaCard.jsx/MediaCard_2.jsx'
import { useTVGenres, useTVShowsList } from '../../hooks/useTVShows.jsx'

// 1. IMPORT HAI HOOK BẠN ĐÃ VIẾT (Nhớ sửa đường dẫn nếu file useTVShows.js nằm ở thư mục khác)


const TVShows = () => {
  const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()

  // 2. DÙNG HOOK LẤY THỂ LOẠI (Rất ngắn gọn và sạch sẽ)
  const { data: genresData, isLoading: isGenresLoading } = useTVGenres()

  // 3. DÙNG HOOK LẤY DANH SÁCH TV SHOWS DỰA TRÊN FILTERS
  const { data, isLoading, isError, error } = useTVShowsList(
    filters.page || 1,
    {
      year: filters.year,
      genres: filters.genres,
      minRating: filters.minRating,
    },
  )

  // Dữ liệu bóc tách an toàn
  const shows = data?.results || []
  const totalPages = data?.totalPages || 1
  const genres = genresData || []

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Chương trình TV
          </h1>
          <p className="text-gray-400">
            Khám phá hàng ngàn bộ phim truyền hình với các bộ lọc nâng cao
          </p>
        </div>

        {!isGenresLoading && (
          <AdvancedFilter
            genresList={genres}
            filters={filters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
          />
        )}

        {isLoading ? (
          <MovieListSkeletonGrid count={20} />
        ) : shows.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {shows.map((show) => (
                <MediaCard_2
                  key={`${show.type || 'tv'}-${show.id}`}
                  media={show}
                  onToggleLike={handleToggleLike}
                />
              ))}
            </div>

            <Pagination
              currentPage={filters.page || 1}
              totalPages={Math.min(totalPages, 500)}
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
