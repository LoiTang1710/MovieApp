import axios from 'axios'
import { resolveServerUrl } from '../utils/env.js'

/** baseURL rỗng = dùng Vite proxy /api; có URL = gọi thẳng backend */
const API_BASE = resolveServerUrl()

export const authClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('auth:logout'))
    }
    return Promise.reject(error)
  },
)

export const mediaClient = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: 'application/json',
  },
})
