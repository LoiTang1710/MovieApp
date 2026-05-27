import axios from 'axios';

/** Dev: dùng proxy Vite (baseURL rỗng). Prod: set VITE_SERVER_URL trong .env */
const API_BASE = import.meta.env.VITE_SERVER_URL || ''

export const authClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
