import { Sidebar } from 'lucide-react'
import MediaBanner from '../../components/common/Movies/MediaBanner/MediaBanner'
import MediaCollection from '../../components/common/Movies/MediaCollection/MediaCollection'
import { useState } from 'react'
import { useHome } from '../../contexts/HomeContext'
import HomeSkeleton from './HomeSkeleton'

const Home = () => {
  const {isLoading} = useHome()
  const [isOpen, setIsOpen] = useState(false)
  const { mediaBanner, activeMediaId } = useHome()
  if(isLoading) {
    return (<HomeSkeleton/>)
  }
  return (
    <div>
      {mediaBanner.length > 0 &&
        mediaBanner
          .filter((movie) => movie.id === activeMediaId)
          .map((movie) => {
            return <MediaBanner key={movie.id} />
          })}
      <MediaCollection />
      {isOpen && <Sidebar onClick={() => setIsOpen(!isOpen)} />}
    </div>
  )
}

export default Home
