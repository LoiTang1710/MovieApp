import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Thay bằng URL Backend thực tế của bạn
  withCredentials: true, // BẮT BUỘC để dùng Session Auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;