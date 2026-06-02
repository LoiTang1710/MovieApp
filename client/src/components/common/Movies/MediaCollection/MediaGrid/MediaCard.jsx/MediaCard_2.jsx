import { Link } from 'react-router-dom'
import { createSlug } from '../../../../../../utils/formatters' // Sửa đường dẫn này nếu cần
import FavouriteButton from '../../../../ActionButton/FavouriteButton/FavouriteButton.jsx'

export default function MediaCard_2({ media, isPremium }) {
  if (!media) return null

  // Chuẩn hóa dữ liệu
  const id = media.id || media.mediaId
  const title = media.title || media.name
  const type = media.type || 'movie'
  const rating = media.vote_average || media.rating
  const poster = media.poster_path || media.poster

  // URL chuẩn có slug (giống cách MediaCard cũ làm)
  const mediaUrl = `/movie/${createSlug(title)}`

  return (
    <Link
      to={mediaUrl}
      state={{
        mediaId: id,
        type: type,
        isPremium: isPremium,
      }}
      className="group block"
    >
      <div className="relative rounded overflow-hidden aspect-2/3 cursor-pointer transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] bg-black/40 border border-white/10 group-hover:border-red-500/50">
        {/* Ảnh Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${poster}`}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />

        {/* Nhãn PREMIUM */}
        {isPremium && (
          <div className="absolute top-0 left-0 bg-yellow-500 text-black font-bold text-xs py-1 px-2 rounded-br-lg z-10 shadow-lg">
            PREMIUM
          </div>
        )}

        {/* Nhãn TV Series */}
        {type === 'tv' && (
          <div className="absolute top-0 right-0 bg-red-600 text-white font-bold text-[10px] py-1 px-2 rounded-bl-lg z-10 uppercase tracking-wider shadow-lg">
            TV Series
          </div>
        )}

        {/* Overlay mờ đen khi hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <FavouriteButton movie={media} variant="card" />
      </div>

      {/* Tiêu đề & Điểm số */}
      <p className="mt-2 text-sm font-medium text-gray-100 leading-snug truncate">
        {title}
      </p>
      <p className="mt-1 text-xs text-gray-400 flex items-center gap-1.5">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
          alt="IMDb-logo"
          className="w-7"
        />
        <span>{rating ? `${parseFloat(rating).toFixed(1)}/10` : 'N/A'}</span>
      </p>
    </Link>
  )
}
