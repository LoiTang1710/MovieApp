import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Episodes from '../../components/common/Movies/MediaInfo/Seasons/Episodes/Episodes'
import Seasons from '../../components/common/Movies/MediaInfo/Seasons/Seasons'

// import FavouriteButton from '../../components/common/ActionButton/FavouriteButton/FavouriteButton'
import SendButton from '../../components/common/ActionButton/SendButton/SendButton'
import CommentButton from '../../components/common/ActionButton/CommentButton/CommentButton'
import IMDbScore from '../../components/common/Movies/MediaInfo/IMDbScore/IMDbScore'
import Genres from '../../components/common/Movies/MediaInfo/Genres/Genres'
import Overview from '../../components/common/Movies/MediaInfo/Overview/Overview'
import Title from '../../components/common/Movies/MediaInfo/Title/Title'
import Poster from '../../components/common/Movies/MediaInfo/Poster/Poster'
import Casts from '../../components/common/Movies/MediaInfo/Casts/Casts'
import { createSlug } from '../../utils/formatters'
import PremiumContentGate from '../../components/common/PremiumContentGate/PremiumContentGate'
import FavouriteButton from '../../components/common/ActionButton/FavouriteButton/FavouriteButton.jsx'

const MediaPlayer = () => {
  const location = useLocation()
  const stateData = location.state || {}
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
    release_date,
    isPremium
  } = stateData
  // const { data: movieDetail } = useMediaDetails(mediaId, type)
  // const isPremium = movieDetail?.isPremium ?? stateData.isPremium
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [season, episode])

  if (!type || !mediaId) {
    return (
      <div className="p-10 text-center text-white">
        Error: Missing media information
      </div>
    )
  }

  const embeddedURL =
    type === 'movie'
      ? `https://vidsrc.to/embed/movie/${mediaId}`
      : `https://vidsrc.to/embed/tv/${mediaId}/${season}/${episode}`

  const movieObj = {
    id: mediaId,
    title: name,
    poster_path,
    vote_average,
    media_type: type,
    release_date,
  }

  return (
    <div className="p-10 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2 bg-bg-secondary p-5 border border-white/10 rounded-lg">
        <Link
          to={`/movie/${createSlug(name || 'phim')}`}
          state={{
            mediaId,
            type,
            name,
            poster_path,
            vote_average,
            overview,
            isPremium,
            season: 1,
            episode: 1,
          }}
          className="text-[#00BDFD]/90 font-bold text-xl text-start cursor-pointer"
        >
          {name}
        </Link>
        <div className="h-0.5 w-full bg-white/10" />
        <span className="font-semibold text-md">Đang xem tập {episode}</span>
      </div>

      {/* Player Section */}
      <div className="h-150">
        <PremiumContentGate required={!!isPremium}>
          <iframe
            src={embeddedURL}
            key={`${season}-${episode}`}
            frameBorder="0"
            className="w-full h-full rounded-lg border border-white/10"
          ></iframe>
        </PremiumContentGate>
      </div>

      {/* Media Info */}
      <div>
        <div className="flex justify-between items-start">
          <div className="flex flex-1 gap-6 text-white/70">
            <Poster poster_path={poster_path} />
            <div className="flex flex-1 flex-col gap-5">
              <Title name={name} />
              <IMDbScore vote_average={vote_average} />
              <Genres genres={genres} />
              <Overview overview={overview} />
            </div>
          </div>
          <div className="flex gap-4">
            <FavouriteButton movie={movieObj} />
            <SendButton />
            <CommentButton />
          </div>
        </div>
        <Seasons />
        <Episodes />
        <Casts />
      </div>
    </div>
  )
}

export default MediaPlayer
