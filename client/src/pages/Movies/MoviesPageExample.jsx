import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useMediaFilters } from '../../hooks/useMediaFilters'
import { AdvancedFilter } from '../../components/common/Filters/AdvancedFilter'
import { Pagination } from '../../components/common/Pagination/Pagination'
import { MovieListSkeletonGrid } from '../../components/common/Skeletons/MovieCardSkeleton'
import MovieCard from '../MyList/Content/MovieCard'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * MoviesPage - Complete example of URL-driven filtering with TanStack Query
 *
 * Architecture:
 * 1. useMediaFilters hook manages filters via URL search params
 * 2. Filters object passed to TanStack Query queryKey
 * 3. AdvancedFilter component is completely dumb (no state)
 * 4. Any URL change automatically triggers data refetch
 */

const MoviesPage = () => {
  const navigate = useNavigate()
  const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()

  // Fetch TV genres for filter dropdown
  const { data: genresData } = useQuery({
    queryKey: ['movie-genres'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/medias/genres/tv`)
      return response.data.genres || []
    },
  staleTime: 24 * 60 * 60 * 1000, 
    gcTime: 30 * 60 * 60 * 1000,
  })

  // Main query: Fetch movies with current filters
  // Key: Filters object is part of queryKey so changes trigger refetch automatically
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['movies', filters.year, filters.genres, filters.minRating, filters.page],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', filters.page || 1)

      if (filters.year) params.append('year', filters.year)
      if (filters.genres?.length > 0) {
        filters.genres.forEach((g) => params.append('genres', g))
      }
      if (filters.minRating) params.append('minRating', filters.minRating)

      const response = await axios.get(`${API_BASE_URL}/medias/movies?${params}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  })

  const movies = data?.results || []
  const totalPages = data?.totalPages || 1
  const genres = genresData || []

  // Scroll to top when page or filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters])

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-10 text-center">
        <h2 className="text-xl font-bold text-red-400">Không tải được dữ liệu</h2>
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
            Khám phá bộ sưu tập phim phong phú với các bộ lọc nâng cao
          </p>
        </div>

        {/* Advanced Filter Component - Completely dumb, receives all data via props */}
        <AdvancedFilter
          genresList={genres}
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />

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
                    onToggleLike={() => {}}
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
            <h2 className="text-xl font-bold text-white/80">Không tìm thấy phim</h2>
            <p className="text-sm text-white/50">Hãy thử thay đổi bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MoviesPage
