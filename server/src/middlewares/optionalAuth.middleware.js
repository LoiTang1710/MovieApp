import jwt from 'jsonwebtoken'

/** Gắn req.user nếu có token hợp lệ; không có token vẫn cho qua. */
export const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
  } catch {
    // Token không hợp lệ — bỏ qua, coi như khách
  }

  next()
}
