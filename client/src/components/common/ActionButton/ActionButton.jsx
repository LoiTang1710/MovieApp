import WatchButton from './WatchButton/WatchButton'
import FavouriteButton from './FavouriteButton/FavouriteButton'
import SendButton from './SendButton/SendButton'
import CommentButton from './CommentButton/CommentButton'

const ActionButton = () => {
  
  return (
    <div className="w-full flex items-center justify-between">
      <WatchButton/>
      <div className="flex gap-4">
        <FavouriteButton/>
        <SendButton/>
        <CommentButton/>
      </div>
    </div>
  )
}

export default ActionButton
