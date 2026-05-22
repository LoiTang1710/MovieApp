import { Bell, Search, User } from 'lucide-react'

const AppBar = () => {
  const isLogged = false
  return (
    <div id="AppBar">
      <div className="flex justify-between items-center pl-8 pr-8 h-16 bg-black ">
        <div className="text-title text-primary text-2xl font-bold">
          <h1>Cinevibe</h1>
        </div>
        <div className="page-links flex gap-8 text-white ">
          <a href="#" className="hover:text-primary">
            Home
          </a>
          <a href="" className="hover:text-primary">
            Movies
          </a>
          <a href="" className="hover:text-primary">
            TV Shows
          </a>
          <a href="" className="hover:text-primary">
            My List
          </a>
        </div>
        <div className="action-icons flex justify-center items-center gap-6 text-primary">
          <Search />
          <Bell  />
          {
            isLogged ?( <User/>) : (
              <div className='hover:underline cursor-pointer'>Login/Register</div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AppBar;
