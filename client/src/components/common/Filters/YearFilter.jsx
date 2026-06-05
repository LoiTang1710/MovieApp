import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i)

export const YearFilter = ({ selectedYear, onYearChange }) => {
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

  const handleYearSelect = (year) => {
    onYearChange(year)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded border border-white/20 transition"
      >
        <span className="text-sm font-medium">
          {selectedYear ? `Năm: ${selectedYear}` : 'Tất cả năm'}
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-white/20 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
          <button
            onClick={() => handleYearSelect(null)}
            className={`w-full text-left px-4 py-2 hover:bg-white/10 transition text-sm ${
              !selectedYear ? 'bg-primary text-white' : 'text-gray-300'
            }`}
          >
            Tất cả năm
          </button>
          {yearOptions.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={`w-full text-left px-4 py-2 hover:bg-white/10 transition text-sm ${
                selectedYear === year ? 'bg-primary text-white' : 'text-gray-300'
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
