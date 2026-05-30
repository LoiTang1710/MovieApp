import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserApi, logoutApi } from '../api/auth.api';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Kiểm tra session khi app khởi động
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Gọi API để kiểm tra session còn hợp lệ không
        const res = await getCurrentUserApi();
        if (res.success) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Session hết hạn hoặc chưa đăng nhập
        console.error('Auth check error:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * ✅ Login: Lưu user vào state
   */
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * ✅ Logout: Gọi API để destroy session
   */
  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = { user, isAuthenticated, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

