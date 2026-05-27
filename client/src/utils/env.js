/**
 * Vite không tự thay ${VITE_SERVER_PORT} trong .env — resolve ở đây.
 * Hỗ trợ format nhóm: VITE_SERVER_PORT=3000 + VITE_SERVER_URL=http://localhost:${VITE_SERVER_PORT}
 */
export function resolveServerUrl() {
  const port = String(import.meta.env.VITE_SERVER_PORT ?? '3000').trim()
  let url = String(import.meta.env.VITE_SERVER_URL ?? '').trim()

  if (url) {
    url = url.replace(/\$\{VITE_SERVER_PORT\}/g, port)
  }

  if (!url) {
    return ''
  }

  if (!/^https?:\/\//i.test(url)) {
    return ''
  }

  return url.replace(/\/$/, '')
}

export function getTmdbAccessToken() {
  return String(import.meta.env.VITE_ACCESS_TOKEN ?? '').trim()
}
