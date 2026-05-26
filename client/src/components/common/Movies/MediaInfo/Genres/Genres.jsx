

const Genres = ({genres}) => {
  return (
    <div className="flex flex-wrap max-w-100 gap-2">
      {genres.map((genre) => {
        return (
          <div
            key={genre.id}
            className="border border-[#00BDFD]/30 text-[#00BDFD]/70 rounded py-1 px-2  text-[12px]"
          >
            {genre.name}
          </div>
        )
      })}
    </div>
  )
}

export default Genres
