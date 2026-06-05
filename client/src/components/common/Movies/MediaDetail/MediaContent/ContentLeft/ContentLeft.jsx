import { useDetail } from '../../../../../../contexts/DetailContext'
import Genres from '../../../MediaInfo/Genres/Genres'
import IMDbScore from '../../../MediaInfo/IMDbScore/IMDbScore'
import Overview from '../../../MediaInfo/Overview/Overview'
import Poster from '../../../MediaInfo/Poster/Poster'
import Title from '../../../MediaInfo/Title/Title'
import RatingModal from '../../../../Reviews/RatingModal'
import { useRatingSummary } from '../../../../../../hooks/useReviews'
import StarRating from '../../../../Reviews/StarRating'

const ContentLeft = () => {
  const {
    type,
    poster_path,
    name,
    vote_average,
    overview,
    run_time,
    country,
    genres,
    mediaId,
    setRatingModalOpen,
    ratingModalOpen,
  } = useDetail()

  const { data: communityRating } = useRatingSummary(mediaId, type)

  return (
    <div className="bg-[#313030] p-10 flex flex-col gap-5 rounded-tl-lg rounded-bl-lg rounded-tr-4xl rounded-br-4xl">
      <Poster poster_path={poster_path} />
      <Title name={name}/>
      <div className="flex flex-wrap gap-4">
        <IMDbScore vote_average={vote_average}/>
        <Genres genres={genres}/>
      </div>
      <Overview overview={overview} />
      <div className="detail-horizontal">
        <h3 className="info-title">Thời lượng:</h3>
        <p className="info-detail">
          {run_time || 'N/A'} phút{type === 'tv' && '/tập'}
        </p>
      </div>
      <div className="detail-horizontal">
        <h3 className="info-title">Quốc gia:</h3>
        <p className="info-detail">{country?.join(', ') || 'N/A'}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-white/70">
        <StarRating value={Math.round(communityRating?.averageStars || 0)} readonly size={16} />
        <span>
          Cộng đồng: {communityRating?.averageStars?.toFixed(1) ?? '0.0'} ({communityRating?.totalRatings ?? 0})
        </span>
      </div>

      <button
        type="button"
        onClick={() => setRatingModalOpen(true)}
        className="detail-button px-8 py-3 flex justify-center"
      >
        Đánh giá ngay
      </button>

      <RatingModal open={ratingModalOpen} onClose={() => setRatingModalOpen(false)} />
    </div>
  )
}

export default ContentLeft
