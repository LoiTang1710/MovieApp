import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  TicketPercent, 
  BarChart3, 
  LogOut,
  Home
} from 'lucide-react'

const AdminLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout() // Xóa thông tin user và token trong localStorage & state
    navigate('/login') // Chuyển hướng về trang đăng nhập
  }

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/movies', icon: <Film size={20} />, label: 'Quản lý Phim' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Người dùng' },
    { path: '/admin/promotions', icon: <TicketPercent size={20} />, label: 'Khuyến mãi' },
    { path: '/admin/stats', icon: <BarChart3 size={20} />, label: 'Thống kê' },
  ]

  return (
    <div className="flex h-screen bg-[#0d0000] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a0000] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="text-2xl font-bold text-red-600 tracking-tighter flex items-center gap-2">
            MOVIE<span className="text-white">APP</span>
            <span className="text-[10px] bg-red-600 text-white px-1 rounded ml-1">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <Home size={20} />
            <span>Về trang chủ</span>
          </Link>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-900/20 hover:text-red-500 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#140000]">
          <h2 className="text-xl font-semibold">Hệ thống Quản trị</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm text-gray-400 italic">Chào, Admin</span>
          </div>
        </header>
        
        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AdminLayout