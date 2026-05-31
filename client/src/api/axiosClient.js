import axios from 'axios'
import { resolveServerUrl } from '../utils/env.js'

/** baseURL rỗng = dùng Vite proxy /api; có URL = gọi thẳng backend */
const API_BASE = resolveServerUrl()

export const authClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Quan trọng: Cho phép gửi/nhận Cookie session
  headers: {
    'Content-Type': 'application/json',
  },
})

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session hết hạn hoặc người dùng chưa đăng nhập
      console.warn('Session expired or Unauthorized. Redirecting to login...')
      // Bạn có thể thêm logic xóa dữ liệu user trong Global State hoặc redirect tại đây
      // window.location.href = '/login';
    }
    return Promise.reject(error)
  },
)

/** Xuất thêm mediaClient để sử dụng trong các hooks như useMedias */
export const mediaClient = authClient
export const apiClient = authClient