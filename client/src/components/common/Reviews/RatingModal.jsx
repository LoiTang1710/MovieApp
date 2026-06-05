import { useState } from 'react'
import { X } from 'lucide-react'
import { useDetail } from '../../../contexts/DetailContext'
import { useAuth } from '../../../hooks/useAuth.jsx'
import { useRatingSummary, useUpsertRating } from '../../../hooks/useReviews'
import { getApiErrorMessage } from '../../../utils/apiError'
import StarRating from './StarRating'

const RatingDialog = ({ onClose, summary }) => {
  const { mediaId, type } = useDetail()
  const { isAuthenticated, setIsLoginModalOpen } = useAuth()
  const upsert = useUpsertRating(mediaId, type)
  const [stars, setStars] = useState(summary?.userRating ?? 0)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      setError('Vui lòng đăng nhập trước khi đánh giá.')
      return
    }

    if (stars < 1) {
      setError('Chọn từ 1 đến 5 sao.')
      return
    }

    setError('')
    try {
      await upsert.mutateAsync(stars)
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không thể gửi đánh giá.'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl bg-[#1c1b1b] border border-white/10 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Đánh giá phim</h3>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X size={22} />
          </button>
        </div>

        <p className="text-sm text-white/60 mb-2">
          Cộng đồng: ★ {summary?.averageStars?.toFixed(1) ?? '0.0'} ({summary?.totalRatings ?? 0} lượt)
        </p>

        <StarRating value={stars} onChange={setStars} size={36} />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={upsert.isPending}
          className="detail-button w-full mt-6 py-3 font-semibold disabled:opacity-50"
        >
          {upsert.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </div>
    </div>
  )
}

const RatingModal = ({ open, onClose }) => {
  const { mediaId, type } = useDetail()
  const { data: summary } = useRatingSummary(mediaId, type)

  if (!open) return null

  return (
    <RatingDialog
      key={`${mediaId}-${type}-${summary?.userRating ?? 'none'}`}
      onClose={onClose}
      summary={summary}
    />
  )
}

export default RatingModal
