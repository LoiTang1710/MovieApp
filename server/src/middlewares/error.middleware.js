import { StatusCodes } from 'http-status-codes'
import { AppError } from '../utils/AppError.js'

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  // Lỗi nghiệp vụ do AppError ném ra (validation, unauthorized, ...)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    })
  }

  // Lỗi server nội bộ không xác định
  console.error('[SERVER ERROR]:', err)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Đã xảy ra lỗi máy chủ nội bộ.',
    code: 'INTERNAL_ERROR',
  })
}
