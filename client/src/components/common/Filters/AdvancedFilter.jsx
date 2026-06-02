import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'

/**
 * AdvancedFilter Component
 *
 * Universal, reusable filter UI component.
 * Completely decoupled from business logic - receives all data via props.
 *
 * Props:
 * - genresList: array of { id, name }
 * - filters: { year, genres, minRating, page }
 * - onFiltersChange: callback for updating filters
 * - onReset: callback for resetting all filters
 */

const YearSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-xs font-medium text-gray-400 pl-1 mb-1 block">
        Năm phát hành
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded border border-white/10 transition-all duration-300 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/50"
      >
        <span>{value ? `${value}` : 'Tất cả năm'}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] z-10 max-h-64 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => {
              onChange(null)
              setIsOpen(false)
            }}
            className={`w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors text-sm ${
              !value ? 'bg-red-600 text-white font-medium' : 'text-gray-300'
            }`}
          >
            Tất cả năm
          </button>
          {yearOptions.map((year) => (
            <button
              key={year}
              onClick={() => {
                onChange(year)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors text-sm ${
                value === year ? 'bg-red-600 text-white font-medium' : 'text-gray-300'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const GenreMultiSelect = ({ genres, selectedGenres, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleGenre = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      onChange(selectedGenres.filter((g) => g !== genreId))
    } else {
      onChange([...selectedGenres, genreId])
    }
  }

  const selectedNames = selectedGenres
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(', ')

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-xs font-medium text-gray-400 pl-1 mb-1 block">
        Thể loại
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-lg border border-white/10 transition-all duration-300 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/50"
      >
        <span className="truncate">
          {selectedGenres.length > 0
            ? `${selectedNames}${selectedGenres.length > 2 ? `...+${selectedGenres.length - 2}` : ''}`
            : 'Thể loại'}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] z-10 max-h-80 overflow-y-auto custom-scrollbar">
          <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-white/10 p-3 z-20">
            <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Chọn thể loại
            </div>
          </div>

          <div className="py-1">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors text-sm flex items-center gap-3 ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-red-600/20 text-white border-l-2 border-red-500'
                    : 'text-gray-300 border-l-2 border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  readOnly
                  className="w-4 h-4 rounded border-white/20 bg-black/50 text-red-600 focus:ring-red-500 focus:ring-offset-gray-900 cursor-pointer appearance-none checked:bg-red-600 checked:border-transparent relative after:content-['✓'] after:absolute after:text-white after:text-xs after:left-[3px] after:top-[1px] after:opacity-0 checked:after:opacity-100 transition-all"
                />
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const RatingSlider = ({ value, onChange }) => {
  return (
    <div className="w-full flex flex-col justify-center px-2">
      <label className="text-xs font-medium text-gray-300 mb-2 flex justify-between items-center">
        <span>Điểm tối thiểu</span>
        <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
          {value.toFixed(1)}
        </span>
      </label>
      <input
        type="range"
        min="0"
        max="10"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
      />
      <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 font-medium">
        <span>0.0</span>
        <span>10.0</span>
      </div>
    </div>
  )
}

export const AdvancedFilter = ({
  genresList = [],
  filters = {},
  onFiltersChange,
  onReset,
}) => {
  const handleYearChange = (year) => {
    onFiltersChange({ ...filters, year })
  }

  const handleGenresChange = (selectedGenres) => {
    onFiltersChange({ ...filters, genres: selectedGenres })
  }

  const handleRatingChange = (minRating) => {
    onFiltersChange({ ...filters, minRating })
  }

  // Count active filters for badge
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
          <span className="text-xs bg-red-600 px-2.5 py-1 rounded-full font-medium">
            {activeFiltersCount} bộ lọc
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Year Filter */}
        <YearSelect value={filters.year} onChange={handleYearChange} />

        {/* Genre Multi-Select */}
        <GenreMultiSelect
          genres={genresList}
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
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded border border-white/10 transition-all duration-300 text-sm font-medium text-gray-200 hover:text-white focus:outline-none focus:ring-1 focus:ring-red-500/50"
        >
          <X size={16} />
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  )
}
