import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { DetailContext } from '../contexts/DetailContext'
import { DevAuthProvider } from '../contexts/DevAuthContext'
import { useMediaDetails } from '../hooks/useMediaDetail'
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
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const commentsSectionRef = useRef(null)
  const seasonList = mediaDetail?.seasons.filter((s) => s.season_number > 0)

  const scrollToComments = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (location.state?.scrollToCommunity) {
      const timer = setTimeout(scrollToComments, 400)
      return () => clearTimeout(timer)
    }
  }, [mediaDetail])

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
    <DevAuthProvider>
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
        setActiveEpisode,
        ratingModalOpen,
        setRatingModalOpen,
        commentsSectionRef,
        scrollToComments,
      }}
    >
      {children}
    </DetailContext.Provider>
    </DevAuthProvider>
  )
}

export default DetailProvider
