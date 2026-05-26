const MediaDetailSkeleton = () => {
  return (
    <div className="relative flex flex-col lg:flex-row justify-between p-10 z-10 animate-pulse gap-2 mt-10">
      {/* =========================================
          KHUNG BÊN TRÁI (Mô phỏng ContentLeft)
          ========================================= */}
      <div className="bg-[#313030] p-10 flex flex-col gap-5 rounded-tl-lg rounded-bl-lg rounded-tr-4xl rounded-br-4xl w-full lg:w-[35%] shadow-xl">
        {/* Poster giả lập */}
        <div className="w-50 aspect-2/3 bg-white/10 rounded-lg shadow-md"></div>

        {/* Tiêu đề */}
        <div className="w-3/4 h-8 bg-white/10 rounded mt-2"></div>

        {/* Điểm số & Thể loại */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="w-16 h-6 bg-white/10 rounded"></div>
          <div className="w-16 h-6 bg-white/10 rounded"></div>
          <div className="w-20 h-6 bg-white/10 rounded"></div>
        </div>

        {/* Mô tả (Overview) - 4 dòng */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="w-16 h-4 bg-white/10 rounded mb-1"></div>
          <div className="w-full h-3 bg-white/10 rounded"></div>
          <div className="w-full h-3 bg-white/10 rounded"></div>
          <div className="w-5/6 h-3 bg-white/10 rounded"></div>
        </div>

        {/* Thời lượng & Quốc gia */}
        <div className="flex gap-4 mt-2">
          <div className="w-20 h-4 bg-white/10 rounded"></div>
          <div className="w-24 h-4 bg-white/10 rounded"></div>
        </div>
        <div className="flex gap-4 mt-1">
          <div className="w-20 h-4 bg-white/10 rounded"></div>
          <div className="w-32 h-4 bg-white/10 rounded"></div>
        </div>

        {/* Nút Đánh giá */}
        <div className="w-40 h-12 bg-white/10 rounded-lg mt-4"></div>
      </div>

      {/* =========================================
          KHUNG BÊN PHẢI (Mô phỏng ContentRight)
          ========================================= */}
      <div className="w-full lg:w-[65%] p-10 bg-linear-to-b from-black/40 to-black/40 rounded-tl-4xl rounded-bl-4xl rounded-tr-lg rounded-br-lg flex flex-col gap-10">
        {/* Mô phỏng ActionButton (Nút Xem ngay + Các icon tym, share) */}
        <div className="w-full flex items-center justify-between border-b border-white/5 pb-8">
          {/* Nút Xem ngay */}
          <div className="w-48 h-14 bg-white/10 rounded-lg"></div>

          {/* Các nút icon */}
          <div className="flex gap-6">
            <div className="w-10 h-10 bg-white/10 rounded-full"></div>
            <div className="w-10 h-10 bg-white/10 rounded-full"></div>
            <div className="w-10 h-10 bg-white/10 rounded-full"></div>
          </div>
        </div>

        {/* Mô phỏng Tabs (Seasons) */}
        <div className="flex gap-6 mt-2">
          <div className="w-24 h-6 bg-white/10 rounded"></div>
          <div className="w-24 h-6 bg-white/10 rounded"></div>
        </div>

        {/* Mô phỏng Lưới Tập Phim (Episodes) */}
        <div className="mt-2">
          {/* Nút phân trang tập (1-50...) */}
          <div className="w-32 h-8 bg-white/10 rounded mb-4"></div>

          {/* Lưới các tập */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="w-full h-14 bg-white/5 rounded-xl"
              ></div>
            ))}
          </div>
        </div>

        {/* Mô phỏng Danh sách Diễn viên (Casts) */}
        <div className="mt-4">
          <div className="w-32 h-6 bg-white/10 rounded mb-4"></div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col gap-2 items-center">
                <div className="w-20 h-20 bg-white/5 rounded-full"></div>
                <div className="w-16 h-3 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaDetailSkeleton
