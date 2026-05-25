import { useDetail } from "../../../../../contexts/DetailContext"


const MediaBackdrop = () => {
  const {backdrop_path} = useDetail()
  return (
    <div className="relative w-full h-full z-0">
      <img
        src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
        alt="backdrop"
      />
      <div className="absolute inset-0 backdrop-blur-2xl [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,transparent_100%,black_75%,black_100%)] mask-[linear-gradient(to_bottom,transparent_0%,transparent_40%,black_75%,black_100%)]" />

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-bg-default/40 to-bg-default" />
    </div>
  )
}
export default MediaBackdrop
