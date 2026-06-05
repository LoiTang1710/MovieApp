import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '../config/environment.config.js'

const resolveJwtUser = (req) => {
  const authHeader = req.headers.authorization
  let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token && req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) return null
  return jwt.verify(token, env.JWT_SECRET)
}

const attachAuthenticatedUser = (req) => {
  if (req.session?.user) {
    req.user = req.session.user
    return true
  }

  const jwtUser = resolveJwtUser(req)
  if (jwtUser) {
    req.user = jwtUser
    return true
  }

  return false
}

export const verifyUserSession = (req, res, next) => {
  try {
    if (attachAuthenticatedUser(req)) {
      return next()
    }
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.',
    })
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({
    success: false,
    message: 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.',
  })
}

export const optionalVerifyUserSession = (req, res, next) => {
  try {
    attachAuthenticatedUser(req)
  } catch {
    // Public routes still work when a stale dev token is present.
  }
  next()
}

export const authorizeRoles = (...allowedRoles) => {
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase())

  return (req, res, next) => {
    const user = req.user || req.session?.user

    if (!user || !normalizedAllowedRoles.includes(user.role?.toUpperCase())) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này.',
      })
    }

    next()
  }
}
