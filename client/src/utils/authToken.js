/** Đọc payload JWT từ localStorage (chỉ dùng cho UI dev/admin). */
export function getTokenPayload() {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const base64 = token.split('.')[1]
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function isAdminUser() {
  return getTokenPayload()?.role?.toUpperCase() === 'ADMIN'
}
