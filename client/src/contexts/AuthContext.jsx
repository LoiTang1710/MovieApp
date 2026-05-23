import { createContext, useContext } from 'react';

// Tạo Context
export const AuthContext = createContext();

// Tạo Provider

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

