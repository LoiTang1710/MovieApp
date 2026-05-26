// src/components/common/Skeletons/HomeSkeleton.jsx
const HomeSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] animate-pulse">
      {/* 1. SKELETON BANNER: Cục xám bự trên cùng */}
      <div
        className="w-full max-h-96 md:max-h-128 lg:max-h-180 2xl:max-h-384 relative bg-white/5"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="absolute bottom-[5%] left-[2%] md:left-[4%] bg-black/20 p-6 rounded-2xl w-3/4 md:w-1/3 h-48 md:h-64 flex flex-col gap-4">
          <div className="w-2/3 h-10 bg-white/10 rounded-lg"></div>
          <div className="w-1/2 h-6 bg-white/10 rounded-lg mt-auto"></div>
          <div className="flex gap-4 mt-8">
            <div className="w-32 h-12 bg-white/10 rounded-lg"></div>
            <div className="w-32 h-12 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-5 pl-10 pr-10 pb-5">
        {[1, 2, 3].map((row) => (
          <div key={row} className="mt-12">
            <div className="w-48 h-8 bg-white/10 rounded-lg mb-8"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="w-full aspect-2/3 bg-white/5 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeSkeleton
