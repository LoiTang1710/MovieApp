import { useDetail } from '../../../../../../contexts/DetailContext'
import { useTvEpisodes } from '../../../../../../hooks/useTvEpisodes'
import { Link, useLocation } from 'react-router-dom'
import { createSlug } from '../../../../../../utils/formatters'
import { useState } from 'react'

// ==========================================
// 1. COMPONENT CON: CHỈ CHỊU TRÁCH NHIỆM RENDER TẬP PHIM
// ==========================================
const EpisodeList = () => {
  const {
    mediaId,
    type,
    activeSeason,
    name,
    poster_path,
    vote_average,
    genres,
    overview,
    isPremium,
  } = useDetail()

  const location = useLocation()
  const isWatching = location.pathname.includes('/video')

  const { data: seasonData, isFetching } = useTvEpisodes(
    mediaId,
    type,
    activeSeason,
  )

  const chunkedEpisodes = seasonData?.chunkedEpisodes || []

  // 👉 SẠCH SẼ HOÀN TOÀN: Không cần kiểm tra prevSeason hay prevEpisode
  // Vì Component này sẽ được tạo mới hoàn toàn mỗi khi đổi Season,
  // activeChunk sẽ TỰ ĐỘNG reset về 0.
  const [activeChunk, setActiveChunk] = useState(0)

  const currentEpisode = location?.state?.episode || 1
  const [activeEpisode, setActiveEpisode] = useState(currentEpisode)

  // Copy mảng an toàn và sort
  const displayEpisodes = chunkedEpisodes[activeChunk]
    ? [...chunkedEpisodes[activeChunk]].sort(
        (a, b) => a.episode_number - b.episode_number,
      )
    : []

  const videoURL = `/video/${createSlug(name)}.${mediaId}`

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${isFetching ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
    >
      {chunkedEpisodes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
          {chunkedEpisodes.map((chunk, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setActiveChunk(index)}
              className={`px-4 py-2 rounded text-sm font-bold transition-all duration-300 ${
                activeChunk === index
                  ? 'bg-[#00BDFD] text-black shadow-[0_0_15px_rgba(0,189,253,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Tập {chunk[0].episode_number} -{' '}
              {chunk[chunk.length - 1].episode_number}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {displayEpisodes.map((episode) => {
          const isActive =
            isWatching && activeEpisode === episode.episode_number
          return (
            <Link
              onClick={() => setActiveEpisode(episode.episode_number)}
              key={episode.id}
              to={videoURL}
              state={{
                mediaId,
                type,
                season: activeSeason,
                episode: episode.episode_number,
                name,
                poster_path,
                vote_average,
                genres,
                overview,
                isPremium,
              }}
              className={`p-4 rounded cursor-pointer border border-white/5 flex gap-4 items-center group transition-colors ease-in-out duration-300 ${isActive ? 'bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'bg-white/5 hover:bg-white/10 '}`}
            >
              <p className="text-center text-[8px] md:text-sm lg:text-lg w-full">
                Tập {episode.episode_number}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ==========================================
// 2. COMPONENT CHA: NƠI GỌI DANH SÁCH VÀ TRUYỀN KEY
// ==========================================
const Episodes = () => {
  const { type, activeTab, activeSeason } = useDetail()

  return (
    <div>
      <div></div>
      <div className="mt-5">
        {activeTab === 'episodes' && type === 'tv' && (
          // 👉 PHÉP MÀU NẰM Ở ĐÂY: Truyền key={activeSeason}
          // Khi activeSeason thay đổi, React sẽ hủy EpisodeList cũ và render EpisodeList mới.
          // Toàn bộ state bên trong EpisodeList tự động được dọn dẹp và làm mới.
          <EpisodeList key={activeSeason} />
        )}
      </div>
    </div>
  )
}

export default Episodes
