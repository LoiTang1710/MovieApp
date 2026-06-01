import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import prisma from '../config/database.config.js'
import crypto from 'crypto'

import { AppError } from '../utils/AppError.js'

// Nâng mức độ an toàn của bcrypt lên 12 (Best Practice hiện nay)
export const hashPassword = (plain) => bcrypt.hash(plain, 12)
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash)

// Lưu trữ mã xác nhận tạm thời (Trong thực tế nên dùng Redis hoặc Database có TTL)
const verificationCodes = new Map() // Định dạng: { email: { code, expiresAt, type } }

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

  // Dùng rest/spread để loại bỏ trường password khỏi object user trước khi trả về Controller
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user
  
  return {
    user: userWithoutPassword,
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

  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser

  return {
    user: userWithoutPassword
  }
}

export const generateAndSendVerificationCode = async (email, type) => {
  const code = crypto.randomInt(100000, 999999).toString() // Mã 6 chữ số
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // Mã có hiệu lực trong 10 phút

  // Lưu mã (ví dụ: vào một Map trong bộ nhớ)
  verificationCodes.set(email, { code, expiresAt, type })

  // Trong một ứng dụng thực tế, hãy tích hợp với dịch vụ gửi email/SMS tại đây
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = new Date().toLocaleString('vi-VN')
    console.log(`\n${'='.repeat(60)}`)
    console.log(`📧 VERIFICATION CODE GENERATED`)
    console.log(`${'='.repeat(60)}`)
    console.log(`⏰ Time: ${timestamp}`)
    console.log(`📨 Email: ${email}`)
    console.log(`🔐 Code: ${code}`)
    console.log(`📝 Type: ${type}`)
    console.log(`⏳ Expires in: 10 minutes`)
    console.log(`${'='.repeat(60)}\n`)
  }

  return true // Cho biết thành công
}

export const verifyCode = async (email, code, type) => {
  const record = verificationCodes.get(email)
  if (!record || record.code !== code || record.type !== type || record.expiresAt < new Date()) {
    return false
  }
  verificationCodes.delete(email) // Mã chỉ dùng 1 lần
  return true
}

export const resetPassword = async ({ email, newPassword }) => {
  const hashedPassword = await hashPassword(newPassword)
  await prisma.user.update({ where: { email }, data: { password: hashedPassword } })
  return true
}
