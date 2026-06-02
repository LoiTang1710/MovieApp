import { Bell, Menu, Search, User, LogOut, Settings, X, Star } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth.jsx'
import { useMyPremiumSubscription } from '../../../hooks/usePremium.jsx'
import { useDebounce } from '../../../hooks/useDebounce.jsx'
import { useSearch } from '../../../hooks/useSearch.jsx'
import { createSlug } from '../../../utils/formatters.js'

const AppBar = () => {
  const { user, isAuthenticated: isLogged, logout } = useAuth()
  const { data: premiumSubscription } = useMyPremiumSubscription({
    enabled: isLogged,
  })
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { data: searchResults, isLoading: isSearching } = useSearch(debouncedSearchTerm)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navLinks = [
    { id: crypto.randomUUID(), name: 'Home', path: '/' },
    { id: crypto.randomUUID(), name: 'Movies', path: '/movies' },
    { id: crypto.randomUUID(), name: 'TV Shows', path: '/tv-shows' },
    { id: crypto.randomUUID(), name: 'My List', path: '/my-list' },
    { id: crypto.randomUUID(), name: 'Premium', path: '/premium' },
  ]

  const getDisplayName = () =>
    user?.fullName || user?.name || user?.email?.split('@')[0] || 'User'
  const getAvatarUrl = () => user?.avatarUrl || null

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      setSearchTerm('')
    }
  }

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setIsSearchOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <div id="AppBar" className="relative w-full">
      <div className="flex border-b border-white/10 justify-between items-center px-8 h-15 bg-black/95 backdrop-blur-md top-0 w-full z-50">
        <div className="text-title text-red-600 text-3xl font-black tracking-tighter shrink-0">
          <Link to="/" className="text-primary font-bold">
            <h1>Cinevibe</h1>
          </Link>
        </div>

        <div className="page-links hidden lg:flex gap-8 text-white font-medium text-md flex-1 justify-center relative z-10">
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

        <div className="action-icons flex justify-end items-center gap-6 text-white shrink-0 relative z-20">
          {/* SEARCH BAR */}
          <div
            ref={searchContainerRef}
            className="relative flex items-center justify-end w-8 h-8"
          >
            <Search
              className={`w-5 cursor-pointer hover:text-red-600 transition-all absolute right-1 z-10 ${isSearchOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
              onClick={handleSearchToggle}
            />

            <div
              className={`absolute right-0 flex items-center transition-all duration-300 origin-right bg-black/60 backdrop-blur-xl border border-white/20 rounded-full ${isSearchOpen ? 'w-64 md:w-80 opacity-100 scale-x-100' : 'w-0 opacity-0 scale-x-0'}`}
            >
              <Search className="w-4 h-4 ml-3 text-white/50 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Phim, diễn viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full bg-transparent border-none text-sm text-white px-3 py-1.5 focus:outline-none"
              />
              {searchTerm && (
                <X
                  className="w-4 h-4 mr-3 text-white/50 cursor-pointer hover:text-white shrink-0"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>

            {/* LIVE SEARCH RESULTS DROPDOWN */}
            {isSearchOpen && searchTerm && (
              <div className="absolute top-[140%] right-0 w-80 max-h-[70vh] bg-[#141414]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                {isSearching ? (
                  <div className="p-4 text-center text-white/50 text-sm">
                    Đang tìm kiếm...
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="flex flex-col p-2">
                    {searchResults.slice(0, 5).map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${createSlug(movie.name || movie.title)}`}
                        state={{
                          mediaId: movie.id,
                          type: movie.type || 'movie',
                        }}
                        onClick={() => {
                          setIsSearchOpen(false)
                          setSearchTerm('')
                        }}
                        className="flex gap-3 p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                      >
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                              : 'https://via.placeholder.com/92x138?text=No+Image'
                          }
                          alt="poster"
                          className="w-12 h-16 object-cover rounded-md shrink-0"
                        />
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {movie.title || movie.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                              alt="IMDb-logo"
                              className="w-7"
                            />
                            <span className="text-xs text-white/70">
                              {movie.vote_average
                                ? movie.vote_average.toFixed(1)
                                : 'N/A'}/10
                            </span>
                            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/70 uppercase">
                              {movie.type === 'tv' ? 'TV' : 'Movie'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={() => handleSearchSubmit({ key: 'Enter' })}
                      className="w-full mt-2 py-2 text-sm text-center text-primary hover:bg-white/5 rounded-t rounded-b-xl transition-colors font-medium"
                    >
                      Xem tất cả kết quả
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-white/50 text-sm">
                    Không tìm thấy kết quả.
                  </div>
                )}
              </div>
            )}
          </div>
          {/* END SEARCH BAR */}

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
                      {premiumSubscription && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400/10 text-amber-300 px-2.5 py-1 rounded-md border border-amber-400/20">
                          Premium
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
                    {premiumSubscription && (
                      <p className="mt-3 text-[11px] text-amber-200/70">
                        {premiumSubscription.plan.name} · Hết hạn{' '}
                        {new Intl.DateTimeFormat('vi-VN').format(
                          new Date(premiumSubscription.endAt),
                        )}
                      </p>
                    )}
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        navigate('/profiles')
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
