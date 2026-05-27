export function getApiErrorMessage(error, fallback = 'Đã xảy ra lỗi.') {
  if (!error) return fallback

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.code === 'ERR_NETWORK' || !error.response) {
    const base = import.meta.env.VITE_SERVER_URL || '(proxy /api)'
    return `Không kết nối được server (${base}). Hãy chạy "npm run dev" trong thư mục server.`
  }

  return fallback
}
