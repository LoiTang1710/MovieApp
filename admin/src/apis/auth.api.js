import axios from 'axios'

// Tự động nhận diện môi trường để ép đường dẫn chuẩn xác
const API_URL =
  import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3000/api' // Đổi lại đúng port backend local của bạn

export const loginApi = async ({ email, password }) => {
  const res = await axios.post(
    `${API_URL}/auth/login`,
    { email, password },
    { withCredentials: true },
  )
  return res.data.data
}
