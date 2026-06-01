/**
 * ✅ User Helper Functions
 * 
 * Utility functions for working with user data
 * across the application
 */

/**
 * Format user display name
 * @param {Object} user - User object
 * @returns {string} Formatted display name
 */
export const formatUserName = (user) => {
  if (!user) return 'Guest';
  return user.fullName || user.name || user.email?.split('@')[0] || 'User';
};

/**
 * Get user initials for avatar
 * @param {Object} user - User object
 * @returns {string} User initials (e.g., "JD" for John Doe)
 */
export const getUserInitials = (user) => {
  if (!user) return 'G';
  const name = user.fullName || user.name || user.email || '';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Check if user has permission for an action
 * @param {Object} user - User object
 * @param {string} requiredRole - Required role
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (user, requiredRole) => {
  if (!user) return false;
  return user.role?.toUpperCase() === requiredRole.toUpperCase();
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean} True if user is admin
 */
export const isUserAdmin = (user) => {
  return hasPermission(user, 'ADMIN');
};

/**
 * Check if user is regular user
 * @param {Object} user - User object
 * @returns {boolean} True if user is regular user
 */
export const isRegularUser = (user) => {
  return hasPermission(user, 'USER');
};

/**
 * Format user email for display
 * @param {string} email - User email
 * @returns {string} Formatted email
 */
export const formatEmail = (email) => {
  if (!email) return '';
  return email.toLowerCase();
};

/**
 * Get user status badge text
 * @param {Object} user - User object
 * @returns {string} Status text
 */
export const getUserStatusText = (user) => {
  if (!user) return 'Offline';
  return 'Active';
};

/**
 * Get user role badge color
 * @param {string} role - User role
 * @returns {string} Tailwind color class
 */
export const getRoleBadgeColor = (role) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'bg-red-600/20 text-red-400';
    case 'USER':
      return 'bg-blue-600/20 text-blue-400';
    case 'MODERATOR':
      return 'bg-yellow-600/20 text-yellow-400';
    default:
      return 'bg-gray-600/20 text-gray-400';
  }
};

/**
 * Get user role display text
 * @param {string} role - User role
 * @returns {string} Display text
 */
export const getRoleDisplayText = (role) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'Administrator';
    case 'USER':
      return 'User';
    case 'MODERATOR':
      return 'Moderator';
    default:
      return role || 'Unknown';
  }
};

/**
 * Create user profile object for sharing
 * @param {Object} user - User object
 * @returns {Object} User profile object
 */
export const createUserProfile = (user) => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName || user.name,
    displayName: formatUserName(user),
    initials: getUserInitials(user),
    role: user.role,
    roleDisplay: getRoleDisplayText(user.role),
    avatarUrl: user.avatarUrl,
    isAdmin: isUserAdmin(user),
    isRegularUser: isRegularUser(user),
    status: getUserStatusText(user),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    // Include all other properties
    ...user,
  };
};

/**
 * Validate user object
 * @param {Object} user - User object to validate
 * @returns {boolean} True if user object is valid
 */
export const isValidUser = (user) => {
  return (
    user &&
    typeof user === 'object' &&
    user.id &&
    user.email &&
    user.role
  );
};

/**
 * Get user data for API requests
 * @param {Object} user - User object
 * @returns {Object} User data for API
 */
export const getUserDataForApi = (user) => {
  if (!user) return null;
  
  return {
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    userName: formatUserName(user),
  };
};

/**
 * Compare two users
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {boolean} True if users are the same
 */
export const isSameUser = (user1, user2) => {
  if (!user1 || !user2) return false;
  return user1.id === user2.id && user1.email === user2.email;
};

/**
 * Get user's full profile for display
 * @param {Object} user - User object
 * @returns {Object} Full profile object
 */
export const getUserFullProfile = (user) => {
  if (!user) return null;
  
  return {
    // Basic info
    id: user.id,
    email: user.email,
    fullName: user.fullName || user.name,
    displayName: formatUserName(user),
    initials: getUserInitials(user),
    
    // Role info
    role: user.role,
    roleDisplay: getRoleDisplayText(user.role),
    isAdmin: isUserAdmin(user),
    isRegularUser: isRegularUser(user),
    
    // Avatar info
    avatarUrl: user.avatarUrl,
    
    // Status info
    status: getUserStatusText(user),
    
    // Timestamps
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    
    // Additional fields
    ...user,
  };
};

export default {
  formatUserName,
  getUserInitials,
  hasPermission,
  isUserAdmin,
  isRegularUser,
  formatEmail,
  getUserStatusText,
  getRoleBadgeColor,
  getRoleDisplayText,
  createUserProfile,
  isValidUser,
  getUserDataForApi,
  isSameUser,
  getUserFullProfile,
};
