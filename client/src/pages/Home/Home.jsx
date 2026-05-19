import { useEffect } from "react";
import Header from "../../components/Layouts/Header";
import Footer from "../../components/Layouts/Footer";
import { Sidebar } from "lucide-react";
import { useState } from "react";
import MovieBanner from "../../components/common/Movies/MovieBanner";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loved, setLoved] = useState(false);
  const [moviesBanner, setMoviesBanner] = useState([]);
  const [activeMovieId, setActiveMovieId] = useState();
  const [movieTrailer, setMovieTrailer] = useState(null);

  useEffect(() => {
    const fetchPopularData = async () => {
      try {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/movies/popular`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }).then(async (res) => {
          const data = await res.json();
          const popularMovies = data.results.slice(0, 4);
          console.log(popularMovies);
          setMoviesBanner(popularMovies);
          setActiveMovieId(popularMovies[0].id);
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchPopularData();
  }, []);

  useEffect(() => {
    if (!activeMovieId) return;
    const fetchTrailer = async () => {
      try {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/movies/trailer/${activeMovieId}`, {
          method: 'GET',
          headers: {
            accept: 'application/json'
          }
        }).then(async (res) => {
          const data = await res.json();
          if (data && data.results) {
            const trailer = data.results.find((vid) => vid.site === "YouTube" && vid.type === "Trailer") || data.results[0];
            setMovieTrailer(trailer ? trailer.key : null);
          } else {
            setMovieTrailer(null);
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetchTrailer();
  }, [activeMovieId]);
  return (
    <div>
      <Header />
      {moviesBanner.length > 0 &&
        moviesBanner
          .filter((movie) => movie.id === activeMovieId)
          .map((movie) => {
            return (
              <MovieBanner
                activeMovieId={activeMovieId}
                setActiveMovieId={setActiveMovieId}
                movies={moviesBanner}
                key={movie.id}
                data={movie}
                loved={loved}
                setLoved={setLoved}
                trailerKey={movieTrailer}
              />
            );
          })}
      {isOpen && <Sidebar onClick={() => setIsOpen(!isOpen)} />}
      <Footer />
    </div>
  );
};

export default Home;
