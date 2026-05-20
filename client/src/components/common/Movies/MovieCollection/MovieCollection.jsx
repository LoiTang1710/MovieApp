import Popular from "./Popular/Popular"

const MovieCollection = (props) => {
  return (
    <div>
      <Popular moviesCardPopular= {props.moviesCardPopular}/>
    </div>
  )
}

export default MovieCollection
