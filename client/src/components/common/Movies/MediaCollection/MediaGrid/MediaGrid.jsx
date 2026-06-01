import MediaCard from './MediaCard.jsx/MediaCard'

const MediaGrid = ({ items = [], isPremium }) => {
  if (!items.length) {
    return <p className="text-sm text-white/40 py-4">Chưa có phim trong mục này.</p>
  }

  return (
    <div className="grid grid-cols-6 gap-3">
      {items.map((item) => {
        return <MediaCard key={item.id} item={item} isPremium={isPremium} />
      })}
    </div>
  )
}

export default MediaGrid
