import { authClient } from './axiosClient'

/**
 * Login API
 */
export const loginApi = async (data) => {
  const response = await authClient.post('/auth/login', data)
  return response.data.data || response.data
}

/**
 * Register API
 */
export const registerApi = async (data) => {
  const response = await authClient.post('/auth/register', data)
  return response.data.data || response.data
}

/**
 * Send Verification Code API
 */
export const sendVerificationCodeApi = async (data) => {
  const response = await authClient.post('/auth/send-verification-code', data)
  return response.data
}

/**
 * Reset Password API
 */
export const resetPasswordApi = async (data) => {
  const response = await authClient.post('/auth/reset-password', data)
  return response.data
}

/**
 * Logout API
 */
export const logoutApi = async () => {
  const response = await authClient.post('/auth/logout')
  return response.data
}

/**
 * Get Current User API
 */
export const getCurrentUserApi = async () => {
  const response = await authClient.get('/auth/me')
  return response.data
}
