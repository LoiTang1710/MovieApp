import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'
import * as authService from '../services/auth.service.js'

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Vui lòng nhập email và mật khẩu',
    })
  }

  const user = await authService.login({ email, password })
  res.status(StatusCodes.OK).json({
    message: 'Đăng nhập thành công',
    data: user,
  })
})
