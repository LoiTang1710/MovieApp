import { Link } from 'react-router-dom'
import { createSlug } from '../../../../../../utils/formatters'

const MediaCard = ({ item }) => {
  // console.log("item: " ,item)
  const mediaUrl = `/movie/${createSlug(item.name || item.title)}`
  return (
    <Link
      to={mediaUrl}
      key={item.id}
      className="relative cursor-pointer"
      state={{ mediaId: item.id, type: item.type || 'movie' }}
    >
      <img
        src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
        alt="poster"
        className="w-full object-cover"
      />
      <div className="backdrop-text-overplay">
        <p className="movie-card-title">{item.title || item.name}</p>
      </div>
      {item.type === 'tv' && (
        <div className="bg-primary  sm:text-xs md:text-sm lg:text-md xl:text-lg py-1 px-2 absolute top-0 right-0">
          <p>TV Series</p>
        </div>
      )}
    </Link>
  )
}

export default MediaCard
