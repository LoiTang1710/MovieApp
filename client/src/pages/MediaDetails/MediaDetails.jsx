import { Navigate, useLocation } from 'react-router-dom'
import { useMediaDetails } from '../../hooks/useMediaDetail'

const MediaDetails = () => {
  const location = useLocation()
  const { mediaId, type } = location.state || {}
  const {
    data: mediaDetail,
    isLoading,
    isError,
  } = useMediaDetails(mediaId, type)
  if (!mediaId || !type) {
    return <Navigate to="/" replace />
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex justify-center items-center">
        <h2 className="text-2xl font-bold animate-pulse text-red-600">
          Đang tải dữ liệu phim...
        </h2>
      </div>
    )
  }
  if (isError || !mediaDetail) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex justify-center items-center">
        <h2 className="text-2xl font-bold text-red-500">
          Lỗi không thể tải thông tin phim.
        </h2>
      </div>
    )
  }
  return (
    <div>
      <div>
        <img
          src={`https://image.tmdb.org/t/p/original${mediaDetail.backdrop_path}`}
          alt="backdrop"
        />
      </div>
      <div className="flex justify-between p-10">
        {/* Right */}
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w500${mediaDetail.poster_path}`}
            alt="poster"
          />
          <h1>{mediaDetail.name || mediaDetail.title}</h1>
          <div>
            <div>
              <img src="" alt="IMDb-logo" />
              <p>{mediaDetail.vote_average}/10</p>
            </div>
            <div>
              <p>Genres</p>
            </div>
          </div>
          <div>
            <h3>Thời lượng</h3>
            <p>{mediaDetail.run_time || 'N/A'} phút</p>
          </div>
          <div>
            <h3>Quốc gia</h3>
            <p>{mediaDetail.origin_country?.join(', ') || 'N/A'}</p>
          </div>
          <a href="">Đánh giá ngay</a>
        </div>

        {/* Left */}
        <div>
          {/* Button Action */}
          <div>
            <a href="">Xem ngay</a>
            <div>
              <img src="" alt="Love" />
              <p>Yêu thích</p>
            </div>
            <div>
              <img src="" alt="Share" />
              <p>Chia sẻ ngay</p>
            </div>
            <div>
              <img src="" alt="Comment" />
              <p>Bình luận</p>
            </div>
          </div>
          {/* Episode List */}
          <div>
            <button>Tập phim</button>
            <button>Diễn viên</button>
          </div>
          {/* Rate and Comment */}
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default MediaDetails
