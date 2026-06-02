export const MovieCardSkeleton = () => {
  return (
    <div className="group animate-pulse">
      <div className="relative rounded overflow-hidden aspect-2/3 bg-white/5" />
      <p className="mt-2 h-4 bg-white/4 rounded w-3/4" />
      <p className="mt-1 h-3 bg-white/3 rounded w-1/2" />
    </div>
  )
}

export const MovieListSkeletonGrid = ({ count = 20 }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}
