import { useDetail } from '../../../../../../contexts/DetailContext'

const ContentRight = () => {
  const {
    type,
    poster_path,
    name,
    vote_average,
    overview,
    run_time,
    country,
    genres,
  } = useDetail()
  console.log("type: ", type)
  return (
    <div className="bg-[#313030] p-10 flex flex-col gap-5 rounded-tl-lg rounded-bl-lg rounded-tr-4xl rounded-br-4xl">
      <img
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt="poster"
        className="w-50"
      />
      <h1 className="text-2xl">{name}</h1>
      <div className='flex flex-wrap gap-4'>
        <div className="flex items-center gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
            alt="IMDb-logo"
            className="w-10"
          />
          <p>{vote_average.toFixed(1)}/10</p>
        </div>

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
      <div className="w-100 detail-vertical">
        <span className="info-title">Mô tả</span>
        <p className="info-detail">{overview}</p>
      </div>
      <div className="detail-horizontal">
        <h3 className="info-title">Thời lượng:</h3>
        <p className="info-detail">{run_time || 'N/A'} phút{type === 'tv' && '/tập'}</p>
      </div>
      <div className="detail-horizontal">
        <h3 className="info-title">Quốc gia:</h3>
        <p className="info-detail">{country?.join(', ') || 'N/A'}</p>
      </div>
      <a href="" className="detail-button px-8 py-3 flex justify-center "> 
        Đánh giá ngay
      </a>
    </div>
  )
}

export default ContentRight
