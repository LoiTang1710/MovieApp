import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="w-full">
      <div className="w-full bg-[#1F1F1F] border-t border-white/10 p-10">
        <h1 className="text-primary text-center text-4xl mb-2 font-bold">
          Cinevibe
        </h1>
        <p className="text-center text-[#A3A3A3]">
          Nền tảng xem phim trực tuyến hàng đầu Việt Nam. <br /> Trải nghiệm
          điện ảnh đỉnh cao ngay tại nhà.
        </p>
        <div className="flex gap-5 justify-center mt-5">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-neutral-700 hover:bg-primary transition w-12 h-12 flex items-center justify-center">
            <FaFacebook size={22} className="text-white" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-neutral-700 hover:bg-primary transition w-12 h-12 flex items-center justify-center">
            <FaTwitter size={22} className="text-white" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-neutral-700 hover:bg-primary transition w-12 h-12 flex items-center justify-center">
            <FaInstagram size={22} className="text-white" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-neutral-700 hover:bg-primary transition w-12 h-12 flex items-center justify-center">
            <FaYoutube size={22} className="text-white" />
          </a>
        </div>
        <p className="text-center mt-4 text-[#A3A3A3]">© 2026 CINEVIBE. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
