import { useEffect } from "react";
import AppBar from "../../components/common/AppBar/AppBar";
import Header from "../../components/Layouts/Header";
import Footer from "../../components/Layouts/Footer";
import { Sidebar } from "lucide-react";
import { useState } from "react";
import MovieBanner from "../../components/common/Movies/MovieBanner";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [moviesBanner, setMoviesBanner] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const tmdbkey = import.meta.env.VITE_ACCESS_TOKEN;
      try {
        fetch("https://api.themoviedb.org/3/movie/popular", {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${tmdbkey}`,
          },
        }).then(async (res) => {
          const data = await res.json();
          console.log(data);
          setMoviesBanner(data.results);
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
      {moviesBanner.length > 0 && <MovieBanner data={moviesBanner[5]} />}
      {isOpen && <Sidebar />}
      <Footer />
    </div>
  );
};

export default Home;
