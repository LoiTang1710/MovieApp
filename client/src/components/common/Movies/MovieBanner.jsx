import { Heart } from "lucide-react";

const MovieBanner = (props) => {
  const data = props?.data || {};

  if (!data.backdrop_path) return null;

  return (
    <div className="relative">
      <img
        src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
        alt="backdrop-banner"
      />
      <div className="w-125.25 h-100.5 absolute bottom-8 left-8 bg-black/20 backdrop-blur-xl p-8 rounded-2xl text-white flex flex-col justify-between shadow-2xl">
        <div>
          <h1 className=" text-4xl">{data.title}</h1>
          <p className="mt-2">{data.release_date}</p>
          <p className="mt-4">{data.overview}</p>
        </div>
        <div className="flex items-center gap-8">
          <a className="backdrop-link bg-primary">Xem Ngay</a>
          <a className="backdrop-link border border-white/30 backdrop-blur-xs">
            Thông tin
          </a>
          <Heart />
        </div>
      </div>
    </div>
  );
};

export default MovieBanner;
