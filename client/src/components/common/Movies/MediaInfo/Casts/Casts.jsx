import { useDetail } from "../../../../../contexts/DetailContext"


const Casts = () => {
    const {activeTab,casts} = useDetail()
  return (
    <div>
      {activeTab === 'cast' && (
        <div className="grid grid-cols-5 gap-4 max-h-100 overflow-y-auto">
          {casts.map((actor) => (
            <div key={actor.id} className="flex flex-col justify-center items-center text-center">
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
  )
}

export default Casts
