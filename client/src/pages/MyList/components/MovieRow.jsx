import { Heart, Star, MoreVertical } from "lucide-react";

export default function MovieRow({ movie, onToggleLike }) {
  return (
    <div className="flex items-center gap-4 bg-[#1a1a1a] rounded-xl px-4 py-3 hover:bg-[#222] transition-colors">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-12 h-[72px] rounded-lg object-cover flex-shrink-0 bg-[#333]"
        onError={(e) => { e.target.onerror = null; e.target.src = "/fallback-poster.jpg"; }}
      />
      <p className="flex-1 text-sm font-semibold text-white truncate">{movie.title}</p>
      <span className="text-sm text-gray-500 flex-shrink-0">{movie.year}</span>
      <span className="text-sm text-gray-400 flex items-center gap-1 flex-shrink-0 w-12">
        <Star size={12} fill="#f5c518" className="text-yellow-400" /> {movie.rating}
      </span>
      <button
        onClick={() => onToggleLike(movie.id)}
        className={`flex-shrink-0 transition-colors ${
          movie.liked ? "text-red-500" : "text-gray-600 hover:text-gray-400"
        }`}
      >
        <Heart size={18} fill={movie.liked ? "currentColor" : "none"} />
      </button>
      <button className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition-colors">
        <MoreVertical size={18} />
      </button>
    </div>
  );
}
