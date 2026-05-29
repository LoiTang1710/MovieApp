import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'
import * as authService from '../services/auth.service.js'

// Regex cơ bản kiểm tra format email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body

  // 1. Input Validation chặt chẽ
  if (!email || !password) {
    throw new AppError('Vui lòng nhập email và mật khẩu', StatusCodes.BAD_REQUEST)
  }
  if (!isValidEmail(email)) {
    throw new AppError('Định dạng email không hợp lệ', StatusCodes.BAD_REQUEST)
  }
  if (password.length > 100) {
    throw new AppError('Mật khẩu không được vượt quá 100 ký tự', StatusCodes.BAD_REQUEST)
  }

  const { user } = await authService.login({ email, password })

  // Lưu thông tin vào session (Authenticate)
  req.session.user = { id: user.id, role: user.role }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Đăng nhập thành công',
    data: user,
  })
})

export const register = catchAsync(async (req, res) => {
  const { email, password, fullName, code } = req.body

  if (!email || !password || !fullName || !code) {
    throw new AppError('Vui lòng cung cấp đủ thông tin và mã xác nhận', StatusCodes.BAD_REQUEST)
  }
  if (!isValidEmail(email)) {
    throw new AppError('Định dạng email không hợp lệ', StatusCodes.BAD_REQUEST)
  }
  if (password.length < 6 || password.length > 100) {
    throw new AppError('Mật khẩu phải từ 6 đến 100 ký tự', StatusCodes.BAD_REQUEST)
  }

  // Kiểm tra mã xác nhận
  const isCodeValid = await authService.verifyCode(email, code, 'REGISTER')
  if (!isCodeValid) {
    throw new AppError('Mã xác nhận không chính xác hoặc đã hết hạn', StatusCodes.BAD_REQUEST)
  }

  const { user } = await authService.register({ email, password, fullName })

  // Tự động đăng nhập sau khi đăng ký
  req.session.user = { id: user.id, role: user.role }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Đăng ký thành công',
    data: user,
  })
})

export const sendVerificationCode = catchAsync(async (req, res) => {
  const { email, type } = req.body
  
  if (!email || !type) {
    throw new AppError('Vui lòng nhập đầy đủ email và loại mã xác nhận', StatusCodes.BAD_REQUEST)
  }
  if (!isValidEmail(email)) {
    throw new AppError('Định dạng email không hợp lệ', StatusCodes.BAD_REQUEST)
  }

  await authService.generateAndSendVerificationCode(email, type)

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Mã xác nhận đã được gửi thành công.',
  })
})

export const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword, code } = req.body

  if (!email || !newPassword || !code) {
    throw new AppError('Vui lòng cung cấp đủ email, mật khẩu mới và mã xác nhận', StatusCodes.BAD_REQUEST)
  }
  if (newPassword.length < 6 || newPassword.length > 100) {
    throw new AppError('Mật khẩu phải từ 6 đến 100 ký tự', StatusCodes.BAD_REQUEST)
  }

  const isCodeValid = await authService.verifyCode(email, code, 'RESET_PASSWORD')
  if (!isCodeValid) {
    throw new AppError('Mã xác nhận không chính xác hoặc đã hết hạn', StatusCodes.BAD_REQUEST)
  }

  await authService.resetPassword({ email, newPassword })

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
  })
})
