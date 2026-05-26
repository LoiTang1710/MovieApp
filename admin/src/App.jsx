import { lazy, Suspense } from 'react'
import { Outlet, createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: 'movies',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Movies />
              </Suspense>
            ),
          },
          {
            path: 'users',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Users />
              </Suspense>
            ),
          },
          {
            path: 'promotions',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Promotions />
              </Suspense>
            ),
          },
          {
            path: 'stats',
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
])

const App = () => (
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
)

export default App
