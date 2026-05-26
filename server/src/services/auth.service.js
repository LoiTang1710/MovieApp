import bcrypt from 'bcryptjs'
import { prisma } from '../config/database.config.js'

export const register = async (email, password, username) => {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) throw new Error('Email đã tồn tại')

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: username, // Lưu username từ frontend vào cột name trong database
      role: 'USER'
    }
  })
}

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Email hoặc mật khẩu không đúng')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Email hoặc mật khẩu không đúng')

  // Trả về user để controller xử lý safeUser
  return user
}



export const forgotPassword = async (email, newPassword) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Người dùng không tồn tại')

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)
  
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  })
}
