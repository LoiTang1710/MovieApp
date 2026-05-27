import { StatusCodes } from 'http-status-codes'
import { AppError } from '../utils/AppError.js'

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    })
  }

  console.error(err)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Đã xảy ra lỗi máy chủ.',
    code: 'INTERNAL_ERROR',
  })
}
