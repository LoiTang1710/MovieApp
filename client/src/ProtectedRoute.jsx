import { Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

/**
 * Component bọc (Wrapper) để phân quyền (Authorization)
 * Kiểm tra xem user đã đăng nhập chưa, nếu chưa thì redirect về trang Login
 * Có thể kiểm tra role nếu cần
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component cần bảo vệ
 * @param {string} props.requiredRole - Role cần thiết (optional)
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isLoading, isAuthenticated } = useAuth()

  // Đang kiểm tra authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Đang tải...</p>
        </div>
      </div>
    )
  }

  // User chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Kiểm tra role nếu cần
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/403" replace />
  }

  // User đã đăng nhập và có quyền truy cập
  return children
}

export default ProtectedRoute
