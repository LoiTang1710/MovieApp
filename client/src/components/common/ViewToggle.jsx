import { Grid3X3, List } from 'lucide-react'

export const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ${
          view === 'grid'
            ? 'bg-white/10 text-red-500'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
        title="Grid View"
      >
        <Grid3X3 size={18} />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ${
          view === 'list'
            ? 'bg-white/10 text-red-500'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
        title="List View"
      >
        <List size={18} />
      </button>
    </div>
  )
}
