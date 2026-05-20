import Anime from './Anime/Anime'
import MovieLine from './MovieLine'
import Popular from './Popular/Popular'
import Released from './Released/Released'
import TopRated from './TopRated/TopRated'
import Watching from './Watching/Watching'

const popular = () => <Popular />
const released = () => <Released />
const watching = () => <Watching />
const topRated = () => <TopRated />
const anime = () => <Anime />

const MovieCollection = () => {
  const collections = [
    {
      id: 1,
      name: 'Đang chiếu',
      component: watching,
    },
    {
      id: 2,
      name: 'Phổ biến',
      component: popular,
    },
    {
      id: 3,
      name: 'Mới nhất',
      component: released,
    },
    {
      id: 4,
      name: 'Top đánh giá',
      component: topRated,
    },
    {
      id: 5,
      name: 'Anime',
      component: anime,
    },
  ]
  return (
    <div className="mt-5 pt-5 pl-10 pr-10 pb-5">
      {collections.map((collection) => {
        const TargetComponent = collection.component
        const { id, name } = collection
        return (
          <div key={id}>
            <h1 className="text-3xl">{name}</h1>
            <MovieLine />
            <div className="mt-5">
              <TargetComponent />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MovieCollection
