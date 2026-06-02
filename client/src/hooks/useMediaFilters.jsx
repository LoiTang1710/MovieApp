import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

/**
 * useMediaFilters Hook
 *
 * Manages filters via URL search params instead of local state.
 * Automatically resets page to 1 when filters change.
 *
 * Data flow:
 * User interaction → onFilterChange → URL params updated → Component re-renders
 */
export const useMediaFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse URL params into normalized filter object
  const filters = useMemo(() => {
    return {
      year: searchParams.get('year') ? parseInt(searchParams.get('year')) : null,
      genres: searchParams.getAll('genre').map(Number),
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : 0,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
    }
  }, [searchParams])

  // Update filters AND reset page to 1
  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams()

      // Add non-null, non-empty filters
      if (newFilters.year) {
        params.set('year', newFilters.year)
      }
      if (newFilters.genres?.length > 0) {
        newFilters.genres.forEach((genre) => params.append('genre', genre))
      }
      if (newFilters.minRating && newFilters.minRating > 0) {
        params.set('minRating', newFilters.minRating)
      }

      // Always reset to page 1 when filters change
      params.set('page', '1')

      setSearchParams(params)
    },
    [setSearchParams]
  )

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  // Update only the page (doesn't reset other filters)
  const setPage = useCallback(
    (pageNum) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', pageNum)
      setSearchParams(params)
    },
    [searchParams, setSearchParams]
  )

  return {
    filters,
    updateFilters,
    resetFilters,
    setPage,
    searchParams,
  }
}
