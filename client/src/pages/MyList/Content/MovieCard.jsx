import { Heart } from 'lucide-react'

export default function MovieCard({ movie, onToggleLike }) {
  return (
    <div className="group">
      <div className="relative rounded overflow-hidden aspect-2/3 cursor-pointer transition-transform duration-200 group-hover:scale-[1.04] group-hover:shadow-2xl">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath || movie.poster}`}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
        <button
          type="button"
          onClick={() => onToggleLike(movie.id)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 transition-transform hover:scale-110 ${
            movie.liked ? 'text-red-500' : 'text-white'
          }`}
        >
          <Heart size={15} fill={movie.liked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-100 leading-snug">
        {movie.title}
      </p>
      <p className="mt-1 text-xs text-gray-400 flex items-center gap-1.5">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
          alt="IMDb-logo"
          className="w-7"
        />
        <span>{movie.rating ? `${movie.rating.toFixed(1)}/10` : 'N/A'}</span>
      </p>
    </div>
  )
}
