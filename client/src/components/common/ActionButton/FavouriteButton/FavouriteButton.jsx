import { Heart, X, ListPlus, Loader2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useState, useMemo } from 'react'
import {
  toggleFavoriteApi,
  fetchCollectionsApi,
} from '../../../../api/collection.api.js'
import { useAuth } from '../../../../hooks/useAuth.jsx'
import RequireLoginModal from '../../Modals/RequireLoginModal.jsx'

// THÊM prop variant vào đây (mặc định là 'detail')
const FavouriteButton = ({ movie, variant = 'detail' }) => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  const { data: collections = [], isLoading: isLoadingCollections } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollectionsApi,
    enabled: isAuthenticated,
  })

  const isLoved = useMemo(() => {
    if (!collections || collections.length === 0 || !movie?.id) return false
    return collections.some((col) =>
      col.items?.some((item) => Number(item.mediaId) === Number(movie.id)),
    )
  }, [collections, movie.id])

  const { mutate: saveToCollection, isPending } = useMutation({
    mutationFn: (collectionId) =>
      toggleFavoriteApi(movie.id, {
        title: movie.title || movie.name,
        posterPath: movie.poster_path || movie.poster || movie.posterPath,
        rating: movie.vote_average || movie.rating,
        releasedDate: movie.release_date ? String(movie.release_date) : null,
        mediaType: movie.media_type || movie.type || 'movie',
        collectionId: collectionId,
      }),
    onSuccess: (data) => {
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['media', 'detail'] })
      if (data.isAdded) toast.success(`Đã thêm vào danh sách! 🍿`)
      else toast.info(`Đã bỏ khỏi danh sách.`)
    },
    onError: (error) => {
      toast.error('Lỗi khi thao tác, vui lòng thử lại!')
      setIsModalOpen(false)
      console.error(error)
    },
  })

  const handleHeartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }
    if (!movie?.id) {
      toast.error('Không tìm thấy thông tin phim!')
      return
    }
    if (isHome || variant === 'card') {
      saveToCollection()
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      {/* RENDER THEO VARIANT */}
      {variant === 'card' ? (
        <button
          type="button"
          onClick={handleHeartClick}
          disabled={isPending}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-md transition-all hover:scale-110 z-20 ${
            isLoved ? 'text-red-500' : 'text-white hover:text-red-400'
          } ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <Heart
            size={15}
            fill={isLoved ? 'currentColor' : 'none'}
            className={isPending ? 'animate-pulse' : ''}
          />
        </button>
      ) : (
        // GIAO DIỆN NẰM Ở TRANG DETAIL / BANNER (Đồng bộ Glassmorphism)
        <div
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={handleHeartClick}
        >
          <button
            type="button"
            disabled={isPending}
            className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300 group-hover:scale-110 ${
              isLoved
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:border-white/20'
            }`}
          >
            <Heart
              size={20}
              className={`${isLoved ? 'fill-red-500 text-red-500' : 'text-white'} ${isPending ? 'animate-pulse' : ''}`}
            />
          </button>
          <p className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
            {isLoved ? 'Đã lưu' : 'Yêu thích'}
          </p>
        </div>
      )}

      {/* Modal đăng nhập */}
      <RequireLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        message="Bạn cần đăng nhập để lưu phim vào danh sách yêu thích."
      />

      {/* Modal chọn list */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              setIsModalOpen(false)
            }}
          ></div>
          {/* ... Giữ nguyên phần UI Modal bên trong của bạn ... */}
          <div
            className="relative bg-[#141414] border border-white/10 rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl"
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
                <div className="flex justify-center py-8">
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
                      className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
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
