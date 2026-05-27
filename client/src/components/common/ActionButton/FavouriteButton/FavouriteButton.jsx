import { Heart } from "lucide-react"

const FavouriteButton = () => {
  return (
    <div className="icon-block">
      <Heart className="w-6 lg:w-16" />
      <p className="action-subtitle">Yêu thích</p>
    </div>
  )
}

export default FavouriteButton
