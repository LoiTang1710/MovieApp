import { Bell, Menu, Search, User, LogOut, Settings } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.jsx'

const AppBar = () => {
  const { user, isAuthenticated: isLogged, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navLinks = [
    { id: crypto.randomUUID(), name: 'Home', path: '/' },
    { id: crypto.randomUUID(), name: 'Movies', path: '/movies' },
    { id: crypto.randomUUID(), name: 'TV Shows', path: '/tv-shows' },
    { id: crypto.randomUUID(), name: 'My List', path: '/my-list' },
    { id: crypto.randomUUID(), name: 'Premium', path: '/premium' },
  ]

  // ✅ CHỈ GIỮ LẠI NHỮNG HÀM THỰC SỰ ĐƯỢC GỌI TRONG GIAO DIỆN
  const getDisplayName = () =>
    user?.fullName || user?.name || user?.email?.split('@')[0] || 'User'
  const getAvatarUrl = () => user?.avatarUrl || null

  return (
    <div id="AppBar" className="relative w-full">
      <div className="flex border-b border-white/10 justify-between items-center px-8 h-15 bg-black/95 backdrop-blur-md top-0 w-full z-50">
        <div className="text-title text-red-600 text-3xl font-black tracking-tighter">
          <Link to="/" className="text-primary font-bold">
            <h1>Cinevibe</h1>
          </Link>
        </div>

        <div className="page-links hidden lg:flex gap-8 text-white font-medium text-md">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={`${link.path}`}
              className={({ isActive }) =>
                `transition-colors font-medium text-md ${
                  isActive
                    ? 'text-red-600 underline underline-offset-10 decoration-1'
                    : 'text-gray-300 hover:text-white hover:scale-105 transition-all'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="action-icons flex justify-center items-center gap-6 text-white">
          <Search className="w-5 cursor-pointer hover:text-red-600 transition-colors" />
          <Bell className="w-5 hidden lg:block cursor-pointer hover:text-red-600 transition-colors" />
          <button
            type="button"
            className={`lg:hidden cursor-pointer hover:text-primary ${isOpen ? 'text-primary' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu />
          </button>

          {isLogged ? (
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none relative z-50"
                title="Thông tin người dùng"
              >
                {getAvatarUrl() ? (
                  <img
                    src={getAvatarUrl()}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-red-600 transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-transparent hover:border-red-600 transition-colors">
                    <User className="w-4 text-gray-300" />
                  </div>
                )}
              </button>

              {/* Màn chắn click ra ngoài đóng menu */}
              {isUserMenuOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                ></div>
              )}

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-[130%] right-0 mt-3 w-72 bg-[#141414]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/50 transform transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="p-5 bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        {getAvatarUrl() ? (
                          <img
                            src={getAvatarUrl()}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-red-600/50 p-0.5"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center ring-2 ring-red-600/50 p-0.5">
                            <User className="w-6 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#141414] rounded-full"></div>
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-base font-bold text-white truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {user?.role && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-red-600/10 text-red-500 px-2.5 py-1 rounded-md border border-red-500/20">
                          {user.role}
                        </span>
                      )}
                      {user?.id && (
                        <span
                          className="text-[10px] text-gray-500 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 truncate max-w-30"
                          title={user.id}
                        >
                          ID: {user.id.split('-')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <Settings
                        size={18}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      />
                      Quản lý tài khoản
                    </button>

                    <div className="h-px bg-white/5 my-1 mx-3"></div>

                    <button
                      onClick={async () => {
                        await logout()
                        setIsUserMenuOpen(false)
                        navigate('/login')
                      }}
                      className="w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:text-white hover:bg-red-600/90 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <LogOut
                        size={18}
                        className="text-red-500 group-hover:text-white transition-colors"
                      />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Link
                to={'/login'}
                className="hover:text-red-600 transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <p className="mx-2 text-gray-600">/</p>
              <Link
                to={'/register'}
                className="hover:text-red-600 transition-colors text-sm font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute z-10 top-full right-0 left-0 bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col justify-center gap-4 py-6 items-center border-b border-white/10 shadow-2xl">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={`${link.path}`}
              className={({ isActive }) =>
                `transition-colors font-medium text-lg ${
                  isActive
                    ? 'text-red-600 underline underline-offset-8 decoration-2'
                    : 'text-gray-300 hover:text-white'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default AppBar
