import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // Thay bằng URL Backend thực tế của bạn
  withCredentials: true, // BẮT BUỘC để dùng Session Auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mediaClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    Accept: 'application/json',
  },
})