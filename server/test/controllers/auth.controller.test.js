// server/test/controllers/auth.controller.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import * as authController from '../../src/controllers/auth.controller.js'
import * as authService from '../../src/services/auth.service.js'

// Mock the entire auth service
vi.mock('../../src/services/auth.service.js', () => ({
  login: vi.fn(),
  register: vi.fn(),
  generateAndSendVerificationCode: vi.fn(),
  verifyCode: vi.fn(),
  resetPassword: vi.fn(),
}))

// Helper: create a mock Express response object
const mockResponse = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.cookie = vi.fn().mockReturnValue(res)
  return res
}

// Helper: create a mock Express session
const mockSession = () => ({ user: undefined })

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // login
  // ─────────────────────────────────────────────
  describe('login', () => {
    it('should return 200 and set session on valid credentials', async () => {
      const session = mockSession()
      const req = {
        body: { email: 'user@example.com', password: 'password123' },
        session,
      }
      const res = mockResponse()
      const next = vi.fn()

      const mockUser = { id: 'u1', role: 'USER', email: 'user@example.com' }
      authService.login.mockResolvedValue({ user: mockUser })

      await authController.login(req, res, next)

      expect(authService.login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' })
      expect(session.user).toEqual({ id: 'u1', role: 'USER' })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đăng nhập thành công',
        data: mockUser,
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with AppError when email is missing', async () => {
      const req = { body: { password: 'password123' }, session: mockSession() }
      const res = mockResponse()
      const next = vi.fn()

      await authController.login(req, res, next)

      expect(next).toHaveBeenCalled()
      const err = next.mock.calls[0][0]
      expect(err.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(authService.login).not.toHaveBeenCalled()
    })

    it('should call next with AppError when password is missing', async () => {
      const req = { body: { email: 'user@example.com' }, session: mockSession() }
      const res = mockResponse()
      const next = vi.fn()

      await authController.login(req, res, next)

      expect(next).toHaveBeenCalled()
      const err = next.mock.calls[0][0]
      expect(err.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(authService.login).not.toHaveBeenCalled()
    })

    it('should call next with AppError when email format is invalid', async () => {
      const req = { body: { email: 'not-an-email', password: 'password123' }, session: mockSession() }
      const res = mockResponse()
      const next = vi.fn()

      await authController.login(req, res, next)

      expect(next).toHaveBeenCalled()
      const err = next.mock.calls[0][0]
      expect(err.statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should call next with AppError when password exceeds 100 characters', async () => {
      const req = {
        body: { email: 'user@example.com', password: 'a'.repeat(101) },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.login(req, res, next)

      expect(next).toHaveBeenCalled()
      const err = next.mock.calls[0][0]
      expect(err.statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should propagate service error through next', async () => {
      const req = {
        body: { email: 'user@example.com', password: 'wrongpass' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      const serviceError = new Error('Service error')
      authService.login.mockRejectedValue(serviceError)

      await authController.login(req, res, next)

      expect(next).toHaveBeenCalledWith(serviceError)
    })

    it('should accept exactly 100 character password (boundary value)', async () => {
      const session = mockSession()
      const req = {
        body: { email: 'user@example.com', password: 'a'.repeat(100) },
        session,
      }
      const res = mockResponse()
      const next = vi.fn()

      const mockUser = { id: 'u1', role: 'USER', email: 'user@example.com' }
      authService.login.mockResolvedValue({ user: mockUser })

      await authController.login(req, res, next)

      expect(authService.login).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // register
  // ─────────────────────────────────────────────
  describe('register', () => {
    it('should return 201 and set session on valid registration', async () => {
      const session = mockSession()
      const req = {
        body: {
          email: 'new@example.com',
          password: 'secure123',
          fullName: 'Test User',
          code: '123456',
        },
        session,
      }
      const res = mockResponse()
      const next = vi.fn()

      const mockUser = { id: 'u2', role: 'USER', email: 'new@example.com' }
      authService.verifyCode.mockResolvedValue(true)
      authService.register.mockResolvedValue({ user: mockUser })

      await authController.register(req, res, next)

      expect(authService.verifyCode).toHaveBeenCalledWith('new@example.com', '123456', 'REGISTER')
      expect(authService.register).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'secure123',
        fullName: 'Test User',
      })
      expect(session.user).toEqual({ id: 'u2', role: 'USER' })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đăng ký thành công',
        data: mockUser,
      })
    })

    it('should call next with AppError when required fields are missing', async () => {
      const req = {
        body: { email: 'new@example.com', password: 'secure123' }, // missing fullName and code
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.register(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(authService.register).not.toHaveBeenCalled()
    })

    it('should call next with AppError for invalid email format', async () => {
      const req = {
        body: { email: 'bademail', password: 'secure123', fullName: 'Test', code: '123456' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.register(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should call next with AppError when password is too short (< 6 chars)', async () => {
      const req = {
        body: { email: 'user@example.com', password: '123', fullName: 'Test', code: '123456' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.register(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should call next with AppError when password exceeds 100 characters', async () => {
      const req = {
        body: {
          email: 'user@example.com',
          password: 'a'.repeat(101),
          fullName: 'Test',
          code: '123456',
        },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.register(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should call next with AppError when verification code is invalid', async () => {
      const req = {
        body: {
          email: 'user@example.com',
          password: 'secure123',
          fullName: 'Test',
          code: '000000',
        },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      authService.verifyCode.mockResolvedValue(false)

      await authController.register(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(authService.register).not.toHaveBeenCalled()
    })

    it('should accept password of exactly 6 characters (boundary)', async () => {
      const session = mockSession()
      const req = {
        body: {
          email: 'user@example.com',
          password: 'abc123',
          fullName: 'Test User',
          code: '123456',
        },
        session,
      }
      const res = mockResponse()
      const next = vi.fn()

      const mockUser = { id: 'u3', role: 'USER' }
      authService.verifyCode.mockResolvedValue(true)
      authService.register.mockResolvedValue({ user: mockUser })

      await authController.register(req, res, next)

      expect(authService.register).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // sendVerificationCode
  // ─────────────────────────────────────────────
  describe('sendVerificationCode', () => {
    it('should return 200 on valid email and type', async () => {
      const req = {
        body: { email: 'user@example.com', type: 'REGISTER' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      authService.generateAndSendVerificationCode.mockResolvedValue(true)

      await authController.sendVerificationCode(req, res, next)

      expect(authService.generateAndSendVerificationCode).toHaveBeenCalledWith(
        'user@example.com',
        'REGISTER'
      )
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Mã xác nhận đã được gửi thành công.',
      })
    })

    it('should return 200 for RESET_PASSWORD type', async () => {
      const req = {
        body: { email: 'user@example.com', type: 'RESET_PASSWORD' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      authService.generateAndSendVerificationCode.mockResolvedValue(true)

      await authController.sendVerificationCode(req, res, next)

      expect(authService.generateAndSendVerificationCode).toHaveBeenCalledWith(
        'user@example.com',
        'RESET_PASSWORD'
      )
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    })

    it('should call next with AppError when email is missing', async () => {
      const req = { body: { type: 'REGISTER' }, session: mockSession() }
      const res = mockResponse()
      const next = vi.fn()

      await authController.sendVerificationCode(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(authService.generateAndSendVerificationCode).not.toHaveBeenCalled()
    })

    it('should call next with AppError when type is missing', async () => {
      const req = { body: { email: 'user@example.com' }, session: mockSession() }
      const res = mockResponse()
      const next = vi.fn()

      await authController.sendVerificationCode(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should call next with AppError for invalid email format', async () => {
      const req = {
        body: { email: 'not-valid-email', type: 'REGISTER' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.sendVerificationCode(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
    })
  })

  // ─────────────────────────────────────────────
  // resetPassword
  // ─────────────────────────────────────────────
  describe('resetPassword', () => {
    it('should return 200 on valid reset request', async () => {
      const req = {
        body: { email: 'user@example.com', newPassword: 'newpass123', code: '654321' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      authService.verifyCode.mockResolvedValue(true)
      authService.resetPassword.mockResolvedValue(true)

      await authController.resetPassword(req, res, next)

      expect(authService.verifyCode).toHaveBeenCalledWith('user@example.com', '654321', 'RESET_PASSWORD')
      expect(authService.resetPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        newPassword: 'newpass123',
      })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
      })
    })

    it('should call next with AppError when fields are missing', async () => {
      const req = {
        body: { email: 'user@example.com' }, // missing newPassword and code
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.resetPassword(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(authService.resetPassword).not.toHaveBeenCalled()
    })

    it('should call next with AppError when new password is too short', async () => {
      const req = {
        body: { email: 'user@example.com', newPassword: '12345', code: '654321' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.resetPassword(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should call next with AppError when new password exceeds 100 characters', async () => {
      const req = {
        body: { email: 'user@example.com', newPassword: 'a'.repeat(101), code: '654321' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      await authController.resetPassword(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should call next with AppError when verification code is invalid', async () => {
      const req = {
        body: { email: 'user@example.com', newPassword: 'newpass123', code: 'badcode' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      authService.verifyCode.mockResolvedValue(false)

      await authController.resetPassword(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(authService.resetPassword).not.toHaveBeenCalled()
    })

    it('should accept password of exactly 6 characters (boundary)', async () => {
      const req = {
        body: { email: 'user@example.com', newPassword: 'abc123', code: '654321' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      authService.verifyCode.mockResolvedValue(true)
      authService.resetPassword.mockResolvedValue(true)

      await authController.resetPassword(req, res, next)

      expect(authService.resetPassword).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should accept password of exactly 100 characters (boundary)', async () => {
      const req = {
        body: { email: 'user@example.com', newPassword: 'a'.repeat(100), code: '654321' },
        session: mockSession(),
      }
      const res = mockResponse()
      const next = vi.fn()

      authService.verifyCode.mockResolvedValue(true)
      authService.resetPassword.mockResolvedValue(true)

      await authController.resetPassword(req, res, next)

      expect(authService.resetPassword).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })
  })
})