import Header from '../../components/layouts/Header'
import Footer from '../../components/layouts/Footer'
import { Sidebar } from 'lucide-react'
import MediaBanner from '../../components/common/Movies/MediaBanner/MediaBanner'
import MediaCollection from '../../components/common/Movies/MediaCollection/MediaCollection'
import { useState } from 'react'
import { useHome } from '../../contexts/HomeContext'

const Home = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { mediaBanner, activeMediaId } = useHome()
  return (
    <div>
      <Header />
      {mediaBanner.length > 0 &&
        mediaBanner
          .filter((movie) => movie.id === activeMediaId)
          .map((movie) => {
            return <MediaBanner key={movie.id} />
          })}
      <MediaCollection />
      {isOpen && <Sidebar onClick={() => setIsOpen(!isOpen)} />}
      <Footer />
    </div>
  )
}

export default Home
