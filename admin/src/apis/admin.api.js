import axios from 'axios';

// Lấy URL từ file .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Tạo instance axios để dùng chung (có thể cấu hình interceptors cho Token ở đây)
const adminApi = axios.create({
  baseURL: API_URL,
  withCredentials: true // Để gửi kèm cookie nếu cần
});

// Thêm interceptor để tự động đính kèm Token vào Header của mọi request
adminApi.interceptors.request.use((config) => {
  // Lấy thông tin user từ LocalStorage (nơi AuthContext đã lưu)
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchAdminOverview = async () => {
  const response = await adminApi.get('/admin/stats/overview');
  // Theo cấu trúc backend của bạn: { message: "...", data: { ... } }
  return response.data.data;
};

export default adminApi;