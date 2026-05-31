import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  fetchCollectionsApi,
  fetchMoviesByCollectionApi,
  createCollectionApi,
  deleteCollectionApi,
  toggleFavoriteApi,
} from '../api/collection.api'

export const ICON_OPTIONS = [
  { key: 'heart', label: 'Heart' },
  { key: 'star', label: 'Star' },
  { key: 'video', label: 'Video' },
  { key: 'thumbs', label: 'Thumbs Up' },
  { key: 'flame', label: 'Flame' },
  { key: 'ticket', label: 'Ticket' },
]

export const SORT_OPTIONS = [
  { value: 'all', label: 'Tất Cả' },
  { value: 'newest', label: 'Mới Thêm' },
  { value: 'az', label: 'A - Z' },
]

export function useMyList() {
  const queryClient = useQueryClient()

  // UI States
  const [activeCollectionId, setActiveCollectionId] = useState(null)
  const [isGridView, setIsGridView] = useState(true)
  const [sortFilter, setSortFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // 1. LẤY DANH SÁCH BỘ SƯU TẬP
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollectionsApi,
    select: (data) => {
      return data.map((collection) => ({
        ...collection,
      }))
    },
  })
  const resolvedCollectionId =
    activeCollectionId ||
    (collections.length > 0
      ? collections.find((c) => c.isDefault)?.id || collections[0].id
      : null)

  // 2. LẤY PHIM TRONG BỘ SƯU TẬP ĐANG CHỌN
  const { data: movies = [], isLoading: isMoviesLoading } = useQuery({
    queryKey: ['collections', resolvedCollectionId, 'movies'],
    queryFn: () => fetchMoviesByCollectionApi(resolvedCollectionId),
    enabled: !!resolvedCollectionId, // Chỉ chạy API khi đã có ID
  })

  // 3. CÁC MUTATION (THÊM, XÓA, SỬA)
  const createMutation = useMutation({
    mutationFn: (newCollection) => createCollectionApi(newCollection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      setIsCreateModalOpen(false)
      toast.success('Đã tạo danh sách mới! 🎉')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCollectionApi(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      if (activeCollectionId === deletedId && collections.length > 0) {
        setActiveCollectionId(collections[0].id) // Đá về tab đầu tiên
      }
      setDeleteTarget(null)
      toast.info('Đã xóa danh sách.')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể xóa!')
      setDeleteTarget(null)
    },
  })

  const toggleLikeMutation = useMutation({
    mutationFn: ({ movieId, movieData }) =>
      toggleFavoriteApi(movieId, movieData),
    onSuccess: () => {
      // Làm mới lại danh sách phim đang hiển thị
      queryClient.invalidateQueries({
        queryKey: ['collections', activeCollectionId, 'movies'],
      })
    },
  })

  // Derived states
  const activeCollection = useMemo(
    () =>
      collections.find((c) => c.id === resolvedCollectionId) || collections[0],
    [collections, resolvedCollectionId],
  )

  const displayedMovies = useMemo(() => {
    let subset = [...movies]
    if (sortFilter === 'az')
      return subset.sort((a, b) => a.title.localeCompare(b.title, 'vi'))
    return subset
  }, [movies, sortFilter])

  // Actions
  const toggleLike = (movie) => {
    // Ép kiểu chuẩn bị dữ liệu gửi xuống Backend
    toggleLikeMutation.mutate({
      movieId: movie.id,
      movieData: {
        title: movie.title,
        posterPath: movie.poster || movie.posterPath,
        rating: movie.rating || 0,
        year: movie.year || new Date().getFullYear(),
        mediaType: movie.mediaType || 'movie',
      },
    })
  }

  return {
    collections,
    activeCollection,
    activeCollectionId: resolvedCollectionId,
    displayedMovies,
    isGridView,
    sortFilter,
    isCreateModalOpen,
    isShareModalOpen,
    isFilterOpen,
    deleteTarget,
    isMoviesLoading,
    setActiveCollectionId,
    setIsGridView,
    setIsFilterOpen,
    setIsShareModalOpen,
    setIsCreateModalOpen,
    setDeleteTarget,
    toggleLike,
    createCollection: (name, icon) =>
      createMutation.mutate({ collectionName: name, iconKey: icon }),
    deleteCollection: (id) => deleteMutation.mutate(id),
    applySortFilter: (val) => {
      setSortFilter(val)
      setIsFilterOpen(false)
    },
  }
}
