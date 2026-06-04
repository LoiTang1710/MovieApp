/**
 * Hỗ trợ format nhóm cho Local Dev: VITE_SERVER_PORT=3000 + VITE_SERVER_URL=http://localhost:${VITE_SERVER_PORT}
 * Trên Production tự động sử dụng đường dẫn tương đối (Relative Path).
 */
export function resolveServerUrl() {
  // 1. CHẶN ĐỨNG Ở PRODUCTION: Khi deploy lên Render (Gộp chung mâm)
  // Chỉ dùng đường dẫn tương đối để trình duyệt tự hiểu domain hiện tại.
  if (import.meta.env.MODE === 'production') {
    return '/api'
  }

  // 2. LOGIC CHO DEVELOPMENT (Chạy dưới local máy tính)
  const port = String(import.meta.env.VITE_SERVER_PORT ?? '3000').trim()
  let url = String(import.meta.env.VITE_SERVER_URL ?? '').trim()

  // Nếu không khai báo URL, mặc định trỏ về localhost
  if (!url) {
    url = `http://localhost:${port}`
  } else {
    // Thay thế biến môi trường động theo logic của bạn
    url = url.replace(/\$\{VITE_SERVER_PORT\}/g, port)
  }

  // Chặn các URL dị dạng ở Local
  if (!/^https?:\/\//i.test(url)) {
    console.warn(
      'VITE_SERVER_URL không hợp lệ. Đang fallback về http://localhost:3000',
    )
    return 'http://localhost:3000/api'
  }

  // Trả về url sạch (xóa slash thừa ở cuối) và nối thêm /api
  return `${url.replace(/\/$/, '')}/api`
}

export function getTmdbAccessToken() {
  return String(import.meta.env.VITE_ACCESS_TOKEN ?? '').trim()
}
