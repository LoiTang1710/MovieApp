
const MediaCard = ({item}) => {
  return (
    <a key={item.id} className="relative cursor-pointer">
      <img
        src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
        alt="poster"
        className="w-full object-cover"
      />
      <div className="backdrop-text-overplay">
        <p className="movie-card-title">{item.title || item.name}</p>
      </div>
      {
        item.type === 'tv' && 
        <div className="bg-primary py-1 px-2 absolute top-0 right-0">
          <p>TV Series</p>
        </div>
      }
    </a>
  )
}

export default MediaCard
