import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  withCredentials: true, // QUAN TRỌNG: Để gửi/nhận Cookie từ Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động bắt lỗi 401 để logout người dùng ở client nếu session hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) { /* Redirect to login if needed */ }
    return Promise.reject(error);
  }
);

export default axiosInstance;