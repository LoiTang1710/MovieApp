import { Link } from 'react-router-dom'
import { useDetail } from '../../../../contexts/DetailContext'
import { createSlug } from '../../../../utils/formatters'

const WatchButton = () => {
  const {
    mediaId,
    name,
    type,
    poster_path,
    vote_average,
    genres,
    overview,
    isPremium,
  } = useDetail()
  const videoURL = `/video/${createSlug(name)}.${mediaId}`

  return (
    <div className="mr-0 lg:mr-10">
      <Link
        to={videoURL}
        state={{
          type,
          name,
          poster_path,
          vote_average,
          genres,
          overview,
          mediaId,
          isPremium,
        }}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-base md:text-lg px-10 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105"
      >
        ▶ Xem ngay
      </Link>
    </div>
  )
}

export default WatchButton
