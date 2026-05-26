import { useDetail } from '../../../../../../contexts/DetailContext'
import { useTvEpisodes } from '../../../../../../hooks/useTvEpisodes'
import { Link, useLocation } from 'react-router-dom'
import { createSlug } from '../../../../../../utils/formatters'
import { useState } from 'react'
const Episodes = () => {
  const {
    mediaId,
    type,
    activeTab,
    activeSeason,
    name,
    poster_path,
    vote_average,
    genres,
    overview,
  } = useDetail()
  const location = useLocation()
  const isWatching = location.pathname.includes('/video')
  const {
    data: seasonData,
    isFetching,
  } = useTvEpisodes(mediaId, type, activeSeason)
  const chunkedEpisodes = seasonData?.chunkedEpisodes || []
  const [activeChunk, setActiveChunk] = useState(0)
  const [prevSeason, setPrevSeason] = useState(activeSeason)
  const currentEpisode = location?.state.episode || 1
  const [activeEpisode, setActiveEpisode] = useState(currentEpisode)
  const [prevEpisode, setPrevEpisode] = useState(activeEpisode)

  if (currentEpisode != prevEpisode) {
    setActiveEpisode(currentEpisode)
    setPrevEpisode(currentEpisode)
  }

  if (activeSeason != prevSeason) {
    setActiveChunk(0)
    setPrevSeason(activeSeason)
  }
  const displayEpisodes = chunkedEpisodes[activeChunk]
    ? [
        ...chunkedEpisodes[activeChunk].sort(
          (a, b) => a.episode_number - b.episode_number,
        ),
      ]
    : []
  const videoURL = `/video/${createSlug(name)}.${mediaId}`

  return (
    <div>
      <div></div>
      {/* Fetch va render episode */}
      <div className="mt-5">
        {activeTab === 'episodes' && (
          <div className="">
            {type === 'tv' && 
              <div
                className={`transition-opacity duration-300 ease-in-out ${isFetching ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
              >
                {chunkedEpisodes.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
                    {chunkedEpisodes.map((chunk, index) => (
                      <button
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
                <div className="grid grid-cols-5 gap-3">
                  {displayEpisodes.map((episode) => {
                    const isActive = isWatching && activeEpisode === episode.episode_number
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
                        }}
                        className={`p-4  rounded  cursor-pointer border border-white/5  flex gap-4 items-center group transition-colors ease-in-out duration-300 ${isActive ? 'bg-primary hover:bg-primary/90  shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'bg-white/5 hover:bg-white/10 '}`}
                      >
                        <p className="text-center w-full">
                          Tập {episode.episode_number}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Episodes
