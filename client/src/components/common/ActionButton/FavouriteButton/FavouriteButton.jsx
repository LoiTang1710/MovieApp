import { Heart, X, ListPlus, Loader2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  toggleFavoriteApi,
  fetchCollectionsApi,
} from '../../../../api/collection.api.js'
import { useState } from 'react'

const FavouriteButton = ({ movie, isLovedInitial }) => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const queryClient = useQueryClient()

  const [isLoved, setIsLoved] = useState(() => isLovedInitial)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: collections = [], isLoading: isLoadingCollections } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollectionsApi,
    enabled: isModalOpen,
  })

  const { mutate: saveToCollection, isPending } = useMutation({
    mutationFn: (collectionId) =>
      toggleFavoriteApi(movie.id, {
        title: movie.title || movie.name,
        posterPath: movie.poster_path || movie.poster,
        rating: movie.vote_average || movie.rating,
        releasedDate: movie.release_date ? String(movie.release_date) : null,
        mediaType: movie.media_type || 'movie',
        collectionId: collectionId, // Nếu ở Trang chủ, biến này là undefined -> Backend tự gán vào "Phim Yêu Thích"
      }),
    onSuccess: (data) => {
      // Lấy trạng thái mới nhất từ server trả về
      console.log('data: ', data)
      setIsLoved(!!data.isAdded)
      setIsModalOpen(false)

      if (data.isAdded) {
        toast.success(`Đã thêm vào danh sách! 🍿`)
      } else {
        toast.info(`Đã bỏ khỏi danh sách.`)
      }

      // Quan trọng: Đảm bảo dữ liệu bộ sưu tập được làm mới ngay lập tức
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['medias'] }) // Nếu có query này
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
    onError: () => {
      toast.error('Lỗi khi thao tác, vui lòng thử lại!')
      setIsModalOpen(false) // Lỗi cũng phải đóng Modal để user không bị kẹt
    },
  })

  const handleHeartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isHome) {
      // ✅ NẾU LÀ TRANG CHỦ: Lưu thẳng, không hỏi nhiều
      saveToCollection()
    } else {
      // ✅ NẾU LÀ TRANG KHÁC: Mở Modal chọn bộ sưu tập
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
              isLoved === true ? 'fill-primary text-primary' : 'text-white'
            } hidden lg:block cursor-pointer transition-transform hover:scale-110 ${isPending && isHome ? 'opacity-50 animate-pulse' : ''}`}
          />
        </button>
        {!isHome && <p className="action-subtitle">Yêu thích</p>}
      </div>

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
                        e.stopPropagation() // Cực kỳ quan trọng để Modal không bị kẹt khi nhúng trong Link
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
