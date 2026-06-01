import { Heart, X, ListPlus, Loader2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useState, useMemo } from 'react'
import {
  toggleFavoriteApi,
  fetchCollectionsApi,
} from '../../../../api/collection.api.js'

const FavouriteButton = ({ movie }) => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. Dùng TanStack Query quản lý danh sách bộ sưu tập (Lúc nào cũng fetch ngầm)
  const { data: collections = [], isLoading: isLoadingCollections } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollectionsApi,
  })

  // 2. TẬN DỤNG TANSTACK QUERY ĐỂ GIẢI QUYẾT RE-RENDER:
  // Dùng useMemo để tính toán trực tiếp từ dữ liệu Collections của cache server
  const isLoved = useMemo(() => {
    if (!collections || collections.length === 0) return false
    // Duyệt qua toàn bộ bộ sưu tập, nếu có bất kỳ item nào trùng mediaId với phim này -> Tim đỏ
    return collections.some((col) =>
      col.items?.some((item) => Number(item.mediaId) === Number(movie.id)),
    )
  }, [collections, movie.id])
  console.log("isLoved: ", isLoved)

  const { mutate: saveToCollection, isPending } = useMutation({
    mutationFn: (collectionId) =>
      toggleFavoriteApi(movie.id, {
        title: movie.title || movie.name,
        posterPath: movie.poster_path || movie.poster || movie.posterPath,
        rating: movie.vote_average || movie.rating,
        releasedDate: movie.release_date ? String(movie.release_date) : null,
        mediaType: movie.media_type || 'movie',
        collectionId: collectionId,
      }),
    onSuccess: (data) => {
      setIsModalOpen(false)
      console.log("data: ", data)
      // Đập tan dữ liệu cũ, ép TanStack Query fetch lại danh sách collections mới ngay lập tức
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['media', 'detail'] })

      if (data.isAdded) {
        toast.success(`Đã thêm vào danh sách! 🍿`)
      } else {
        toast.info(`Đã bỏ khỏi danh sách.`)
      }
    },
    onError: () => {
      toast.error('Lỗi khi thao tác, vui lòng thử lại!')
      setIsModalOpen(false)
    },
  })

  const handleHeartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isHome) {
      saveToCollection()
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <div className="icon-block">
        <button
          type="button"
          onClick={handleHeartClick}
          disabled={isPending && isHome}
          className="bg-transparent border-none p-0 outline-none flex items-center justify-center"
        >
          <Heart
            className={`${
              isLoved ? 'fill-red-600 text-red-600' : 'text-white'
            } hidden lg:block cursor-pointer transition-transform hover:scale-110 ${
              isPending && isHome ? 'opacity-50 animate-pulse' : ''
            }`}
          />
        </button>
        {!isHome && <p className="action-subtitle">Yêu thích</p>}
      </div>

      {/* ── Phần Modal giữ nguyên như cũ của bạn bên dưới ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={(e) => {
              e.stopPropagation()
              setIsModalOpen(false)
            }}
          ></div>

          <div
            className="relative bg-[#141414] border border-white/10 rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-primary" />
                Lưu vào...
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(false)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700">
              {isLoadingCollections ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  Bạn chưa có bộ sưu tập nào.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      disabled={isPending}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        saveToCollection(col.id)
                      }}
                      className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span className="font-medium truncate pr-2">
                        {col.displayName || col.collectionName}
                      </span>
                      {col.isDefault && (
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 shrink-0">
                          Mặc định
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FavouriteButton
