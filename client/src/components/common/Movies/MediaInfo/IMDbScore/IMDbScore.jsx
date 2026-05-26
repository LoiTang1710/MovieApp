

const IMDbScore = ({vote_average}) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
        alt="IMDb-logo"
        className="w-10"
      />
      <p>{vote_average.toFixed(1)}/10</p>
    </div>
  )
}

export default IMDbScore
