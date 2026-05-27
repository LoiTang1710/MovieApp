import { Star } from 'lucide-react'

const StarRating = ({ value = 0, onChange, readonly = false, size = 28 }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            className={readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}
            aria-label={`${star} sao`}
          >
            <Star
              size={size}
              className={filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
