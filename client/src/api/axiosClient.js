import axios from 'axios';

export const authClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // Thay bằng URL Backend thực tế của bạn
  withCredentials: true, // BẮT BUỘC để dùng Session Auth
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

export const mediaClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    Accept: 'application/json',
  },
})
