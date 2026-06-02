import { useSearchParams } from 'react-router-dom'
import { useSearch } from '../../hooks/useSearch'
import MediaGrid from '../../components/common/Movies/MediaCollection/MediaGrid/MediaGrid'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data: results, isLoading } = useSearch(query)

  return (
    <div className="min-h-screen pt-24 px-10 pb-10">
      <h1 className="text-3xl font-bold mb-8">
        Tìm kiếm từ khoá: <span className="text-primary">{query}</span>
      </h1>
      
      {isLoading ? (
        <div className="text-center text-white/50 py-10">Đang tìm kiếm...</div>
      ) : results && results.length > 0 ? (
        <MediaGrid items={results} />
      ) : (
        <div className="text-center text-white/50 py-10">Không tìm thấy kết quả phù hợp.</div>
      )}
    </div>
  )
}

export default Search
