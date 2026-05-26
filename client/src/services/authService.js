import axios from 'axios'

// Tạo axios instance với cấu hình withCredentials để tự động gửi/nhận Cookie
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
  withCredentials: true, // Quan trọng: cho phép gửi Cookie trong request
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Đăng ký tài khoản mới
 * @param {Object} data - Dữ liệu đăng ký { email, password, fullName }
 * @returns {Promise<Object>} - Thông tin user sau khi đăng ký
 */
export const registerAPI = async (data) => {
  try {
    const response = await apiClient.post('/api/auth/register', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

/**
 * Đăng nhập
 * @param {Object} data - Dữ liệu đăng nhập { email, password }
 * @returns {Promise<Object>} - Thông tin user sau khi đăng nhập
 */
export const loginAPI = async (data) => {
  try {
    const response = await apiClient.post('/api/auth/login', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

/**
 * Đăng xuất
 * @returns {Promise<Object>} - Kết quả đăng xuất
 */
export const logoutAPI = async () => {
  try {
    const response = await apiClient.post('/api/auth/logout')
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise<Object>} - Thông tin user hiện tại
 */
export const getCurrentUserAPI = async () => {
  try {
    const response = await apiClient.get('/api/auth/me')
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

/**
 * Quên mật khẩu
 * @param {Object} data - Dữ liệu { email }
 * @returns {Promise<Object>} - Kết quả gửi email
 */
export const forgotPasswordAPI = async (data) => {
  try {
    const response = await apiClient.post('/api/auth/forgot-password', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export default apiClient
