import {
  Grid2X2,
  List,
  SlidersHorizontal,
  Share2 /*Facebook, Twitter, Instagram, */,
} from 'lucide-react'
import { useMyList } from '../../hooks/useMyList'
import Sidebar from './components/Sidebar'
import MovieCard from './components/MovieCard'
import MovieRow from './components/MovieRow'
import EmptyState from './components/EmptyState'
import CreateModal from './components/modals/CreateModal'
import DeleteModal from './components/modals/DeleteModal'
import ShareModal from './components/modals/ShareModal'
import FilterDropdown from './components/modals/FilterDropdown'
//import Footer from "../../components/layouts/Footer"
//import Header from "../../components/layouts/Header"

export default function MyList() {
  const {
    collections,
    activeCollection,
    activeCollectionId,
    displayedMovies,
    isGridView,
    sortFilter,
    isCreateModalOpen,
    isShareModalOpen,
    isFilterOpen,
    deleteTarget,
    setActiveCollectionId,
    setIsGridView,
    setIsFilterOpen,
    setIsShareModalOpen,
    setIsCreateModalOpen,
    setDeleteTarget,
    toggleLike,
    createCollection,
    deleteCollection,
    applySortFilter,
  } = useMyList()

  return (
    <div className="w-full bg-[#111] text-white font-sans">
      {/* ── Body ── */}
      <div className="flex gap-6 px-10 py-7">
        <Sidebar
          collections={collections}
          activeCollectionId={activeCollectionId}
          onSelectCollection={setActiveCollectionId}
          onDeleteCollection={setDeleteTarget}
          onOpenCreate={() => setIsCreateModalOpen(true)}
        />

        <div className="w-full min-w-0">
          {/* Toolbar */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl text-white/70 font-extrabold">
                {activeCollection?.displayName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Chào mừng chở lại! Bạn có {activeCollection?.count} phim đang
                chờ.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e1e] border border-[#333] text-gray-400 hover:text-white text-sm transition-colors"
                >
                  <SlidersHorizontal size={14} /> Bộ Lọc
                </button>
                {isFilterOpen && (
                  <FilterDropdown
                    currentSort={sortFilter}
                    onApply={applySortFilter}
                    onClose={() => setIsFilterOpen(false)}
                  />
                )}
              </div>

              {/* Share */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e1e] border border-[#333] text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Share2 size={14} /> Chia Sẻ
              </button>

              {/* View toggle */}
              {[
                { grid: true, Icon: Grid2X2 },
                { grid: false, Icon: List },
              ].map(({ grid, Icon }) => (
                <button
                  type="button"
                  key={String(grid)}
                  onClick={() => setIsGridView(grid)}
                  className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
                    isGridView === grid
                      ? 'bg-red-600 text-white'
                      : 'bg-[#1e1e1e] text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {displayedMovies.length === 0 ? (
            <EmptyState />
          ) : isGridView ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
              {displayedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {displayedMovies.map((movie) => (
                <MovieRow
                  key={movie.id}
                  movie={movie}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {/* ── Modals ── */}
        {isCreateModalOpen && (
          <CreateModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={createCollection}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            collection={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={deleteCollection}
          />
        )}
        {isShareModalOpen && (
          <ShareModal onClose={() => setIsShareModalOpen(false)} />
        )}
      </div>
    </div>
  )
}
