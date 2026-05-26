import { createContext, useContext } from 'react';

// Tạo Context
const AuthContext = createContext();

// Tạo Provider
const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ isAuthenticated: false }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };