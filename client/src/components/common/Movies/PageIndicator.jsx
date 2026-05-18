const PageIndicator = ({ movies, activeMovieId, setActiveMovieId }) => {
  return (
    <div className="absolute bottom-[5%] right-[3%]">
      <ul className="flex gap-3">
        {movies.map((movie) => {
          return (
            <li
              key={movie.id}
              onClick={() => setActiveMovieId(movie.id)}
              
              className={`indicator-bar ${movie.id === activeMovieId ? "bg-primary" : "bg-white/70"}`}
            ></li>
          );
        })}
      </ul>
    </div>
  );
};

export default PageIndicator;
