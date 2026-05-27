import { Sidebar } from 'lucide-react'
import MediaBanner from '../../components/common/Movies/MediaBanner/MediaBanner'
import MediaCollection from '../../components/common/Movies/MediaCollection/MediaCollection'
import { useState } from 'react'
import { useHome } from '../../contexts/HomeContext'
import HomeSkeleton from './HomeSkeleton'

const Home = () => {
  const { isLoading, isError, error, mediaBanner, activeMediaId } = useHome()
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return <HomeSkeleton />
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-10 text-center">
        <h2 className="text-xl font-bold text-red-400">Không tải được dữ liệu trang chủ</h2>
        <p className="text-sm text-white/60 max-w-md">
          Trang chủ cần backend chạy tại <code className="text-primary">http://localhost:3000</code>.
          Mở terminal riêng: <code>cd server</code> rồi <code>npm run dev</code>.
        </p>
        <p className="text-xs text-white/40">{error?.message}</p>
      </div>
    )
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
