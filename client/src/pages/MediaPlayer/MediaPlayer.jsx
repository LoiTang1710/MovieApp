import { useLocation, useNavigate, useParams } from 'react-router-dom'

const MediaPlayer = () => {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const {
    type,
    season = 1,
    episode = 1,
    name = 'Pham nhan tu tien',
  } = location.state || []

  const id = slug.split('.').pop()
  const embeddedURL =
    type === 'movie'
      ? `https://vidsrc.me/embed/movie/${id}`
      : `https://vidsrc.me/embed/tv/${id}/${season}/${episode}`

  return (
    <div className="p-10 flex flex-col gap-4">
      {/* Arrow Left + Quay ve thong tin phim */}
      <div className="flex flex-col gap-2 bg-bg-secondary p-5 border border-white/10 rounded-lg">
        <button
          onClick={() => navigate(-1)}
          className="text-[#00BDFD]/90 font-bold text-xl text-start cursor-pointer"
        >
          {name}
        </button>
        <div className="h-0.5 w-full bg-white/10" />
        <span className="font-semibold text-md">Đang xem tập {episode}</span>
      </div>
      {/* Media Player */}
      <div className="h-225">
        <iframe
          src={embeddedURL}
          frameborder="0"
          className="w-full h-full rounded-lg border border-white/10"
        ></iframe>
      </div>
      {/* Content Left */}
      {/* <ContentLeft /> */}
      {/* Content Right */}
      {/* <ContentRight/> */}
    </div>
  )
}

export default MediaPlayer
