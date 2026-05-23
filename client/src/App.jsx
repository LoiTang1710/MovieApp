import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MyList from "./pages/MyList/MyList";
import { AuthProvider } from './providers/AuthProvider';
import { HomeProvider } from './providers/HomeProvider';
import { AppProvider } from './providers/AppProvider';



const App = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <HomeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/my-list" element={<MyList />} />
            </Routes>
          </Router>
        </HomeProvider>
      </AuthProvider>
    </AppProvider>
  )
}

export default App
