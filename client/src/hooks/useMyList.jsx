import { useState, useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
export const ICON_OPTIONS = [
  { key: "heart",  label: "Heart" },
  { key: "star",   label: "Star" },
  { key: "video",  label: "Video" },
  { key: "thumbs", label: "Thumbs Up" },
  { key: "flame",  label: "Flame" },
  { key: "ticket", label: "Ticket" },
];

export const SORT_OPTIONS = [
  { value: "all",    label: "Tất Cả" },
  { value: "newest", label: "Mới Thêm" },
  { value: "az",     label: "A - Z" },
];

const INITIAL_MOVIES = [
  { id: 1, title: "Nữ Hoàng Băng Giá 3",  rating: 9.0, liked: true,  year: 2027, poster: "https://image.tmdb.org/t/p/w500/kgwjIb2JDHRhNk13lmSxiClFjVk.jpg" },
  { id: 2, title: "Hành Trình Của Moana",  rating: 9.6, liked: true,  year: 2027, poster: "https://image.tmdb.org/t/p/w500/" },
  { id: 3, title: "Minions & Quái Vật",    rating: 9.5, liked: false, year: 2027, poster: "https://image.tmdb.org/t/p/w500/" },
  { id: 4, title: "Chàng Mèo Mang Mũ",    rating: 9.0, liked: false, year: 2027, poster: "https://image.tmdb.org/t/p/w500/" },
  { id: 5, title: "Kung Fu Panda 4",       rating: 9.1, liked: false, year: 2027, poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg" },
  { id: 6, title: "Mufasa: Vua Sư Tử",    rating: 8.9, liked: true,  year: 2027, poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg" },
  { id: 7, title: "Lọ Lem",               rating: 9.6, liked: false, year: 2027, poster: "https://image.tmdb.org/t/p/w500/" },
  { id: 8, title: "Công Chúa Mononoke",   rating: 9.0, liked: false, year: 2027, poster: "https://image.tmdb.org/t/p/w500/" },
];

const INITIAL_COLLECTIONS = [
  { id: 1, name: "Watch Later",    displayName: "Xem Sau",          iconKey: "clock",  isDefault: true,  movieIds: [1,2,3,4,5,6,7,8] },
  { id: 2, name: "Action Movies",  displayName: "Phim Hành Động",   iconKey: "flame",  isDefault: false, movieIds: [5,6,7,8] },
  { id: 3, name: "Animation",      displayName: "Phim Hoạt Hình",   iconKey: "heart",  isDefault: false, movieIds: [] },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useMyList() {
  const [collections, setCollections]           = useState(INITIAL_COLLECTIONS);
  const [activeCollectionId, setActiveCollectionId] = useState(1);
  const [movies, setMovies]                     = useState(INITIAL_MOVIES);
  const [isGridView, setIsGridView]             = useState(true);
  const [sortFilter, setSortFilter]             = useState("all");

  // Modal / UI states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen]   = useState(false);
  const [isFilterOpen, setIsFilterOpen]           = useState(false);
  const [deleteTarget, setDeleteTarget]           = useState(null); // collection | null

  // ─── Derived ───────────────────────────────────────────────────────────────
  const activeCollection = useMemo(
    () => collections.find((c) => c.id === activeCollectionId),
    [collections, activeCollectionId]
  );

  // Collections enriched with live count (stays in sync automatically)
  const enrichedCollections = useMemo(
    () => collections.map((col) => ({ ...col, count: col.movieIds.length })),
    [collections]
  );

  // Movies belonging to active collection, sorted by current filter
  const displayedMovies = useMemo(() => {
    if (!activeCollection) return [];
    const subset = movies.filter((m) => activeCollection.movieIds.includes(m.id));
    if (sortFilter === "az")     return [...subset].sort((a, b) => a.title.localeCompare(b.title, "vi"));
    if (sortFilter === "newest") return [...subset].sort((a, b) => b.id - a.id);
    return subset;
  }, [movies, activeCollection, sortFilter]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  function toggleLike(movieId) {
    setMovies((prev) => prev.map((m) => (m.id === movieId ? { ...m, liked: !m.liked } : m)));
  }

  function createCollection(displayName, iconKey) {
    setCollections((prev) => [
      ...prev,
      { id: Date.now(), name: displayName, displayName, iconKey, isDefault: false, movieIds: [] },
    ]);
  }

  function deleteCollection(id) {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    if (activeCollectionId === id) setActiveCollectionId(1);
    //setDeleteTarget(null);
  }

  function applySortFilter(value) {
    setSortFilter(value);
    setIsFilterOpen(false);
  }

  return {
    // Data
    collections: enrichedCollections,
    activeCollection,
    activeCollectionId,
    displayedMovies,
    isGridView,
    sortFilter,
    // UI states
    isCreateModalOpen,
    isShareModalOpen,
    isFilterOpen,
    deleteTarget,
    // Setters
    setActiveCollectionId,
    setIsGridView,
    setIsFilterOpen,
    setIsShareModalOpen,
    setIsCreateModalOpen,
    setDeleteTarget,
    // Actions
    toggleLike,
    createCollection,
    deleteCollection,
    applySortFilter,
  };
}
