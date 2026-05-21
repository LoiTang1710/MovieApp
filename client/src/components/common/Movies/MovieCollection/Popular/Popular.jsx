import { useHome } from '../../../../../contexts/HomeContext'

const Popular = () => {
  const { moviesPopular } = useHome()
  return (
    <div>
      <div className="grid grid-cols-6 gap-3">
        {moviesPopular.map((movie) => (
          <a key={movie.id} className="relative cursor-pointer">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt="poster"
              className="w-full object-cover"
            />
            <div className="absolute left-0 bottom-0 w-full h-[25%] border-t border-white/15 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2">
              <p className="text-center text-[8px] md:text-xs lg:text-md font-medium line-clamp-2">
                {movie.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Popular
