import { MessageSquareMore } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDetail } from '../../../../contexts/DetailContext'
import { createSlug } from '../../../../utils/formatters'

const CommentButton = () => {
  const {
    scrollToComments,
    mediaId,
    type,
    name,
    poster_path,
    vote_average,
    overview,
  } = useDetail()
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
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleClick}
    >
      <button
        type="button"
        className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110"
      >
        <MessageSquareMore
          size={20}
          className="text-white group-hover:text-primary transition-colors"
        />
      </button>
      <p className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
        Bình luận
      </p>
    </div>
  )
}

export default CommentButton
