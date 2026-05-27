import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import prisma from '../config/database.config.js'
import { env } from '../config/environment.config.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'

/** Chỉ dùng khi login chưa xong — tạo JWT cho user test trong DB */
export const getDevToken = catchAsync(async (req, res) => {
  if (env.ALLOW_DEV_AUTH !== 'true') {
    throw new AppError(
      'Dev auth bị tắt. Đặt ALLOW_DEV_AUTH=true trong server/.env',
      StatusCodes.FORBIDDEN,
      'DEV_AUTH_DISABLED',
    )
  }

  const email = req.body?.email || 'user@test.com'
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new AppError(
      `Không tìm thấy user ${email}. Chạy: npm run db:seed`,
      StatusCodes.NOT_FOUND,
      'USER_NOT_FOUND',
    )
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '7d' },
  )

  res.status(StatusCodes.OK).json({
    message: 'Dev token (chỉ dùng khi chưa có login). Lưu vào localStorage: token',
    token,
    user: { id: user.id, email: user.email, role: user.role },
  })
})
