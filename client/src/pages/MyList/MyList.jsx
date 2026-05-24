import { Grid2X2, List, SlidersHorizontal, Share2, /*Facebook, Twitter, Instagram, */Play } from "lucide-react";
import { useMyList } from "../../hooks/useMyList";
import Sidebar from "./components/Sidebar";
import MovieCard from "./components/MovieCard";
import MovieRow from "./components/MovieRow";
import EmptyState from "./components/EmptyState";
import CreateModal from "./components/modals/CreateModal";
import DeleteModal from "./components/modals/DeleteModal";
import ShareModal from "./components/modals/ShareModal";
import FilterDropdown from "./components/modals/FilterDropdown";
//import Footer from "../../components/layouts/Footer"
//import Header from "../../components/layouts/Header"

export default function MyList() {
  const {
    collections, activeCollection, activeCollectionId,
    displayedMovies, isGridView, sortFilter,
    isCreateModalOpen, isShareModalOpen, isFilterOpen, deleteTarget,
    setActiveCollectionId, setIsGridView, setIsFilterOpen,
    setIsShareModalOpen, setIsCreateModalOpen, setDeleteTarget,
    toggleLike, createCollection, deleteCollection, applySortFilter,
  } = useMyList();

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans">

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-10 h-16 bg-[#111] border-b border-[#1e1e1e]">
        <span className="text-xl font-black text-red-600 tracking-tight">CINEVIBE</span>
        <nav className="flex gap-8">
          {["Home", "Movies", "TV Shows", "My List"].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm transition-colors ${
                item === "My List"
                  ? "text-red-600 font-bold border-b-2 border-red-600 pb-0.5"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex gap-5 text-gray-400">
          {/* <SlidersHorizontal size={20} className="cursor-pointer hover:text-white transition-colors" />
          <Share2 size={20} className="cursor-pointer hover:text-white transition-colors" /> */}
        </div>
      </header>
      {/* <Header /> */}
      {/* ── Body ── */}
      <div className="flex gap-6 px-10 py-7 max-w-[1100px] mx-auto">
        <Sidebar
          collections={collections}
          activeCollectionId={activeCollectionId}
          onSelectCollection={setActiveCollectionId}
          onDeleteCollection={setDeleteTarget}
          onOpenCreate={() => setIsCreateModalOpen(true)}
        />

        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold">{activeCollection?.displayName}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Chào mừng chở lại! Bạn có {activeCollection?.count} phim đang chờ.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#333] text-gray-400 hover:text-white text-sm transition-colors"
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
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#333] text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Share2 size={14} /> Chia Sẻ
              </button>

              {/* View toggle */}
              {[
                { grid: true,  Icon: Grid2X2 },
                { grid: false, Icon: List },
              ].map(({ grid, Icon }) => (
                <button
                  key={String(grid)}
                  onClick={() => setIsGridView(grid)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                    isGridView === grid
                      ? "bg-red-600 text-white"
                      : "bg-[#1e1e1e] text-gray-400 hover:text-white"
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
                <MovieCard key={movie.id} movie={movie} onToggleLike={toggleLike} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {displayedMovies.map((movie) => (
                <MovieRow key={movie.id} movie={movie} onToggleLike={toggleLike} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="text-center border-t border-[#1e1e1e] mt-10 py-10 px-5">
        <p className="text-xl font-black text-red-600 mb-2">CINEVIBE</p>
        <p className="text-xs text-gray-600 mb-4">
          Nền tảng xem phim trực tuyến hàng đầu Việt Nam. Trải nghiệm điện ảnh đỉnh cao ngay tại nhà.
        </p>
        <div className="flex justify-center gap-4 mb-4">
          {[/*Facebook, Twitter, Instagram, */ Play].map((Icon, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-gray-600 hover:text-white hover:border-gray-500 cursor-pointer transition-colors"
            >
              <Icon size={13} />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-700">© 2026 CINEVIBE. All rights reserved.</p>
      </footer>
      {/* <Footer /> */}
      {/* ── Modals ── */}
      {isCreateModalOpen && (
        <CreateModal onClose={() => setIsCreateModalOpen(false)} onCreate={createCollection} />
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
  );
}
