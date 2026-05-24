import { useState, useEffect, useRef } from "react";
import {
  Clock, Heart, Flame, Star, ThumbsUp, Ticket, Video,
  Trash2, Plus, LogOut, Zap, Grid2X2, List, SlidersHorizontal,
  Share2, X, Film, Play, Link, MoreVertical, 
} from "lucide-react";

import { useMyList } from "../../hooks/useMyList";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const ICON_MAP = {
  clock:   <Clock size={15} />,
  heart:   <Heart size={15} />,
  flame:   <Flame size={15} />,
  star:    <Star size={15} />,
  thumbs:  <ThumbsUp size={15} />,
  ticket:  <Ticket size={15} />,
  video:   <Video size={15} />,
};

const ICON_OPTIONS = [
  { key: "heart",  icon: <Heart size={20} /> },
  { key: "star",   icon: <Star size={20} /> },
  { key: "video",  icon: <Video size={20} /> },
  { key: "thumbs", icon: <ThumbsUp size={20} /> },
  { key: "flame",  icon: <Flame size={20} /> },
  { key: "ticket", icon: <Ticket size={20} /> },
];

const SORT_OPTIONS = [
  { value: "all",    label: "Tất Cả" },
  { value: "newest", label: "Mới Thêm" },
  { value: "az",     label: "A - Z" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Modal wrapper
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ onClose, children }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-[#242424] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Collection Modal
// ─────────────────────────────────────────────────────────────────────────────
function CreateCollectionModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [selectedIconKey, setSelectedIconKey] = useState("heart");

  function handleSubmit() {
    if (!name.trim()) return;
    onCreate(name.trim(), selectedIconKey);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <X size={20} />
      </button>

      <h2 className="text-xl font-bold text-white mb-6">Tạo Danh Sách Mới</h2>

      {/* Icon picker */}
      <div className="flex gap-3 mb-6">
        {ICON_OPTIONS.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setSelectedIconKey(key)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              selectedIconKey === key
                ? "bg-red-600 text-white"
                : "bg-[#333] text-gray-300 hover:bg-[#444]"
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Name input */}
      <label className="block text-sm text-gray-400 mb-2">Tên Danh Sách</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Nhập tên bộ sưu tập ..."
        className="w-full bg-[#1a1a1a] border border-[#444] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-red-600 transition-colors mb-6"
      />

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="w-full py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Tạo Danh Sách
      </button>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirm Modal
// ─────────────────────────────────────────────────────────────────────────────
function DeleteConfirmModal({ collection, onClose, onConfirm }) {
  function handleConfirm() {
    onConfirm(collection.id);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <Trash2 size={52} className="text-gray-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-3">Xóa Danh Sách ?</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-7">
          Bạn có chắc muốn xóa <strong className="text-white">{collection.displayName}</strong> ?<br />
          Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[#3a3a3a] hover:bg-[#444] transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Xóa ngay
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Share Modal
// ─────────────────────────────────────────────────────────────────────────────
function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareOptions = [
    // { label: "Facebook",  icon: <Facebook size={28} />,  action: () => {} },
    // { label: "Twitter",   icon: <Twitter size={28} />,   action: () => {} },
    // { label: "Instagram", icon: <Instagram size={28} />, action: () => {} },
    { label: copied ? "Đã sao chép!" : "Sao Chép", icon: <Link size={28} />, action: handleCopyLink },
  ];

  return (
    <Modal onClose={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <X size={20} />
      </button>
      <h2 className="text-xl font-bold text-white text-center mb-8">Chia Sẻ Danh Sách</h2>
      <div className="flex justify-center gap-6">
        {shareOptions.map(({ label, icon, action }) => (
          <button key={label} onClick={action} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-2xl bg-[#333] flex items-center justify-center text-white group-hover:bg-[#444] transition-colors">
              {icon}
            </div>
            <span className="text-xs text-gray-400">{label}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Dropdown
// ─────────────────────────────────────────────────────────────────────────────
function FilterDropdown({ currentSort, onApply, onClose }) {
  const [selected, setSelected] = useState(currentSort);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 z-30 bg-[#2a2a2a] rounded-2xl p-5 shadow-2xl min-w-[260px]"
    >
      <p className="text-sm font-semibold text-white mb-3">Phân Loại</p>
      <div className="flex gap-2 mb-5">
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selected === value
                ? "bg-red-600 text-white"
                : "bg-[#3a3a3a] text-gray-300 hover:bg-[#444]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <hr className="border-[#3a3a3a] mb-4" />
      <button
        onClick={() => onApply(selected)}
        className="px-6 py-2 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
      >
        Áp Dụng
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Film size={80} className="text-[#444] mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">Danh Sách Phim Còn Trống</h2>
      <p className="text-gray-500 text-sm mb-8">Hãy thêm những bộ phim yêu thích của bạn vào đây</p>
      <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3 rounded-full transition-colors">
        Khám Phá Ngay <Play size={16} fill="white" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Movie Card (grid view)
// ─────────────────────────────────────────────────────────────────────────────
function MovieCard({ movie, onToggleLike }) {
  return (
    <div className="group">
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] cursor-pointer transition-transform duration-200 group-hover:scale-[1.04] group-hover:shadow-2xl">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
        <button
          onClick={() => onToggleLike(movie.id)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 transition-transform hover:scale-110 ${
            movie.liked ? "text-red-500" : "text-white"
          }`}
        >
          <Heart size={15} fill={movie.liked ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-100 leading-snug">{movie.title}</p>
      <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
        <Star size={11} fill="#f5c518" className="text-yellow-400" /> {movie.rating}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Movie Row (list view)
// ─────────────────────────────────────────────────────────────────────────────
function MovieRow({ movie, onToggleLike }) {
  return (
    <div className="flex items-center gap-4 bg-[#1a1a1a] rounded-xl px-4 py-3 hover:bg-[#222] transition-colors">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-12 h-[72px] rounded-lg object-cover flex-shrink-0"
        onError={(e) => { e.target.style.background = "#333"; }}
      />
      <p className="flex-1 text-sm font-semibold text-white truncate">{movie.title}</p>
      <span className="text-sm text-gray-500 flex-shrink-0">{movie.year}</span>
      <span className="text-sm text-gray-400 flex items-center gap-1 flex-shrink-0 w-12">
        <Star size={12} fill="#f5c518" className="text-yellow-400" /> {movie.rating}
      </span>
      <button
        onClick={() => onToggleLike(movie.id)}
        className={`flex-shrink-0 transition-colors ${movie.liked ? "text-red-500" : "text-gray-600 hover:text-gray-400"}`}
      >
        <Heart size={18} fill={movie.liked ? "currentColor" : "none"} />
      </button>
      <button className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition-colors">
        <MoreVertical size={18} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function MyList() {
  const {
    collections, activeCollection, activeCollectionId,
    displayedMovies, isGridView, sortFilter,
    isCreateModalOpen, deleteTarget, isShareModalOpen, isFilterOpen,
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
          <Share2 size={20} className="cursor-pointer hover:text-white transition-colors" />
          <Zap size={20} className="cursor-pointer hover:text-white transition-colors" /> */}
        </div>
      </header>
    
      {/* ── Body ── */}
      <div className="flex gap-6 px-10 py-7 max-w-[1100px] mx-auto">

        {/* ── Sidebar ── */}
        <aside className="w-56 flex-shrink-0 bg-[#1a1a1a] rounded-2xl p-5 flex flex-col gap-1.5 self-start">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Bộ Sưu Tập</p>

          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => setActiveCollectionId(col.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                activeCollectionId === col.id ? "bg-red-600" : "hover:bg-[#252525]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={activeCollectionId === col.id ? "text-white" : "text-gray-400"}>
                  {ICON_MAP[col.iconKey]}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${activeCollectionId === col.id ? "text-white" : "text-gray-300"}`}>
                    {col.displayName}
                  </p>
                  <p className={`text-[11px] ${activeCollectionId === col.id ? "text-red-200" : "text-gray-600"}`}>
                    {col.count} phim{col.isDefault ? " · Mặc định" : ""}
                  </p>
                </div>
              </div>
              {!col.isDefault && (
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(col); }}
                  className="text-gray-600 hover:text-gray-300 transition-colors p-0.5"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-2 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
          >
            <Plus size={15} /> Tạo Danh Sách Mới
          </button>

          <div className="mt-auto pt-8 flex flex-col gap-2">
            <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
              <Zap size={14} /> Nâng Cấp Lên PRO
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors px-1 py-1">
              <LogOut size={14} /> Đăng Xuất
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* Title + toolbar */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold">{activeCollection?.displayName}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Chào mừng chở lại! Bạn có {activeCollection?.count} phim đang chờ.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Filter button + dropdown */}
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

              {/* Share button */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#333] text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Share2 size={14} /> Chia Sẻ
              </button>

              {/* View toggle */}
              <button
                onClick={() => setIsGridView(true)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                  isGridView ? "bg-red-600 text-white" : "bg-[#1e1e1e] text-gray-400 hover:text-white"
                }`}
              >
                <Grid2X2 size={16} />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                  !isGridView ? "bg-red-600 text-white" : "bg-[#1e1e1e] text-gray-400 hover:text-white"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Movie grid / list / empty */}
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
          {/* {[Facebook, Twitter, Instagram, Play].map((Icon, i) => (
            <div key={i} className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-gray-600 hover:text-white hover:border-gray-500 cursor-pointer transition-colors">
              <Icon size={13} />
            </div>
          ))} */}
        </div>
        <p className="text-[11px] text-gray-700">© 2026 CINEVIBE. All rights reserved.</p>
      </footer>
      
      {/* ── Modals ── */}
      {isCreateModalOpen && (
        <CreateCollectionModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={createCollection}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
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
