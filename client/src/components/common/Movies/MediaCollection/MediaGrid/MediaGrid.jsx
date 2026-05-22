import MediaCard from './MediaCard.jsx/MediaCard'

const MediaGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-6 gap-3">
      {items.map((item) => {
        return <MediaCard key={item.id} item={item} />
      })}
    </div>
  )
}

export default MediaGrid
