const Footer = () => {
  return (
    <div className="">
      <div className="h-70 w-full bg-[#1F1F1F] border-t border-white/10 p-10">
        <h1 className="text-primary text-center text-4xl mb-2 font-bold">
          Cinevibe
        </h1>
        <p className="text-center text-[#A3A3A3]">
          Nền tảng xem phim trực tuyến hàng đầu Việt Nam. <br /> Trải nghiệm
          điện ảnh đỉnh cao ngay tại nhà.
        </p>
        <div className="flex gap-5 justify-center mt-5">
          <a href="" className="dots-link"></a>
          <a href="" className="dots-link"></a>
          <a href="" className="dots-link"></a>
          <a href="" className="dots-link"></a>
        </div>
        <p className="text-center mt-4 text-[#A3A3A3]">© 2026 CINEVIBE. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
