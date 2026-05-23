import { useState, useMemo } from "react";

const INITIAL_COLLECTIONS = [
  { id: 1, name: "Watch Later", displayName: "Xem Sau", count: 8, movieIds: [1,2,3,4,5,6,7,8], iconKey: "clock", isDefault: true },
  { id: 2, name: "Action Movies", displayName: "Phim Hành Động", count: 4, movieIds: [5,6,7,8], iconKey: "flame" },
  { id: 3, name: "Animation", displayName: "Phim Hoạt Hình", count: 0, iconKey: "heart" },
];

const INITIAL_MOVIES = [
  { id: 1, title: "Nữ Hoàng Băng Giá 3", rating: 9.0, liked: true, year: 2027, poster: "" },
  { id: 2, title: "Hành Trình Của Moana", rating: 9.6, liked: true, year: 2027, poster: "" },
  { id: 3, title: "Minions & Quái Vật", rating: 9.5, liked: false, year: 2027, poster: "" },
  { id: 4, title: "Chàng Mèo Mang Mũ", rating: 9.0, liked: false, year: 2027, poster: "" },
  { id: 5, title: "Kung Fu Panda 4", rating: 9.1, liked: false, year: 2027, poster: "" },
  { id: 6, title: "Mufasa: Vua Sư Tử", rating: 8.9, liked: true, year: 2027, poster: "" },
  { id: 7, title: "Lọ Lem", rating: 9.6, liked: false, year: 2027, poster: "" },
  { id: 8, title: "Công Chúa Mononoke", rating: 9.0, liked: false, year: 2027, poster: "" },
];

export function useMyList() {
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [activeCollectionId, setActiveCollectionId] = useState(1);
  const [movies, setMovies] = useState(INITIAL_MOVIES);
  const [isGridView, setIsGridView] = useState(true);
  const [sortFilter, setSortFilter] = useState("all"); // "all" | "newest" | "az"

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // collection object
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeCollection = collections.find((c) => c.id === activeCollectionId);

  // Sorted + filtered movies — only recalculates when movies, activeCollectionId, or sortFilter changes
  // const displayedMovies = useMemo(() => {
  //   const collectionIsEmpty = activeCollection?.count === 0;
  //   if (collectionIsEmpty) return [];

  //   const sorted = [...movies];
  //   if (sortFilter === "az") {
  //     sorted.sort((a, b) => a.title.localeCompare(b.title, "vi"));
  //   } else if (sortFilter === "newest") {
  //     sorted.sort((a, b) => b.id - a.id);
  //   }
  //   return sorted;
  // }, [movies, activeCollectionId, sortFilter, activeCollection]);

  // const collectionsWithCount = useMemo(() => {
  //   return collections.map(col => ({
  //     ...col,
  //     count: col.movieIds.length  
  //   }));
  // }, [collections]);

  const displayedMovies = useMemo(() => {
    if (!activeCollection) return [];
    const movieIds = activeCollection.movieIds || [];
    let filtered = movies.filter(m => movieIds.includes(m.id));
    
    if (sortFilter === "az") {
      filtered.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    } else if (sortFilter === "newest") {
      filtered.sort((a, b) => b.id - a.id);
    }
    return filtered;
  }, [movies, activeCollection, sortFilter]);

  function toggleLike(movieId) {
    setMovies((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, liked: !m.liked } : m))
    );
  }

  function createCollection(name, iconKey) {
    const newCollection = {
      id: Date.now(),
      name,
      displayName: name,
      count: 0,
      iconKey,
      isDefault: false,
    };
    setCollections((prev) => [...prev, newCollection]);
  }

  function deleteCollection(id) {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    if (activeCollectionId === id) setActiveCollectionId(1);
  }

  function applySortFilter(value) {
    setSortFilter(value);
    setIsFilterOpen(false);
  }

  return {
    // Data
    collections,
    activeCollection,
    activeCollectionId,
    displayedMovies,
    isGridView,
    sortFilter,
    // Modal states
    isCreateModalOpen,
    deleteTarget,
    isShareModalOpen,
    isFilterOpen,
    // Actions
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
  };
}
