import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createSlug } from '../../../../../../utils/formatters' // Sửa lại đường dẫn cho đúng dự án của bạn

export default function MediaRow({ media, onToggleLike, isPremium }) {
  if (!media) return null
  console.log("media: ",media)

  // Chuẩn hóa dữ liệu (Hỗ trợ cả TV và Movie)
  const id = media.id || media.mediaId
  const title = media.title || media.name
  const type = media.type || 'movie'
  const rating = media.vote_average || media.rating
  const poster = media.poster_path || media.poster

  // URL chuẩn
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
      <div className="flex bg-black/40 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:bg-black/60 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] h-36 sm:h-40">
        {/* Phần Poster bên trái */}
        <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w500${poster}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          {type === 'tv' && (
            <div className="absolute top-0 left-0 bg-red-600 text-white font-bold text-[9px] py-1 px-1.5 rounded-br-lg z-10 uppercase tracking-wider">
              TV
            </div>
          )}
        </div>

        {/* Phần Chi tiết bên phải */}
        <div className="p-4 flex flex-col justify-between grow min-w-0">
          <div>
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-100 truncate">
                {title}
              </h3>
              {/* Nút tim */}
              {onToggleLike && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault() // Chặn nhảy trang khi bấm tim
                    onToggleLike(id)
                  }}
                  className={`shrink-0 transition-transform hover:scale-110 ${
                    media.liked
                      ? 'text-red-500'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Heart
                    size={18}
                    fill={media.liked ? 'currentColor' : 'none'}
                  />
                </button>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-400 flex items-center gap-1.5">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                alt="IMDb-logo"
                className="w-7"
              />
              <span>
                {rating ? `${parseFloat(rating).toFixed(1)}/10` : 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
