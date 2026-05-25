import { Heart, MessageSquareMore, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createSlug } from '../../../utils/formatters'
import { useDetail } from '../../../contexts/DetailContext'
const ActionButton = () => {
  const { mediaId, name, type, poster_path, vote_average, genres, overview } = useDetail()
  const videoURL = `/video/${createSlug(name)}.${mediaId}`
  return (
    <div className="w-full flex items-center justify-between">
      <div className="mr-10">
        <Link
          to={videoURL}
          state={{ type, name, poster_path, vote_average, genres, overview, mediaId }}
          className="detail-button px-16 py-4"
        >
          ▶ Xem ngay
        </Link>
      </div>
      <div className="flex gap-4">
        <div className="icon-block">
          <Heart />
          <p>Yêu thích</p>
        </div>
        <div className="icon-block">
          <Send />
          <p>Chia sẻ ngay</p>
        </div>
        <div className="icon-block">
          <MessageSquareMore />
          <p>Bình luận</p>
        </div>
      </div>
    </div>
  )
}

export default ActionButton
