import { Bell, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const AppBar = () => {
  const { isAuthenticated: isLogged } = useAuth();

  return (
    <div id="AppBar">
      <div className="flex justify-between items-center px-8 h-20 bg-black/95 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="text-title text-red-600 text-3xl font-black tracking-tighter">
          <Link to="/"><h1>CINEVIBE</h1></Link>
        </div>
        <div className="page-links hidden md:flex gap-8 text-white font-medium text-sm">
          <Link to="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <Link to="/movies" className="hover:text-red-600 transition-colors">
            Movies
          </Link>
          <Link to="/tv-shows" className="hover:text-red-600 transition-colors">
            TV Shows
          </Link>
          <Link to="/my-list" className="hover:text-red-600 transition-colors">
            My List
          </Link>
        </div>
        <div className="action-icons flex justify-center items-center gap-6 text-white">
          <Search className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors" />
          {
            isLogged ? (<User className="text-red-600" />) : (
              <Link to="/login" className='hover:text-red-600 transition-colors text-sm font-medium'>Login/Register</Link>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AppBar;
