import { MessageSquareMore } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDetail } from '../../../../contexts/DetailContext'
import { createSlug } from '../../../../utils/formatters'

const CommentButton = () => {
  const { scrollToComments, mediaId, type, name, poster_path, vote_average, overview } =
    useDetail()
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = () => {
    if (location.pathname.startsWith('/video')) {
      navigate(`/movie/${createSlug(name || 'phim')}`, {
        state: {
          mediaId,
          type,
          name,
          poster_path,
          vote_average,
          overview,
          scrollToCommunity: true,
        },
      })
      return
    }
    scrollToComments?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="icon-block hover:text-primary transition-colors"
    >
      <MessageSquareMore />
      <p>Bình luận</p>
    </button>
  )
}

export default CommentButton
