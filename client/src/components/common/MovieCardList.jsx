import { Heart, Star } from 'lucide-react'

export default function MovieCardList({ movie, onToggleLike }) {
  return (
    <div className="group flex gap-4 p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg transition-all duration-300 hover:bg-black/60 hover:border-white/20 hover:shadow-2xl">
      {/* Poster Image */}
      <div className="flex-shrink-0 w-24 h-36 rounded-md overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.posterPath || movie.poster}`}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Header: Title & Like Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate hover:text-red-400 transition-colors duration-200">
              {movie.title}
            </h3>
            <p className="text-white/50 text-xs mt-1">{movie.releaseYear}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggleLike(movie.id)}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
              movie.liked ? 'text-red-500' : 'text-white/70 hover:text-white'
            }`}
          >
            <Heart size={16} fill={movie.liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Rating & Year */}
        <div className="flex items-center gap-3 mt-2 sm:mt-3">
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-white/80 text-xs font-semibold">
              {movie.rating ? `${movie.rating.toFixed(1)}/10` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Overview/Description */}
        <p className="text-white/60 text-xs sm:text-sm mt-2 sm:mt-3 line-clamp-2 leading-relaxed">
          {movie.overview || 'No description available.'}
        </p>
      </div>
    </div>
  )
}
