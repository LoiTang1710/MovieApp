import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import prisma from '../config/database.config.js'
import { env } from '../config/environment.config.js'
import { AppError } from '../utils/AppError.js'

// Nâng mức độ an toàn của bcrypt lên 12 (Best Practice hiện nay)
export const hashPassword = (plain) => bcrypt.hash(plain, 12)
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash)

export const signToken = (user) => {
  // Prevent sử dụng Secret mặc định trên Production
  if (env.NODE_ENV === 'production' && !env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in Production')
  }
  
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  )
}

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  
  // Dùng chung một câu báo lỗi để tránh "Account Enumeration Attack" (hacker biết email nào tồn tại)
  if (!user || !user.password) {
    throw new AppError('Email hoặc mật khẩu không đúng', StatusCodes.UNAUTHORIZED)
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    throw new AppError('Email hoặc mật khẩu không đúng', StatusCodes.UNAUTHORIZED)
  }

  const token = signToken(user)
  
  // Dùng rest/spread để loại bỏ trường password khỏi object user trước khi trả về Controller
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user
  
  return {
    user: userWithoutPassword,
    token,
  }
}

export const register = async ({ email, password, fullName }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  
  if (existingUser) {
    throw new AppError('Email này đã được sử dụng', StatusCodes.CONFLICT)
  }

  const hashedPassword = await hashPassword(password)
  
  const newUser = await prisma.user.create({
    data: {
      email,
      fullName,
      password: hashedPassword,
      role: 'USER', // Khởi tạo mặc định
    }
  })

  const token = signToken(newUser)
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser

  return {
    user: userWithoutPassword,
    token
  }
}
