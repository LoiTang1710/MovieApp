import WatchButton from './WatchButton/WatchButton'
// import FavouriteButton from './FavouriteButton/FavouriteButton'
import SendButton from './SendButton/SendButton'
import CommentButton from './CommentButton/CommentButton'
import { useDetail } from '../../../contexts/DetailContext'
import FavouriteButton from './FavouriteButton/FavouriteButton.jsx'

const ActionButton = () => {
  const { mediaId, type, name, poster_path, vote_average, release_date } = useDetail()
  
  const movie = {
    id: mediaId,
    title: name,
    poster_path: poster_path,
    vote_average: vote_average,
    media_type: type,
    release_date: release_date
  }

  return (
    <div className="w-full flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
      <WatchButton/>
      <div className="flex gap-4">
        <FavouriteButton movie={movie} />
        <SendButton/>
        <CommentButton/>
      </div>
    </div>
  )
}

export default ActionButton
