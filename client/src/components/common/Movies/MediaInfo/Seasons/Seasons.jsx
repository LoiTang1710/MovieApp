import { useDetail } from '../../../../../contexts/DetailContext'

const Seasons = () => {
  const {
    activeTab,
    setActiveTab,
    activeSeason,
    setActiveSeason,
    seasonList,
    type,
  } = useDetail()
  return (
    <div>
      <div className="mt-8 flex text-xl relative">
        <button
          type="button"
          onClick={() => setActiveTab('episodes')}
          className={`button-tab ${activeTab === 'episodes' ? 'text-primary' : 'text-gray-500 hover:text-white/60'}`}
        >
          Tập phim
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cast')}
          className={`button-tab ${activeTab === 'cast' ? 'text-primary' : 'text-gray-500 hover:text-white/60'}`}
        >
          Diễn viên
        </button>
        <div
          className={`absolute -bottom-px left-0 h-0.5 w-32 bg-primary transition-transform duration-300 ease-out z-10 ${
            activeTab === 'episodes' ? 'translate-x-0' : 'translate-x-full'
          }`}
        />
        <div className="absolute w-full bg-white/10 left-0 h-0.5 -bottom-px z-0" />
      </div>
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
    </div>
  )
}

export default Seasons
