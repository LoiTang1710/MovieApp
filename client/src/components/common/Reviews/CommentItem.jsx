import { useState } from 'react'
import { Heart, MessageCircle, Trash2 } from 'lucide-react'
import { useAdminDeleteComment, useCreateReply, useToggleLike } from '../../../hooks/useComments'
import { useDetail } from '../../../contexts/DetailContext'
import { useAuth } from '../../../hooks/useAuth.jsx'
import { getApiErrorMessage } from '../../../utils/apiError'

const formatDate = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const ReplyForm = ({ parentId }) => {
  const { mediaId, type } = useDetail()
  const { isAuthenticated, setIsLoginModalOpen } = useAuth()
  const reply = useCreateReply(mediaId, type)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      setError('Vui lòng đăng nhập trước khi trả lời.')
      return
    }

    if (text.trim().length < 3) {
      setError('Trả lời phải có ít nhất 3 ký tự.')
      return
    }

    try {
      await reply.mutateAsync({ parentId, content: text.trim() })
      setText('')
      setError('')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không gửi được trả lời.'))
    }
  }

  return (
    <form onSubmit={submit} className="mt-2 ml-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Viết trả lời..."
        rows={2}
        className="w-full rounded-md bg-black/40 border border-white/15 px-3 py-2 text-sm outline-none focus:border-white/30"
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      <button
        type="submit"
        disabled={reply.isPending}
        className="mt-1 text-xs text-primary font-semibold hover:underline disabled:opacity-50"
      >
        Gửi trả lời
      </button>
    </form>
  )
}

const CommentItem = ({ comment, isReply = false }) => {
  const { mediaId, type } = useDetail()
  const { user, isAuthenticated, setIsLoginModalOpen } = useAuth()
  const canModerate = user?.role?.toUpperCase() === 'ADMIN'
  const toggleLike = useToggleLike(mediaId, type)
  const adminDelete = useAdminDeleteComment(mediaId, type)
  const [showReply, setShowReply] = useState(false)

  const handleLike = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }
    toggleLike.mutate(comment.id)
  }

  const handleAdminDelete = async () => {
    if (!window.confirm('Xóa bình luận vi phạm này?')) return
    try {
      await adminDelete.mutateAsync(comment.id)
    } catch (err) {
      alert(getApiErrorMessage(err, 'Không xóa được bình luận.'))
    }
  }

  return (
    <div className={`${isReply ? 'ml-6 border-l border-white/10 pl-4' : ''} py-3 border-b border-white/5`}>
      <div className="flex justify-between gap-2">
        <span className="text-sm font-semibold text-white/90">{comment.user?.displayName}</span>
        <span className="text-xs text-white/40">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="mt-2 text-sm text-white/80 whitespace-pre-wrap">{comment.content}</p>
      <div className="mt-2 flex gap-4 text-xs">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1 ${comment.likedByMe ? 'text-red-400' : 'text-white/50 hover:text-white'}`}
        >
          <Heart size={14} className={comment.likedByMe ? 'fill-red-400' : ''} />
          {comment.likeCount}
        </button>
        {!isReply && (
          <button
            type="button"
            onClick={() => setShowReply((v) => !v)}
            className="flex items-center gap-1 text-white/50 hover:text-white"
          >
            <MessageCircle size={14} />
            Trả lời
          </button>
        )}
        {canModerate && (
          <button
            type="button"
            onClick={handleAdminDelete}
            disabled={adminDelete.isPending}
            className="flex items-center gap-1 text-red-400/80 hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 size={14} />
            Xóa
          </button>
        )}
      </div>
      {showReply && <ReplyForm parentId={comment.id} />}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  )
}

export default CommentItem
