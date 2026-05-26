import { Navigate, useLocation } from 'react-router-dom'
import { DetailContext } from '../contexts/DetailContext'
import { useMediaDetails } from '../hooks/useMediaDetail'
import { useState } from 'react'
import MediaDetailSkeleton from '../pages/MediaDetails/MediaDetailSkeleton'
// import { useState } from 'react'

const DetailProvider = ({ children }) => {
  // const [activeTab, setActiveTab] = useState()
  const location = useLocation()
  const { mediaId, type } = location.state || {}
  const {
    data: mediaDetail,
    isLoading,
    isError,
  } = useMediaDetails(mediaId, type)

  const [activeTab, setActiveTab] = useState('episodes')
  const [activeSeason, setActiveSeason] = useState(1)
  const [activeEpisode, setActiveEpisode] = useState(1)
  const seasonList = mediaDetail?.seasons.filter((s) => s.season_number > 0)
  console.log('seasonList: ', seasonList)
  if (!mediaId || !type) {
    return <Navigate to="/" replace />
  }
  if (isLoading) {
    return (
      <MediaDetailSkeleton/>
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
    <DetailContext.Provider
      value={{
        mediaId,
        type,
        casts: mediaDetail.credits?.cast || [],
        genres: mediaDetail.genres || [],
        backdrop_path: mediaDetail.backdrop_path,
        name: mediaDetail.name || mediaDetail.title,
        vote_average: mediaDetail.vote_average,
        overview: mediaDetail.overview,
        run_time:
          mediaDetail?.runtime || mediaDetail?.episode_run_time?.[0] || [],
        country: mediaDetail.origin_country,
        poster_path: mediaDetail.poster_path,
        activeTab,
        setActiveTab,
        seasonList,
        activeSeason,
        setActiveSeason,
        activeEpisode,
        setActiveEpisode
      }}
    >
      {children}
    </DetailContext.Provider>
  )
}

export default DetailProvider
