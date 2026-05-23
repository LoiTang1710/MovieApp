import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }) => {
  const value = {
    user: { id: '1', email: 'test@cinevibe.com', username: 'testuser' },
    isAuthenticated: true,
    isLoading: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
