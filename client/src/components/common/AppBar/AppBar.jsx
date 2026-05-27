import { Bell, Menu, Search, User } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useState } from 'react'

const AppBar = () => {
  const { isAuthenticated: isLogged } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
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
            <User className="text-red-600" />
          ) : (
            <div className="flex items-center justify-center">
              <Link
                to={'/login'}
                className="hover:text-red-600 transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <p>/</p>
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
