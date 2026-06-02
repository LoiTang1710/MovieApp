import PageIndicator from './PageIndicator'
import { useHome } from '../../../../contexts/HomeContext'
import { Link } from 'react-router-dom'
import { createSlug } from '../../../../utils/formatters'
import FavouriteButton from '../../ActionButton/FavouriteButton/FavouriteButton'

const MediaBanner = () => {
  const {
    activeMediaId,
    mediaBanner,
    bannerTrailers,
    bannerLogos,
    // name
  } = useHome()
  const data = mediaBanner?.find((movie) => movie.id === activeMediaId) || {}
  const trailerKey = bannerTrailers[activeMediaId] || ''
  const logoPath = bannerLogos[activeMediaId]
  const mediaType = data.type || (data.first_air_date ? 'tv' : 'movie')
  const detailURL = `/movie/${createSlug(data.title || data.name || 'phim')}`
  const videoURL = `/video/${createSlug(data.title || data.name || 'phim')}.${data.id}`
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
            loading="lazy"
          />
        )}

        {/* ĐÃ ĐIỀU CHỈNH: Thu nhỏ w-[420px], giảm p-6, đổi thành flex-col */}
        <div className="lg:w-105 lg:min-h-65 absolute bottom-[5%] left-[2%] md:left-[4%] bg-black/20 backdrop-blur-xl p-6 rounded-2xl text-white flex flex-col shadow-2xl">
          {/* PHẦN 1: LOGO - Dùng mb-auto để đẩy các phần tử bên dưới xuống đáy */}
          <div className="mb-auto">
            {logoPath ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${logoPath}`}
                alt="media-logo"
                className="w-48 lg:w-64 max-h-24 object-contain"
                loading="lazy"
              />
            ) : (
              <h1 className="text-xl lg:text-3xl font-bold tracking-tight">
                {data.title || data.name}
              </h1>
            )}
          </div>

          {/* PHẦN 2: IMDb & Ngày tháng - Dùng mt-8 để cách Logo chuẩn khoảng cách 8 */}
          <div className="hidden lg:flex items-center gap-8 mt-8">
            <div className="flex gap-2 items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                alt="IMDb-logo"
                className="w-10"
              />
              <p className="font-semibold text-white/90">
                {data.vote_average ? data.vote_average.toFixed(1) : 'N/A'}/10
              </p>
            </div>
            <p className="text-white/80">
              {data.release_date || data.first_air_date}
            </p>
          </div>

          {/* PHẦN 3: Nút bấm - Dùng mt-8 để cách phần IMDb chuẩn khoảng cách 8 */}
          <div className="flex items-center gap-8 mt-8">
            <Link
              to={videoURL}
              state={{
                mediaId: data.id,
                type: mediaType,
                name: data.title || data.name,
                poster_path: data.poster_path,
                vote_average: data.vote_average || 0,
                overview: data.overview,
                season: 1,
                episode: 1,
              }}
              className="backdrop-link bg-primary cursor-pointer hover:bg-primary/80 transition"
            >
              Xem Ngay
            </Link>
            <Link
              to={detailURL}
              state={{
                mediaId: data.id,
                type: mediaType,
              }}
              className="backdrop-link border border-white/30 backdrop-blur-xs cursor-pointer hover:bg-white/10 transition"
            >
              Thông tin
            </Link>
            <FavouriteButton movie={data} />
          </div>
        </div>

        <PageIndicator />
      </div>
    </div>
  )
}

export default MediaBanner
