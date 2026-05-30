import { useAuth } from '../contexts/AuthContext';

/**
 * ✅ Custom Hook: useUserData
 * 
 * Provides easy access to user data and utility functions
 * for other components that need user information
 * 
 * Usage:
 * const { user, getUserInfo, hasRole, isAuthenticated, getDisplayName } = useUserData();
 */
export const useUserData = () => {
  const { user, isAuthenticated } = useAuth();

  /**
   * Get complete user information object
   * @returns {Object} User object with all properties
   */
  const getUserInfo = () => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName || user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Spread all other properties
      ...user
    };
  };

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check (e.g., 'USER', 'ADMIN')
   * @returns {boolean} True if user has the role
   */
  const hasRole = (role) => {
    return user?.role?.toUpperCase() === role.toUpperCase();
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is logged in
   */
  const isUserAuthenticated = () => {
    return isAuthenticated && user !== null;
  };

  /**
   * Get user's display name
   * @returns {string} User's full name, name, or email prefix
   */
  const getDisplayName = () => {
    return user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';
  };

  /**
   * Get user's avatar URL
   * @returns {string|null} Avatar URL or null if not set
   */
  const getAvatarUrl = () => {
    return user?.avatarUrl || null;
  };

  /**
   * Get user's email
   * @returns {string|null} User's email or null
   */
  const getEmail = () => {
    return user?.email || null;
  };

  /**
   * Get user's ID
   * @returns {number|string|null} User's ID or null
   */
  const getUserId = () => {
    return user?.id || null;
  };

  /**
   * Get user's role
   * @returns {string|null} User's role or null
   */
  const getUserRole = () => {
    return user?.role || null;
  };

  /**
   * Check if user is admin
   * @returns {boolean} True if user is admin
   */
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  /**
   * Check if user is regular user
   * @returns {boolean} True if user is regular user
   */
  const isRegularUser = () => {
    return hasRole('USER');
  };

  /**
   * Get user's full profile object
   * @returns {Object} Complete user profile
   */
  const getUserProfile = () => {
    return {
      isAuthenticated: isUserAuthenticated(),
      user: getUserInfo(),
      displayName: getDisplayName(),
      email: getEmail(),
      id: getUserId(),
      role: getUserRole(),
      isAdmin: isAdmin(),
      isRegularUser: isRegularUser(),
      avatarUrl: getAvatarUrl(),
    };
  };

  return {
    // Raw data
    user,
    isAuthenticated,

    // Getter functions
    getUserInfo,
    getUserProfile,
    getDisplayName,
    getAvatarUrl,
    getEmail,
    getUserId,
    getUserRole,

    // Check functions
    hasRole,
    isUserAuthenticated,
    isAdmin,
    isRegularUser,
  };
};

export default useUserData;
