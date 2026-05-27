
const Poster = ({poster_path}) => {
  return (
    <div>
      <img
        src={`https://image.tmdb.org/t/p/original${poster_path}`}
        alt="Poster"
        className="w-31 lg:w-62"
      />
    </div>
  )
}

export default Poster
