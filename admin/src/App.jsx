import { lazy, Suspense } from 'react'
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import Login from './pages/Auth/Login/Login'
import Register from './pages/Auth/Register/Register'
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './providers/AppProvider'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from './components/layouts/AdminLayout'
import ErrorBoundary from './components/common/ErrorBoundary'

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Movies = lazy(() => import('./pages/Movies/Movies'))
const Users = lazy(() => import('./pages/Users/Users'))
const Promotions = lazy(() => import('./pages/Promotions/Promotions'))
const Stats = lazy(() => import('./pages/Stats/Stats'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[40vh] text-gray-400">
    Đang tải...
  </div>
)

const RootLayout = () => (
  <AppProvider>
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  </AppProvider>
)

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        // Khi đã có basename="/admin", đường dẫn "/" ở đây chính là "/admin" trên thanh trình duyệt
        {
          index: true,
          element: <Navigate to="dashboard" replace />, // Thay đổi: Đẩy thẳng vào dashboard nếu đã login admin
        },
        { path: 'login', element: <Login /> }, // Thực tế trên web sẽ là: /admin/login
        { path: 'register', element: <Register /> }, // Thực tế trên web sẽ là: /admin/register
        { path: 'forgot-password', element: <ForgotPassword /> }, // Thực tế trên web sẽ là: /admin/forgot-password

        // Thay đổi: Xóa bỏ bọc tầng 'admin' không cần thiết vì toàn bộ app này đã nằm trong /admin rồi
        {
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: 'dashboard', // Thực tế: /admin/dashboard
              element: (
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              ),
            },
            {
              path: 'movies', // Thực tế: /admin/movies
              element: (
                <Suspense fallback={<PageLoader />}>
                  <Movies />
                </Suspense>
              ),
            },
            {
              path: 'users', // Thực tế: /admin/users
              element: (
                <Suspense fallback={<PageLoader />}>
                  <Users />
                </Suspense>
              ),
            },
            {
              path: 'promotions', // Thực tế: /admin/promotions
              element: (
                <Suspense fallback={<PageLoader />}>
                  <Promotions />
                </Suspense>
              ),
            },
            {
              path: 'stats', // Thực tế: /admin/stats
              element: (
                <Suspense fallback={<PageLoader />}>
                  <Stats />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: '403',
          element: (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white text-2xl font-bold">
              403 - Bạn không có quyền truy cập
            </div>
          ),
        },
        {
          path: '*',
          element: (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white text-2xl font-bold">
              404 - Trang không tồn tại
            </div>
          ),
        },
      ],
    },
  ],
  {
    basename: '/admin',
  },
)

const App = () => (
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
)

export default App
