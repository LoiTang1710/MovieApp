import bcrypt from 'bcryptjs'
import * as UserModel from '../models/user.model.js'

export const register = async (email, password, username) => {
  const existingUser = await UserModel.findUserByEmail(email)
  if (existingUser) throw new Error('Email đã tồn tại')

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  return await UserModel.createUser(email, hashedPassword, username)
}

export const login = async (email, password) => {
  const user = await UserModel.findUserByEmail(email)
  if (!user) throw new Error('Email hoặc mật khẩu không đúng')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Email hoặc mật khẩu không đúng')

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }
}

export const forgotPassword = async (email, newPassword) => {
  const user = await UserModel.findUserByEmail(email)
  if (!user) throw new Error('Người dùng không tồn tại')

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)
  await UserModel.updatePassword(email, hashedPassword)
}
