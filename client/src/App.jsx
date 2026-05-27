import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Auth/Login/Login' 
import Register from './pages/Auth/Register/Register' 
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword' 
import MyList from './pages/MyList/MyList'
import { AuthProvider } from './contexts/AuthContext'
import { HomeProvider } from './providers/HomeProvider'
import { AppProvider } from './providers/AppProvider'
import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'
import { ProfileSelection, ProfileManage, ProfileForm } from './pages/Profiles'
import MediaDetails from './pages/MediaDetails/MediaDetails'
import DetailProvider from './providers/DetailProvider'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from './components/layouts/AdminLayout'
import MediaPlayer from './pages/MediaPlayer/MediaPlayer'

const RootLayout = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </AppProvider>
  )
}
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // === NHÓM 1: CÁC TRANG CÓ NAVBAR & FOOTER ===
      {
        element: <MainLayout />, // Đặt khung Layout ở đây
        children: [
          {
            path: '/',
            element: (
              <HomeProvider>
                <Home />
              </HomeProvider>
            ),
          },
          {
            path: '/movie/:slug',
            element: (
              <DetailProvider>
                <MediaDetails />
              </DetailProvider>
            ),
          },
          {
            path: '/video/:slug',
            element: (
              <MediaPlayer/>
            )
          },
          {
            path: '/my-list',
            element: <MyList />,
          },
        ],
      },

      // === NHÓM 2: CÁC TRANG ĐỘC LẬP (KHÔNG CÓ NAVBAR/FOOTER) ===
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },

      // === NHÓM 3: TRANG QUẢN LÝ HỒ SƠ (AuthLayout) ===
      {
        path: '/profiles',
        element: <AuthLayout><ProfileSelection /></AuthLayout>,
      },
      {
        path: '/profiles/manage',
        element: <AuthLayout><ProfileManage /></AuthLayout>,
      },
      {
        path: '/profiles/add',
        element: <AuthLayout><ProfileForm /></AuthLayout>,
      },
      {
        path: '/profiles/edit/:id',
        element: <AuthLayout><ProfileForm /></AuthLayout>,
      // === NHÓM 3: KHU VỰC QUẢN TRỊ (ADMIN) ===
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <div className="p-8 text-white text-2xl">Admin Dashboard Overview</div>,
          },
          {
            path: 'movies',
            element: <div className="p-8 text-white text-2xl">Quản lý Phim</div>,
          },
          {
            path: 'users',
            element: <div className="p-8 text-white text-2xl">Quản lý Người dùng</div>,
          },
          {
            path: 'promotions',
            element: <div className="p-8 text-white text-2xl">Quản lý Khuyến mãi</div>,
          },
          {
            path: 'stats',
            element: <div className="p-8 text-white text-2xl">Thống kê & Báo cáo</div>,
          },
        ],
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
