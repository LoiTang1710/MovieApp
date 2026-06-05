import axios from 'axios'
import { resolveServerUrl } from '../utils/env.js'

const API_BASE = resolveServerUrl()

export const authClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Lấy thông tin về request gốc vừa bị lỗi
    const originalRequest = error.config

    if (error.response?.status === 401) {
      // 1. CÁC ĐƯỜNG DẪN NGOẠI LỆ (Không redirect)
      // Nếu API bị lỗi 401 là API dùng để "check auth" (như /auth/me hoặc /profiles)
      // thì KHÔNG đá văng ra trang login.
      if (
        originalRequest.url.includes('/auth/me') ||
        originalRequest.url.includes('/profiles') ||
        originalRequest.url.includes('/comments') ||
        originalRequest.url.includes('/reviews') ||
        originalRequest.url.includes('/admin/comments')
      ) {
        // Chỉ đơn giản là trả về lỗi để UI tự xử lý (hiện nút Login)
        return Promise.reject(error)
      }

      // 2. LOGIC ĐÁ VĂNG (Dành cho các API bắt buộc phải có quyền)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status)
    }

    return Promise.reject(error)
  },
)

export const mediaClient = authClient
export const apiClient = authClient
