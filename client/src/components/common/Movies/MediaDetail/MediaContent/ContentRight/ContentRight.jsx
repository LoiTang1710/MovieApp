import { Heart, MessageSquareMore, Send } from 'lucide-react'
import { useDetail } from '../../../../../../contexts/DetailContext'
import { useState } from 'react'
import { useTvEpisodes } from '../../../../../../hooks/useTvEpisodes'

const ContentLeft = () => {
  const { seasons, mediaId, type, casts} = useDetail()
  const [activeTab, setActiveTab] = useState('episodes')
  const [activeSeason, setActiveSeason] = useState(1)

  const { data: seasonData, isLoading } = useTvEpisodes(mediaId, type, seasons)
  console.log('seasonData: ', seasonData)
  const seasonList = seasons?.filter((s) => s.season_number > 0) || []
  const topCast = casts?.slice(0, 10) || []

  return (
    <div className="w-full ml-2 p-10 bg-linear-to-b from-black/40 to-black/40 rounded-tl-4xl rounded-bl-4xl rounded-tr-lg rounded-br-lg ">
      {/* Button Action */}
      <div className="w-full flex items-center justify-between">
        <div className="mr-10">
          <a href="" className="detail-button px-16 py-4">
            ▶ Xem ngay
          </a>
        </div>
        <div className="flex gap-4">
          <div className="icon-block">
            <Heart />
            <p>Yêu thích</p>
          </div>
          <div className="icon-block">
            <Send />
            <p>Chia sẻ ngay</p>
          </div>
          <div className="icon-block">
            <MessageSquareMore />
            <p>Bình luận</p>
          </div>
        </div>
      </div>
      {/* Episode List */}
      <div className="mt-8 flex text-xl relative">
        <button
          onClick={() => setActiveTab('episodes')}
          className={`button-tab ${activeTab === 'episodes' ? 'text-primary' : 'text-gray-500 hover:text-white/60'}`}
        >
          Tập phim
        </button>
        <button
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

      <div>
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

      <div>
        {activeTab === 'cast' && (
          <div className='grid grid-cols-5 gap-4 max-h-100 overflow-y-auto'>
            {topCast.map((actor) => (
              <div className='flex flex-col justify-center items-center'>
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : 'https://placehold.co/185x278?text=No+Image'
                  }
                  alt={actor.name}
                  className="w-20 h-20 object-cover rounded-full border-2 border-white/10 shadow-md"
                />
                <p>{actor.name}</p>
                <p>{actor.character}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rate and Comment */}
      <div></div>
    </div>
  )
}

export default ContentLeft
