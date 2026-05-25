import { Bell, Search, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

const AppBar = () => {
  const { isAuthenticated: isLogged } = useAuth()
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
  ]

  return (
    <div id="AppBar">
      <div className="flex border-b border-white/20 justify-between items-center px-8 h-15 bg-black/95 backdrop-blur-sm top-0 w-full z-50">
        <div className="text-title text-red-600 text-3xl font-black tracking-tighter">
          <Link to="/" className="text-primary font-bold">
            <h1>Cinevibe</h1>
          </Link>
        </div>
        <div className="page-links hidden md:flex gap-8 text-white font-medium text-md">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.id}
                to={`${link.path}`}
                className="hover:text-red-600 transition-colors"
              >
                {link.name}
              </Link>
            )
          })}
        </div>
        <div className="action-icons flex justify-center items-center gap-6 text-white">
          <Search className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors" />
          {isLogged ? (
            <User className="text-red-600" />
          ) : (
            <div className='flex items-center justify-center'>
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
    </div>
  )
}

export default AppBar
