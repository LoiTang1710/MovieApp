import { Heart } from 'lucide-react'
import PageIndicator from './PageIndicator'
import { useHome } from '../../../../contexts/HomeContext'
// import { useRef } from 'react'

const MovieBanner = () => {
  const { activeMovieId, setLoved, loved, moviesBanner, bannerTrailers } =
    useHome()
  const data = moviesBanner?.find((movie) => movie.id === activeMovieId) || {}
  const trailerKey = bannerTrailers[activeMovieId] || ''
  // const videoRefs = useRef([])
  return (
    <div>
      <div className="relative">
        {trailerKey ? (
          <div
            className="w-full max-h-96 md:max-h-128 lg:max-h-180 2xl:max-h-384 overflow-hidden relative"
            style={{ aspectRatio: '16/9' }}
          >
            <iframe
              className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            alt="backdrop-banner"
            className="w-full max-h-96 md:max-h-128 lg:max-h-180 2xl:max-h-384 object-cover"
          />
        )}
        <div className="w-125.25 h-100.5 absolute bottom-[5%] left-[2%] bg-black/20 backdrop-blur-xl p-8 rounded-2xl text-white flex flex-col justify-between shadow-2xl">
          <div>
            <h1 className=" text-4xl">{data.title}</h1>
            <p className="mt-2">{data.release_date}</p>
            <p className="mt-4">{data.overview}</p>
          </div>
          <div className="flex items-center gap-8">
            <a className="backdrop-link bg-primary">Xem Ngay</a>
            <a className="backdrop-link border border-white/30 backdrop-blur-xs">
              Thông tin
            </a>
            <Heart
              onClick={() => setLoved(!loved)}
              className={`${loved ? 'fill-primary text-primary' : 'none'}`}
            />
          </div>
        </div>
        <PageIndicator />
      </div>
    </div>
  )
}

export default MovieBanner
