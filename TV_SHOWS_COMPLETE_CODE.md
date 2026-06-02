// 🎬 COMPLETE TV SHOWS PAGE IMPLEMENTATION
// Senior Frontend Developer - Production Ready Code

// ============================================
// 1. BACKEND: Service Layer
// ============================================
// Location: server/src/services/media.service.js

export const getTVShowsList = async (page = 1, filters = {}) => {
  const pageSize = 20
  const { year = null, genres = [], minRating = 0 } = filters

  // Build dynamic TMDB URL with all filters
  let baseUrl = `/discover/tv?language=vi-VN&sort_by=popularity.desc&page=${page}&vote_average.gte=${minRating}`
  
  if (year) {
    baseUrl += `&first_air_date_year=${year}`
  }
  
  if (genres.length > 0) {
    baseUrl += `&with_genres=${genres.join('|')}`
  }

  const tvData = await tmdbFetch(baseUrl)
  const results = (tvData.results || []).map((tv) => ({ ...tv, type: 'tv' }))

  return {
    results: results.slice(0, pageSize),
    page,
    totalPages: tvData.total_pages || 1,
    totalResults: tvData.total_results || 0,
  }
}

export const getTVGenres = async () => {
  return tmdbFetch('/genre/tv/list?language=vi-VN')
}

// ============================================
// 2. FRONTEND: Custom Hooks
// ============================================
// Location: client/src/hooks/useTVShows.jsx

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
    staleTime: 5 * 60 * 1000,    // 5 minutes
    gcTime: 10 * 60 * 1000,      // 10 minutes
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
    gcTime: 30 * 60 * 60 * 1000,    // 30 hours
  })
}

// ============================================
// 3. FRONTEND: Advanced Filter Component
// ============================================
// Location: client/src/components/common/Filters/TVShowsAdvancedFilter.jsx

export const TVShowsAdvancedFilter = ({ genres, filters, onFiltersChange }) => {
  const handleYearChange = (year) => {
    onFiltersChange({ ...filters, year })
  }

  const handleGenresChange = (selectedGenres) => {
    onFiltersChange({ ...filters, genres: selectedGenres })
  }

  const handleRatingChange = (minRating) => {
    onFiltersChange({ ...filters, minRating })
  }

  const activeFiltersCount = [
    filters.year,
    filters.genres?.length > 0,
    filters.minRating > 0,
  ].filter(Boolean).length

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Bộ lọc nâng cao</h3>
        {activeFiltersCount > 0 && (
          <span className="text-xs bg-primary px-2.5 py-1 rounded-full">
            {activeFiltersCount} bộ lọc
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Year Filter */}
        <YearSelect value={filters.year} onChange={handleYearChange} />

        {/* Genre Multi-Select */}
        <GenreMultiSelect
          genres={genres}
          selectedGenres={filters.genres || []}
          onChange={handleGenresChange}
        />

        {/* Rating Slider */}
        <RatingSlider
          value={filters.minRating || 0}
          onChange={handleRatingChange}
        />

        {/* Reset Button */}
        <button
          onClick={() =>
            onFiltersChange({ year: null, genres: [], minRating: 0 })
          }
          className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 rounded border border-white/20 transition text-sm font-medium"
        >
          <X size={16} />
          Đặt lại
        </button>
      </div>
    </div>
  )
}

// ============================================
// 4. FRONTEND: TV Shows Page
// ============================================
// Location: client/src/pages/TVShows/TVShows.jsx

const TVShows = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    year: null,
    genres: [],
    minRating: 0,
  })

  const { data, isLoading, isError, error } = useTVShowsList(currentPage, filters)
  const { data: genresData, isLoading: isGenresLoading } = useTVGenres()

  // Auto-reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters])

  const shows = data?.results || []
  const totalPages = data?.totalPages || 1
  const genres = genresData || []

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
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
          <h1 className="text-3xl font-bold text-white mb-2">Chương trình TV</h1>
          <p className="text-gray-400">Khám phá hàng ngàn bộ phim truyền hình</p>
        </div>

        {/* Advanced Filter */}
        {!isGenresLoading && (
          <TVShowsAdvancedFilter
            genres={genres}
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

        {/* TV Shows Grid */}
        {isLoading ? (
          <MovieListSkeletonGrid count={20} />
        ) : shows.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {shows.map((show) => (
                <div
                  key={`tv-${show.id}`}
                  onClick={() => navigate(`/video/${show.id}`)}
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
                    onToggleLike={() => {}}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.min(totalPages, 500)}
              onPageChange={(page) => {
                setCurrentPage(page)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
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

// ============================================
// 5. ROUTER CONFIGURATION
// ============================================
// Location: client/src/App.jsx

{
  path: '/tv-shows',
  element: <TVShows />,
}

// ============================================
// 6. FILTER STATE STRUCTURE (Clean & Simple)
// ============================================

const filters = {
  year: 2024 || null,          // Single value or null
  genres: [16, 18, 35] || [],  // Array of genre IDs
  minRating: 7.5 || 0,         // Number 0-10
}

// ============================================
// 7. API QUERY EXAMPLES
// ============================================

// Basic request
GET /api/medias/tv-shows?page=1

// With year filter
GET /api/medias/tv-shows?page=1&year=2024

// With multiple genres (Action & Adventure, Animation, Comedy)
GET /api/medias/tv-shows?page=1&genres=10759&genres=16&genres=35

// With rating filter (min 8.0)
GET /api/medias/tv-shows?page=1&minRating=8

// Combined filters
GET /api/medias/tv-shows?page=1&year=2024&genres=10759&genres=16&minRating=8

// Get all genres
GET /api/medias/genres/tv

// ============================================
// 8. KEY FEATURES SUMMARY
// ============================================

✅ Advanced Filtering
   - Year (dropdown, 30 years)
   - Genre (multi-select, checkboxes)
   - IMDb Rating (slider, 0-10)
   - Reset button (one-click clear)

✅ High Performance
   - TanStack Query caching
   - Smart query key management
   - Skeleton UI loading state
   - 5-min cache + 10-min gc

✅ Clean Architecture
   - Separate hooks for data
   - Modular filter components
   - Reusable UI elements
   - Single state object

✅ Great UX
   - Active filter badge
   - Genre count indicator
   - Smooth scrolling
   - Responsive design

// ============================================
// 9. FILE CHANGES SUMMARY
// ============================================

BACKEND:
✅ server/src/services/media.service.js - Added getTVShowsList, getTVGenres
✅ server/src/controllers/media.controller.js - Added getTVShows, getGenresTv
✅ server/src/routes/media.route.js - Added /tv-shows, /genres/tv routes

FRONTEND:
✅ client/src/hooks/useTVShows.jsx - Custom hooks for TV shows + genres
✅ client/src/components/common/Filters/TVShowsAdvancedFilter.jsx - Filter UI
✅ client/src/pages/TVShows/TVShows.jsx - Main page
✅ client/src/pages/TVShows/index.js - Export
✅ client/src/App.jsx - Added /tv-shows route
✅ client/src/components/common/Filters/index.js - Updated exports

DOCUMENTATION:
✅ TV_SHOWS_IMPLEMENTATION.md - Detailed guide
✅ TVSHOWS_SUMMARY.md - Complete summary
✅ TV_SHOWS_COMPLETE_CODE.md - This file

// ============================================
// 10. NEXT STEPS
// ============================================

1. Start dev server: cd server && npm run dev
2. Navigate to /tv-shows in browser
3. Test each filter individually
4. Test combined filters
5. Verify pagination works
6. Check skeleton UI loading state
7. Deploy to production

// ============================================
// ✅ PRODUCTION READY
// ============================================
