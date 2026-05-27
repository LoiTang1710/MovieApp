import { Link } from "react-router-dom"
import { useDetail } from "../../../../contexts/DetailContext"
import { createSlug } from "../../../../utils/formatters"


const WatchButton = () => {
  const { mediaId, name, type, poster_path, vote_average, genres, overview } =
    useDetail()
  const videoURL = `/video/${createSlug(name)}.${mediaId}`
  return (
    <div className="mr-10">
      <Link
        to={videoURL}
        state={{
          type,
          name,
          poster_path,
          vote_average,
          genres,
          overview,
          mediaId,
        }}
        className="detail-button md:text-md lg:text-lg px-8 md:px-16 py-4"
      >
        ▶ Xem ngay
      </Link>
    </div>
  )
}

export default WatchButton
