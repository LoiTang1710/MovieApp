import { useDetail } from '../../../../contexts/DetailContext'

const Seasons = () => {
  const { activeTab, setActiveTab } = useDetail()
  return (
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
  )
}

export default Seasons
