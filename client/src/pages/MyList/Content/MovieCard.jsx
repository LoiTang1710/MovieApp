import { Heart, Star } from "lucide-react";

export default function MovieCard({ movie, onToggleLike }) {
  return (
    <div className="group">
      <div className="relative rounded overflow-hidden aspect-2/3 cursor-pointer transition-transform duration-200 group-hover:scale-[1.04] group-hover:shadow-2xl">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
        <button
        type="button"
          onClick={() => onToggleLike(movie.id)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 transition-transform hover:scale-110 ${
            movie.liked ? "text-red-500" : "text-white"
          }`}
        >
          <Heart size={15} fill={movie.liked ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-100 leading-snug">{movie.title}</p>
      <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
        <Star size={11} fill="#f5c518" className="text-yellow-400" /> {movie.rating}
      </p>
    </div>
  );
}
