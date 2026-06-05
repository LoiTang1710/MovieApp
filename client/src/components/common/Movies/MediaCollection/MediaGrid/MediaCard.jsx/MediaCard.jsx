import { Link } from 'react-router-dom'
import { createSlug } from '../../../../../../utils/formatters' // Giữ nguyên đường dẫn của bạn
import FavouriteButton from '../../../../ActionButton/FavouriteButton/FavouriteButton'
import { useMediaDetails } from '../../../../../../hooks/useMediaDetail.jsx'

const MediaCard = ({ item }) => {
  const { data: MediaDetail } = useMediaDetails(item.id, item.type)
  const isPremium = MediaDetail?.isPremium || item.vote_average >= 8.5 || false

  // Chuẩn hóa dữ liệu đầu vào
  const id = item.id
  const title = item.title || item.name
  const type = item.type || (item.first_air_date ? 'tv' : 'movie') // Fallback an toàn
  const poster = item.poster_path
  const rating = item.vote_average
  const mediaUrl = `/movie/${createSlug(title)}`
  if (!item) {
    return null
  }
  return (
    <Link
      to={mediaUrl}
      state={{ mediaId: id, type: type, isPremium }}
      className="group block relative cursor-pointer"
    >
      <div className="relative rounded-xl overflow-hidden aspect-2/3 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] bg-black/40 border border-white/10 group-hover:border-red-500/50">
        {/* 1. Ảnh Poster - Tối ưu size w500 */}
        <img
          src={`https://image.tmdb.org/t/p/w500${poster}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />

        {/* 2. Cụm Badges xếp gọn ở góc trái trên */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10">
          {isPremium && (
            <span className="bg-yellow-500 text-black font-bold text-[10px] sm:text-xs py-1 px-2 rounded shadow-lg">
              PREMIUM
            </span>
          )}
          {type === 'tv' && (
            <span className="bg-red-600 text-white font-bold text-[10px] sm:text-xs py-1 px-2 rounded uppercase tracking-wider shadow-lg">
              TV Series
            </span>
          )}
        </div>

        {/* 3. Nút Yêu Thích - Sẽ tự động nhảy qua góc phải trên nhờ biến thể 'card' */}
        <FavouriteButton movie={item} variant="card" />

        {/* 4. Hiệu ứng Gradient che mờ phần dưới ảnh */}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

        {/* 5. Tiêu đề & Điểm số (Trượt từ dưới lên khi Hover) */}
        <div className="absolute back bottom-0 left-0 w-full p-3 sm:p-4 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white font-bold text-sm sm:text-base md:text-lg line-clamp-2 drop-shadow-md">
            {title}
          </p>

          {rating > 0 && (
            <p className="mt-1 text-xs text-gray-300 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                alt="IMDb-logo"
                className="w-6"
              />
              <span className="font-medium">{rating.toFixed(1)}/10</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default MediaCard
