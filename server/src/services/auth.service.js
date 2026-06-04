import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import prisma from '../config/database.config.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer' // ✅ Đã sửa thành đúng tên thư viện

import { AppError } from '../utils/AppError.js'

export const hashPassword = (plain) => bcrypt.hash(plain, 12)
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash)

const verificationCodes = new Map()

// TẠO "NGƯỜI VẬN CHUYỂN" EMAIL (Khởi tạo 1 lần ở ngoài để tối ưu hiệu suất)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Bắt buộc khai báo host thay vì dùng 'service'
  port: 465, // Sử dụng cổng bảo mật SSL
  secure: true, // Bật chế độ an toàn
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Thiết lập Timeout để tránh bị treo (Pending)
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
})

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.password) {
    throw new AppError(
      'Email hoặc mật khẩu không đúng',
      StatusCodes.UNAUTHORIZED,
    )
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    throw new AppError(
      'Email hoặc mật khẩu không đúng',
      StatusCodes.UNAUTHORIZED,
    )
  }

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
      role: 'USER',
    },
  })

  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser

  return {
    user: userWithoutPassword,
  }
}

export const generateAndSendVerificationCode = async (email, type) => {
  const code = crypto.randomInt(100000, 999999).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  verificationCodes.set(email, { code, expiresAt, type })

  // 1. Vẫn giữ lại Log cho môi trường Development để test dưới máy Local cho nhanh
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

  // 2. Logic gửi Email thực tế có bọc try...catch
  try {
    const mailOptions = {
      from: `"Cinevibe Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        type === 'REGISTER'
          ? 'Mã xác nhận đăng ký tài khoản Cinevibe'
          : 'Mã khôi phục mật khẩu Cinevibe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #333; border-radius: 10px; background-color: #0f0f0f; color: #fff;">
          <h2 style="color: #e50914; text-align: center; font-size: 28px;">Cinevibe</h2>
          <p style="font-size: 16px;">Xin chào,</p>
          <p style="font-size: 16px;">Bạn vừa yêu cầu mã xác nhận. Dưới đây là mã của bạn:</p>
          <h1 style="font-size: 40px; text-align: center; color: #e50914; letter-spacing: 8px; background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333;">${code}</h1>
          <p style="font-size: 14px; color: #aaa;">Mã này có hiệu lực trong vòng 10 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai để đảm bảo an toàn cho tài khoản.</p>
          <hr style="border-color: #333; margin-top: 30px;" />
          <p style="font-size: 12px; color: #666; text-align: center;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Nodemailer Error:', error)
    // Ném lỗi chuẩn HTTP Status nếu Gmail từ chối gửi
    throw new AppError(
      'Hệ thống mail đang bận, không thể gửi mã xác nhận lúc này.',
      StatusCodes.INTERNAL_SERVER_ERROR,
    )
  }
}

export const verifyCode = async (email, code, type) => {
  const record = verificationCodes.get(email)
  if (
    !record ||
    record.code !== code ||
    record.type !== type ||
    record.expiresAt < new Date()
  ) {
    return false
  }
  verificationCodes.delete(email)
  return true
}

export const resetPassword = async ({ email, newPassword }) => {
  const hashedPassword = await hashPassword(newPassword)
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  })
  return true
}
