import Header from '../../components/Layouts/Header'
import Footer from '../../components/Layouts/Footer'
import { Sidebar } from 'lucide-react'
import MovieBanner from '../../components/common/Movies/MoviesBanner/MovieBanner'
import MovieCollection from '../../components/common/Movies/MovieCollection/MovieCollection'
import { useState } from 'react'
import { useHome } from '../../contexts/HomeContext'

const Home = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { moviesBanner, activeMovieId } = useHome()
  return (
    <div>
      <Header />
      {moviesBanner.length > 0 &&
        moviesBanner
          .filter((movie) => movie.id === activeMovieId)
          .map((movie) => {
            return <MovieBanner key={movie.id} />
          })}
      <MovieCollection/>
      {isOpen && <Sidebar onClick={() => setIsOpen(!isOpen)} />}
      <Footer />
    </div>
  )
}

export default Home
