import { createContext, useContext } from 'react';

// Tạo Context
export const AuthContext = createContext();

// Hook để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext)
};

