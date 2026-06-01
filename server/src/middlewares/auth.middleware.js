import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '../config/environment.config.js'

/**
 * Middleware xác thực Token (Authentication)
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  let token = authHeader && authHeader.split(' ')[1]

  // Fallback to cookie if token is not in header
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Bạn chưa đăng nhập hoặc Token bị thiếu.',
    })
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
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
export const isAuthenticated = (req,res,next) => {
  if(req.session && req.session.user){
    req.user = req.session.user
    return next()
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({
    message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.',
  })
}
