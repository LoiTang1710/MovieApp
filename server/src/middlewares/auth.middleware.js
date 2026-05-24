import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

/**
 * Middleware xác thực Token (Authentication)
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Bạn chưa đăng nhập hoặc Token bị thiếu.',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Phiên làm việc hết hạn hoặc Token không hợp lệ.',
    })
  }
}

/**
 * Middleware kiểm tra quyền Admin
 * Giả định rằng bạn đã có một middleware xác thực (authentication) 
 * để gán thông tin user vào req.user trước đó.
 */
export const verifyAdmin = (req, res, next) => {
  const user = req.user
  
  // Log để kiểm tra giá trị thực tế từ database
  console.log('--- Auth Check ---', { userId: user?.id, role: user?.role })

  // So sánh không phân biệt hoa thường
  if (!user || user.role?.toString().toUpperCase() !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'Truy cập bị từ chối. Bạn cần quyền quản trị viên.',
    })
  }

  next()
}
