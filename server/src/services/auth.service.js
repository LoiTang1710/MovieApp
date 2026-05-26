import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import prisma from '../config/database.config.js'
import { env } from '../config/environment.config.js'

export const hashPassword = (plain) => bcrypt.hash(plain, 10)
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash)

export const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' },
  )

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) {
    const err = new Error('Email hoặc mật khẩu không đúng')
    err.statusCode = StatusCodes.UNAUTHORIZED
    throw err
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    const err = new Error('Email hoặc mật khẩu không đúng')
    err.statusCode = StatusCodes.UNAUTHORIZED
    throw err
  }

  const token = signToken(user)
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    token,
  }
}
