import { StatusCodes } from 'http-status-codes'

/**
 * [Authentication] Kiểm tra session hợp lệ – bắt buộc đăng nhập
 * Dùng cho các route yêu cầu người dùng đã đăng nhập (comment, review, premium...)
 */
export const verifyUserSession = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.',
    })
  }

  // Đồng bộ req.user để các controller đọc cùng 1 nơi
  req.user = req.session.user
  next()
}

/**
 * [Authentication – Optional] Gắn req.user nếu đã đăng nhập; không có session vẫn cho qua
 * Dùng cho các route công khai nhưng cần nhận diện user (listComments, getSummary...)
 */
export const optionalVerifyUserSession = (req, res, next) => {
  if (req.session?.user) {
    req.user = req.session.user
  }
  next()
}

/**
 * [Authorization] Kiểm tra vai trò (role) của user
 * Phải dùng sau verifyUserSession
 * Ví dụ: authorizeRoles('ADMIN') hoặc authorizeRoles('ADMIN', 'USER')
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user || req.session?.user

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này.',
      })
    }

    next()
  }
}
