import { useHome } from "../../../../contexts/HomeContext";

const PageIndicator = () => {
  const { mediaBanner, activeMediaId, setActiveMediaId } = useHome()

  return (
    <div className="absolute bottom-[5%] right-[3%]">
      <ul className="flex gap-3">
        {mediaBanner.map((movie) => {
          return (
            <li
              key={movie.id}
              onClick={() => setActiveMediaId(movie.id)}
              className={`indicator-bar ${movie.id === activeMediaId ? 'bg-primary' : 'bg-white/70'}`}
            ></li>
          )
        })}
      </ul>
    </div>
  )
};

export default PageIndicator;
