import { useState } from 'react'
import { useDetail } from '../../../contexts/DetailContext'
import { useDevAuth } from '../../../contexts/DevAuthContext'
import { useComments, useCreateComment } from '../../../hooks/useComments'
import { useRatingSummary } from '../../../hooks/useReviews'
import { getApiErrorMessage } from '../../../utils/apiError'
import DevAuthBanner from './DevAuthBanner'
import StarRating from './StarRating'
import CommentItem from './CommentItem'

const CommunitySection = () => {
  const { mediaId, type, commentsSectionRef } = useDetail()
  const { data: summary } = useRatingSummary(mediaId, type)
  const { data, isLoading, isError } = useComments(mediaId, type)
  const { isLoggedIn } = useDevAuth()
  const createComment = useCreateComment(mediaId, type)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      setError('Vui lòng bấm "Đăng nhập User" hoặc "Đăng nhập Admin" ở cột trái trước.')
      return
    }
    if (content.trim().length < 3) {
      setError('Bình luận phải có ít nhất 3 ký tự.')
      return
    }
    setError('')
    try {
      await createComment.mutateAsync(content.trim())
      setContent('')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không gửi được bình luận.'))
    }
  }

  return (
    <section
      id="community-section"
      ref={commentsSectionRef}
      className="mt-10 pt-8 border-t border-white/10"
    >
      <h2 className="text-2xl font-bold mb-2">Cộng đồng</h2>

      <DevAuthBanner />

      <div className="mb-6 flex items-center gap-3 text-sm">
        <StarRating value={Math.round(summary?.averageStars || 0)} readonly size={20} />
        <span>
          <strong className="text-yellow-400">{summary?.averageStars?.toFixed(1) ?? '0.0'}</strong>
          {' '}/ 5 · {summary?.totalRatings ?? 0} đánh giá
          {summary?.userRating != null && (
            <span className="text-white/50"> · Bạn: {summary.userRating}★</span>
          )}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận về phim..."
          rows={3}
          className="w-full rounded-lg bg-black/40 border border-white/15 px-4 py-3 text-sm outline-none focus:border-primary/50"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={createComment.isPending}
          className="detail-button mt-3 px-6 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {createComment.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-3">Bình luận mới nhất</h3>

      {isLoading && <p className="text-sm text-white/50">Đang tải bình luận...</p>}
      {isError && <p className="text-sm text-red-400">Không tải được bình luận.</p>}
      {!isLoading && !isError && data?.items?.length === 0 && (
        <p className="text-sm text-white/50">Chưa có bình luận. Hãy là người đầu tiên!</p>
      )}
      {data?.items?.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </section>
  )
}

export default CommunitySection
