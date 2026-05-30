import { Bell, Menu, Search, User, LogOut, Settings } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useState } from 'react'

const AppBar = () => {
  const { user, isAuthenticated: isLogged, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const navLinks = [
    {
      id: crypto.randomUUID(),
      name: 'Home',
      path: '/',
    },
    {
      id: crypto.randomUUID(),
      name: 'Movies',
      path: '/movies',
    },
    {
      id: crypto.randomUUID(),
      name: 'TV Shows',
      path: '/tv-shows',
    },
    {
      id: crypto.randomUUID(),
      name: 'My List',
      path: '/my-list',
    },
    {
      id: crypto.randomUUID(),
      name: 'Premium',
      path: '/premium',
    },
  ]

  // ✅ Hàm để lấy thông tin người dùng
  const getUserInfo = () => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName || user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Thêm các trường khác nếu có
      ...user
    };
  }

  // ✅ Hàm để kiểm tra quyền người dùng
  const hasRole = (role) => {
    return user?.role?.toUpperCase() === role.toUpperCase();
  }

  // ✅ Hàm để kiểm tra xem người dùng đã xác thực chưa
  const isUserAuthenticated = () => {
    return isLogged && user !== null;
  }

  // ✅ Hàm để lấy tên hiển thị của người dùng
  const getDisplayName = () => {
    return user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';
  }

  // ✅ Hàm để lấy avatar URL hoặc default
  const getAvatarUrl = () => {
    return user?.avatarUrl || null;
  }

  return (
    <div id="AppBar" className='relative w-full'>
      <div className="flex border-b border-white/20 justify-between items-center px-8 h-15 bg-black/95 backdrop-blur-sm top-0 w-full z-50">
        <div className="text-title text-red-600 text-3xl font-black tracking-tighter">
          <Link to="/" className="text-primary font-bold">
            <h1>Cinevibe</h1>
          </Link>
        </div>
        <div className="page-links hidden lg:flex gap-8 text-white font-medium text-md">
          {navLinks.map((link) => {
            return (
              <NavLink
                key={link.id}
                to={`${link.path}`}
                className={({ isActive }) =>
                  `transition-colors font-medium text-md ${
                    isActive
                      ? 'text-red-600 underline underline-offset-10 decoration-1' // Đỏ + gạch chân khi đang ở trang này
                      : 'text-white hover:text-red-600' // Trắng + hover đỏ khi ở trang khác
                  }`
                }
                onClick={() => setIsOpen(!isOpen)}
              >
                {link.name}
              </NavLink>
            )
          })}
        </div>
        <div className="action-icons flex justify-center items-center gap-6 text-white">
          <Search className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors" />
          <Bell className="w-5 h-5 hidden lg:block cursor-pointer hover:text-red-600 transition-colors" />
          <button type='button' className={`lg:hidden cursor-pointer hover:text-primary ${isOpen ? 'text-primary' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <Menu />
          </button>
          {isLogged ? (
            <div className="flex items-center gap-2 group relative cursor-pointer">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:text-red-600 transition-colors"
                title="Thông tin người dùng"
              >
                {getAvatarUrl() ? (
                  <img src={getAvatarUrl()} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-white/30" />
                ) : (
                  <User className="w-7 h-7 text-red-600" />
                )}
                <span className="hidden lg:block text-sm font-medium">
                  {getDisplayName()}
                </span>
              </button>

              {/* ✅ Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-black/95 border border-white/20 rounded-lg shadow-lg z-50">
                  {/* ✅ User Info Section */}
                  <div className="p-4 border-b border-white/20">
                    <p className="text-sm font-medium text-white">{getDisplayName()}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    {user?.role && (
                      <p className="text-xs text-red-500 mt-1 font-semibold">
                        {user.role.toUpperCase()}
                      </p>
                    )}
                  </div>

                  {/* ✅ User Stats Section */}
                  {user?.id && (
                    <div className="px-4 py-3 border-b border-white/20 grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-400">ID</p>
                        <p className="text-white font-mono text-xs truncate">{user.id}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Status</p>
                        <p className="text-green-400 font-semibold">Active</p>
                      </div>
                    </div>
                  )}
                  
                  {/* ✅ Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-white hover:bg-red-600/20 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Hồ sơ
                    </button>
                    
                    <button
                      onClick={async () => {
                        await logout();
                        setIsUserMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full px-4 py-2 text-sm text-white hover:bg-red-600/20 hover:text-red-600 transition-colors flex items-center gap-2 border-t border-white/20"
                    >
                      <LogOut size={16} />
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
              <p className="mx-1">/</p>
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
      {isOpen && (
        <div className="absolute z-10 top-full right-0 left-0 bg-bg-secondary/50 backdrop-blur-2xl lg:hidden flex flex-col justify-cente gap-4 py-4  items-center">
          {navLinks.map((link) => {
            return (
              <NavLink
                key={link.id}
                to={`${link.path}`}
                className={({ isActive }) =>
                  `transition-colors font-medium text-md ${
                    isActive
                      ? 'text-red-600 underline underline-offset-10 decoration-1' // Đỏ + gạch chân khi đang ở trang này
                      : 'text-white hover:text-red-600' // Trắng + hover đỏ khi ở trang khác
                  }`
                }
                onClick={() => setIsOpen(!isOpen)}
              >
                {link.name}
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AppBar
