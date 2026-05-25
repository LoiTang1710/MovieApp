import { useLocation, useNavigate } from 'react-router-dom'

import Episodes from '../../components/common/Movies/Seasons/Episodes/Episodes'
import Seasons from '../../components/common/Movies/Seasons/Seasons'

import Casts from '../../components/common/Movies/Casts/Casts'

const MediaPlayer = () => {
  
  const location = useLocation()
  const navigate = useNavigate()
  const {
    type,
    mediaId,
    season = 1,
    episode = 1,
    poster_path,
    name,
    vote_average,
    genres = [],
    overview,
  } = location.state || {}
  console.log('location.state: ', location.state)
  console.log('genres: ', genres)
  const embeddedURL =
    type === 'movie'
      ? `https://vidsrc.me/embed/movie/${mediaId}`
      : `https://vidsrc.me/embed/tv/${mediaId}/${season}/${episode}`

  return (
    <div className="p-10 flex flex-col gap-4">
      {/* Arrow Left + Quay ve thong tin phim */}
      <div className="flex flex-col gap-2 bg-bg-secondary p-5 border border-white/10 rounded-lg">
        <button
          onClick={() => navigate(-1)}
          className="text-[#00BDFD]/90 font-bold text-xl text-start cursor-pointer"
        >
          {name}
        </button>
        <div className="h-0.5 w-full bg-white/10" />
        <span className="font-semibold text-md">Đang xem tập {episode}</span>
      </div>
      {/* Media Player */}
      <div className="h-225">
        <iframe
          src={embeddedURL}
          frameborder="0"
          className="w-full h-full rounded-lg border border-white/10"
        ></iframe>
      </div>
      {/* Media Info */}
      <div>
        <div className="flex justify-between">
          <div className="flex flex-1 gap-6 text-white/70">
            <div>
              <img
                src={`https://image.tmdb.org/t/p/original${poster_path}`}
                alt="Poster"
                className="w-62"
              />
            </div>
            <div className="flex flex-1 flex-col gap-5">
              <p className="flex max-w-120 flex-wrap text-xl font-bold ">
                {name}
              </p>
              <div className="flex flex-wrap max-w-120 gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                    alt="IMDb-logo"
                    className="w-10"
                  />
                  <p>{vote_average.toFixed(1)}/10</p>
                </div>
              </div>
              <div className="flex flex-wrap max-w-100 gap-2">
                {genres.map((genre) => {
                  return (
                    <div
                      key={genre.id}
                      className="border border-[#00BDFD]/30 text-[#00BDFD]/70 rounded py-1 px-2  text-[12px]"
                    >
                      {genre.name}
                    </div>
                  )
                })}
              </div>
              <div>
                <p>Mô tả</p>
                <p className="text-xs flex flex-wrap max-w-100 font-light text-white/50">
                  {overview}
                </p>
              </div>
            </div>
          </div>
          <div>
            {/* <ActionButton/> */}
            <p>Action Button</p>
          </div>
        </div>
        {/* <Seasons /> */}
        <Seasons/>
        {/* Episode */}
        <Episodes />
        {/* Cast */}
        <Casts/>
      </div>
    </div>
  )
}

export default MediaPlayer
