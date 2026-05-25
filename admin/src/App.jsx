import { Outlet, createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Auth/Login/Login' 
import Register from './pages/Auth/Register/Register' 
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword' 
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './providers/AppProvider'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from './components/layouts/AdminLayout'

/**
 * RootLayout: Cấu trúc bọc ngoài cùng chứa các Provider toàn cục (Auth, App, etc.)
 * Outlet sẽ render các component con dựa trên URL hiện tại.
 */
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
      // Khi chạy ứng dụng, mặc định chuyển hướng vào khu vực Admin
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      // === NHÓM 1: CÁC TRANG XÁC THỰC ===
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },

      // === NHÓM 2: KHU VỰC QUẢN TRỊ (Cần đăng nhập) ===
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'movies',
            element: (
              <div className="p-8 text-white text-2xl">Quản lý Phim</div>
            ),
          },
          {
            path: 'users',
            element: (
              <div className="p-8 text-white text-2xl">Quản lý Người dùng</div>
            ),
          },
          {
            path: 'promotions',
            element: (
              <div className="p-8 text-white text-2xl">Quản lý Khuyến mãi</div>
            ),
          },
          {
            path: 'stats',
            element: (
              <div className="p-8 text-white text-2xl">Thống kê & Báo cáo</div>
            ),
          },
        ],
      },

      // === NHÓM 3: CÁC TRANG LỖI & PHÂN QUYỀN ===
      {
        path: '403',
        element: (
          <div className="min-h-screen bg-bg-default flex items-center justify-center text-white text-2xl font-bold">
            403 - Bạn không có quyền truy cập trang này
          </div>
        ),
      },
      {
        path: '*',
        element: (
          <div className="min-h-screen bg-bg-default flex items-center justify-center text-white text-2xl font-bold">
            404 - Trang không tồn tại
          </div>
        ),
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
