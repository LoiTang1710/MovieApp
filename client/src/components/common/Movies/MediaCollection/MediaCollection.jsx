import { useHome } from '../../../../contexts/HomeContext'
import MediaGrid from './MediaGrid/MediaGrid'
import MovieLine from './MediaLine'

const MediaCollection = () => {
  const {
    mediasWatching,
    mediasPopular,
    mediasReleased,
    mediasTopRated,
    mediasAnime,
  } = useHome()
  const collections = [
    {
      id: 1,
      name: 'Đang xem',
      data: mediasWatching,
    },
    {
      id: 2,
      name: 'Phổ biến',
      data: mediasPopular,
    },
    {
      id: 3,
      name: 'Mới nhất',
      data: mediasReleased,
      isPremium: true,
    },
    {
      id: 4,
      name: 'Top đánh giá',
      data: mediasTopRated,
    },
    {
      id: 5,
      name: 'Anime',
      data: mediasAnime,
    },
  ]
  return (
    <div className="mt-5 pt-5 pl-10 pr-10 pb-5">
      {collections.map((collection) => {
        const { id, name, isPremium } = collection
        return (
          <div key={id} className="mt-12">
            <h1 className="text-3xl">{name}</h1>
            <MovieLine />
            <div className="mt-8">
              <MediaGrid items={collection.data} isPremium={isPremium} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MediaCollection
