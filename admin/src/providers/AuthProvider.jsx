import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ isAuthenticated: false }}>
      {children}
    </AuthContext.Provider>
  );
};
