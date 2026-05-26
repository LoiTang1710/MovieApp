import { createContext, useContext } from 'react';

// Tạo Context
export const AuthContext = createContext();


/**
 * Hook tùy chỉnh để sử dụng AuthContext nhanh hơn
 */
// eslint-disable-next-line react-refresh/only-export-components


export const useAuth = () => {
  return useContext(AuthContext)
};

