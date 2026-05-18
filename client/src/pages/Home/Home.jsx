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
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(`${import.meta.env.VITE_SERVER_URL}/api/movies/popular`, {
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
        console.log(error);
      }
    };
    fetchData();
  }, []);
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
              />
            );
          })}
      {isOpen && <Sidebar onClick={() => setIsOpen(!isOpen)} />}
      <Footer />
    </div>
  );
};

export default Home;
