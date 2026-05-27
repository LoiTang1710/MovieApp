import { useDetail } from "../../../../../contexts/DetailContext"
import { useTvEpisodes } from "../../../../../hooks/useTvEpisodes"

const Episodes = () => {
  const {
    mediaId,
    activeSeason,
    setActiveSeason,
    seasonList,
    type,
    seasons,
    activeTab,
  } = useDetail()
      const { data: seasonData, isLoading } = useTvEpisodes(
        mediaId,
        type,
        seasons,
      )
  return (
    <div>
      {activeTab === 'episodes' && (
        <div className="pb-2 mt-10">
          {activeTab === 'episodes' &&
            (type === 'tv' && seasonList.length > 0 ? (
              <select
                value={activeSeason}
                onChange={(e) => setActiveSeason(Number(e.target.value))}
                className=""
              >
                {seasonList.map((season) => (
                  <option
                    key={season.id}
                    value={season.season_number}
                    className="bg-[#111]"
                  >
                    Mùa {season.season_number} ({season.episode_count} Tập)
                  </option>
                ))}
              </select>
            ) : type === 'movie' ? (
              <select className="">
                <option>Bản Full (1 Tập)</option>
              </select>
            ) : null)}
        </div>
      )}
      {/* Fetch va render episode */}
      <div className="mt-5">
        {activeTab === 'episodes' && (
          <div className="max-h-70 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-bg-default/10 [&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-6">
            {type === 'tv' && isLoading ? (
              <div>Đang tải tập phim</div>
            ) : (
              <div className="grid grid-cols-5 gap-3">
                {seasonData?.episodes
                  .sort((a, b) => b.episode_number - a.episode_number)
                  .map((episode) => (
                    <div
                      key={episode.id}
                      className="p-4 bg-white/5 rounded hover:bg-white/10 cursor-pointer border border-white/5 flex gap-4 items-center group transition-colors ease-in-out duration-300"
                    >
                      <p className="">Tập {episode.episode_number}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Episodes
