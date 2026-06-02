import { Link } from 'react-router-dom'
import { X, LogIn, UserPlus } from 'lucide-react'

const RequireLoginModal = ({ isOpen, onClose, message = "Bạn cần đăng nhập để thực hiện tính năng này." }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      ></div>

      <div
        className="relative bg-[#141414] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 p-6 flex flex-col items-center text-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
          <LogIn className="w-8 h-8 text-primary" />
        </div>

        <h3 className="text-white font-bold text-xl">Yêu cầu đăng nhập</h3>
        <p className="text-gray-400 text-sm mb-2">{message}</p>

        <div className="flex flex-col w-full gap-3 mt-2">
          <Link
            to="/login"
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Đăng nhập ngay
          </Link>
          <Link
            to="/register"
            className="w-full bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RequireLoginModal
