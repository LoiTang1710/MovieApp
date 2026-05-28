import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'
import * as authService from '../services/auth.service.js'

// Regex cơ bản kiểm tra format email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body

  // 1. Input Validation chặt chẽ (Chống DoS qua độ dài password)
  if (!email || !password) {
    throw new AppError('Vui lòng nhập email và mật khẩu', StatusCodes.BAD_REQUEST)
  }
  if (!isValidEmail(email)) {
    throw new AppError('Định dạng email không hợp lệ', StatusCodes.BAD_REQUEST)
  }
  if (password.length > 100) {
    throw new AppError('Mật khẩu không được vượt quá 100 ký tự', StatusCodes.BAD_REQUEST)
  }

  const { user, token } = await authService.login({ email, password })

  // 2. Security: Trả token qua HttpOnly Cookie thay vì JSON Body
  res.cookie('token', token, {
    httpOnly: true, // Tránh XSS, JS trên frontend không thể đọc
    secure: process.env.NODE_ENV === 'production', // Phải dùng HTTPS trên Production
    sameSite: 'strict', // Tránh CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
  })

  res.status(StatusCodes.OK).json({
    message: 'Đăng nhập thành công',
    data: user, // Token không còn nằm trong payload này
  })
})

export const register = catchAsync(async (req, res) => {
  const { email, password, fullName } = req.body

  if (!email || !password || !fullName) {
    throw new AppError('Vui lòng cung cấp đủ thông tin (email, password, fullName)', StatusCodes.BAD_REQUEST)
  }
  if (!isValidEmail(email)) {
    throw new AppError('Định dạng email không hợp lệ', StatusCodes.BAD_REQUEST)
  }
  if (password.length < 6 || password.length > 100) {
    throw new AppError('Mật khẩu phải từ 6 đến 100 ký tự', StatusCodes.BAD_REQUEST)
  }

  const { user, token } = await authService.register({ email, password, fullName })

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(StatusCodes.CREATED).json({
    message: 'Đăng ký thành công',
    data: user,
  })
})
