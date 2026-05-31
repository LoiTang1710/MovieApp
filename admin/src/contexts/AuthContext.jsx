import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

/**
 * Hook tùy chỉnh để sử dụng AuthContext nhanh hơn
 */
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

  // Tự động kiểm tra localStorage khi ứng dụng khởi chạy (F5 trang)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Lỗi khôi phục phiên đăng nhập:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Hàm đăng nhập: Lưu thông tin và cập nhật trạng thái
   * @param {Object} userData - Chứa thông tin user và token
   */
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Hàm đăng xuất: Xóa sạch bộ nhớ và state
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = { user, isAuthenticated, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};