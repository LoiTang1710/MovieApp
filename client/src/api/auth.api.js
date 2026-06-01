import { apiClient } from './axiosClient'

export const getCurrentUserApi = async () => {
  const response = await apiClient.get('/auth/me') // Đã thêm /api
  return response.data
}

export const loginApi = async (data) => {
  const response = await apiClient.post('/auth/login', data)
  return response.data.data
}

export const registerApi = async (data) => {
  const response = await apiClient.post('/auth/register', data)
  return response.data.data
}

export const logoutApi = async () => {
  const response = await apiClient.post('/auth/logout')
  return response.data
}

export const sendVerificationCodeApi = async (data) => {
  const response = await apiClient.post(
    '/auth/send-verification-code',
    data,
  )
  return response.data
}

export const resetPasswordApi = async (data) => {
  const response = await apiClient.post('/auth/reset-password', data)
  return response.data
}
