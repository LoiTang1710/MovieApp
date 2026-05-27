import { useDetail } from '../../../../../../contexts/DetailContext'
import Genres from '../../../MediaInfo/Genres/Genres'
import IMDbScore from '../../../MediaInfo/IMDbScore/IMDbScore'
import Overview from '../../../MediaInfo/Overview/Overview'
import Poster from '../../../MediaInfo/Poster/Poster'
import Title from '../../../MediaInfo/Title/Title'

const ContentLeft = () => {
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
  console.log('type: ', type)
  return (
    <div className="bg-[#313030] p-10 flex flex-col gap-5 rounded-tl-lg rounded-bl-lg rounded-tr-4xl rounded-br-4xl">
      <Poster poster_path={poster_path} />
      <Title name={name}/>
      <div className="flex flex-wrap gap-4">
        <IMDbScore vote_average={vote_average}/>
        <Genres genres={genres}/>
      </div>
      <Overview overview={overview} />
      <div className="detail-horizontal">
        <h3 className="info-title">Thời lượng:</h3>
        <p className="info-detail">
          {run_time || 'N/A'} phút{type === 'tv' && '/tập'}
        </p>
      </div>
      <div className="detail-horizontal">
        <h3 className="info-title">Quốc gia:</h3>
        <p className="info-detail">{country?.join(', ') || 'N/A'}</p>
      </div>
      <a href="" className="detail-button px-6 lg:px-8 py-3 flex justify-center ">
        Đánh giá ngay
      </a>
    </div>
  )
}

export default ContentLeft
