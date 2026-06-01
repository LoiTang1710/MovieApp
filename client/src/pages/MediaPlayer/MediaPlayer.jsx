import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import Episodes from '../../components/common/Movies/MediaInfo/Seasons/Episodes/Episodes'
import Seasons from '../../components/common/Movies/MediaInfo/Seasons/Seasons'

import FavouriteButton from '../../components/common/ActionButton/FavouriteButton/FavouriteButton'
import SendButton from '../../components/common/ActionButton/SendButton/SendButton'
import CommentButton from '../../components/common/ActionButton/CommentButton/CommentButton'
import IMDbScore from '../../components/common/Movies/MediaInfo/IMDbScore/IMDbScore'
import Genres from '../../components/common/Movies/MediaInfo/Genres/Genres'
import Overview from '../../components/common/Movies/MediaInfo/Overview/Overview'
import Title from '../../components/common/Movies/MediaInfo/Title/Title'
import Poster from '../../components/common/Movies/MediaInfo/Poster/Poster'
import Casts from '../../components/common/Movies/MediaInfo/Casts/Casts'
import { createSlug } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

const LoginRequiredOverlay = ({ onLogin }) => (
  <div className="w-full h-full rounded-lg border border-white/10 bg-black/80 flex flex-col items-center justify-center text-center p-6 gap-4">
    <h2 className="text-2xl font-bold text-white">Yêu cầu đăng nhập</h2>
    <p className="text-white/70">Bạn cần đăng nhập để xem nội dung phim mới phát hành.</p>
    <button
      onClick={onLogin}
      className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/80 transition"
    >
      Đăng nhập ngay
    </button>
  </div>
)

const PremiumRequiredOverlay = ({ onUpgrade }) => (
  <div className="w-full h-full rounded-lg border border-white/10 bg-gradient-to-br from-yellow-900 to-black flex flex-col items-center justify-center text-center p-6 gap-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
    <div className="z-10 flex flex-col items-center justify-center gap-4">
      <h2 className="text-3xl font-bold text-yellow-500">Nội Dung Premium</h2>
      <p className="text-white/80 max-w-md">Phim mới phát hành hiện đang nằm trong danh mục Premium. Vui lòng nâng cấp gói thành viên của bạn để tiếp tục xem.</p>
      <button
        className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition shadow-[0_0_15px_rgba(234,179,8,0.5)]"
        onClick={onUpgrade}
      >
        Nâng cấp Premium
      </button>
    </div>
  </div>
)

const MediaPlayer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

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
    isPremium,
  } = location.state || {}

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
      ? `https://vidsrc.me/embed/movie/${mediaId}`
      : `https://vidsrc.me/embed/tv/${mediaId}/${season}/${episode}`

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
        {isPremium && !isAuthenticated ? (
          <LoginRequiredOverlay onLogin={() => navigate('/login')} />
        ) : isPremium && isAuthenticated ? (
          <PremiumRequiredOverlay onUpgrade={() => navigate('/premium')} />
        ) : (
          <iframe
            src={embeddedURL}
            key={`${season}-${episode}`}
            frameBorder="0"
            className="w-full h-full rounded-lg border border-white/10"
          ></iframe>
        )}
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
