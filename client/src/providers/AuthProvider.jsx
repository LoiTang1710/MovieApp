import { useState, useEffect } from 'react'

// Đã trỏ đúng về nhà mới
import { AuthContext } from '../contexts/AuthContext.jsx'
import { getCurrentUserApi, logoutApi } from '../api/auth.api.js'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Kiểm tra session khi app khởi động
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUserApi()
        if (res.success) {
          setUser(res.data.user)
          setIsAuthenticated(true)
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Auth check error:', err)
        }
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login: Lưu user vào state
  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  // Logout: Gọi API để destroy session
  const logout = async () => {
    try {
      await logoutApi()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // ĐỒNG NHẤT TOÀN BỘ VÀO MỘT OBJECT DUY NHẤT
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isLoginModalOpen,
    setIsLoginModalOpen,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
