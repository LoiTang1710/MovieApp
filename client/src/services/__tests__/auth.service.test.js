// client/src/services/__tests__/auth.service.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the axios instance before importing auth.service
// This prevents import.meta.env resolution issues and isolates the service logic
vi.mock('../axios.js', () => ({
  default: {
    post: vi.fn(),
  },
}))

import * as authService from '../auth.service.js'
import axiosInstance from '../axios.js'

describe('Client Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // sendVerificationCode
  // ─────────────────────────────────────────────
  describe('sendVerificationCode', () => {
    it('should POST to /auth/send-verification-code with the provided data', async () => {
      const responseData = { success: true, message: 'Mã xác nhận đã được gửi thành công.' }
      axiosInstance.post.mockResolvedValue({ data: responseData })

      const payload = { email: 'user@example.com', type: 'REGISTER' }
      const result = await authService.sendVerificationCode(payload)

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/send-verification-code', payload)
      expect(result).toEqual(responseData)
    })

    it('should POST with RESET_PASSWORD type', async () => {
      const responseData = { success: true, message: 'Sent' }
      axiosInstance.post.mockResolvedValue({ data: responseData })

      const payload = { email: 'user@example.com', type: 'RESET_PASSWORD' }
      await authService.sendVerificationCode(payload)

      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/auth/send-verification-code',
        payload
      )
    })

    it('should propagate axios errors to the caller', async () => {
      const error = { response: { status: 400, data: { message: 'Invalid email' } } }
      axiosInstance.post.mockRejectedValue(error)

      await expect(
        authService.sendVerificationCode({ email: 'bad', type: 'REGISTER' })
      ).rejects.toEqual(error)
    })

    it('should return response.data (not the full response object)', async () => {
      const data = { success: true }
      axiosInstance.post.mockResolvedValue({ data, status: 200, headers: {} })

      const result = await authService.sendVerificationCode({ email: 'x@x.com', type: 'REGISTER' })

      expect(result).toEqual(data)
      expect(result.status).toBeUndefined()
    })
  })

  // ─────────────────────────────────────────────
  // register
  // ─────────────────────────────────────────────
  describe('register', () => {
    it('should POST to /auth/register with user data', async () => {
      const responseData = { success: true, message: 'Đăng ký thành công', data: { id: 'u1' } }
      axiosInstance.post.mockResolvedValue({ data: responseData })

      const payload = {
        fullName: 'Test User',
        email: 'new@example.com',
        password: 'secure123',
        code: '123456',
      }
      const result = await authService.register(payload)

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register', payload)
      expect(result).toEqual(responseData)
    })

    it('should propagate 409 conflict error when email is already taken', async () => {
      const error = { response: { status: 409, data: { message: 'Email đã tồn tại' } } }
      axiosInstance.post.mockRejectedValue(error)

      await expect(
        authService.register({ email: 'taken@example.com', password: 'pw', fullName: 'X', code: '111111' })
      ).rejects.toEqual(error)
    })

    it('should return response.data', async () => {
      const data = { success: true, data: { id: 'u2' } }
      axiosInstance.post.mockResolvedValue({ data, status: 201 })

      const result = await authService.register({ email: 'x@x.com', password: 'pw', fullName: 'X', code: '111111' })

      expect(result).toEqual(data)
    })
  })

  // ─────────────────────────────────────────────
  // login
  // ─────────────────────────────────────────────
  describe('login', () => {
    it('should POST to /auth/login with email and password', async () => {
      const responseData = { success: true, message: 'Đăng nhập thành công', data: { id: 'u1', role: 'USER' } }
      axiosInstance.post.mockResolvedValue({ data: responseData })

      const payload = { email: 'user@example.com', password: 'password123' }
      const result = await authService.login(payload)

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', payload)
      expect(result).toEqual(responseData)
    })

    it('should propagate 401 error for invalid credentials', async () => {
      const error = { response: { status: 401, data: { message: 'Email hoặc mật khẩu không đúng' } } }
      axiosInstance.post.mockRejectedValue(error)

      await expect(
        authService.login({ email: 'user@example.com', password: 'wrong' })
      ).rejects.toEqual(error)
    })

    it('should return response.data (not the raw axios response)', async () => {
      const data = { success: true, data: { id: 'u1' } }
      axiosInstance.post.mockResolvedValue({ data, headers: { 'set-cookie': 'sessionId=abc' } })

      const result = await authService.login({ email: 'x@x.com', password: 'p' })

      expect(result).toEqual(data)
    })
  })

  // ─────────────────────────────────────────────
  // resetPassword
  // ─────────────────────────────────────────────
  describe('resetPassword', () => {
    it('should POST to /auth/reset-password with email, newPassword, and code', async () => {
      const responseData = { success: true, message: 'Đổi mật khẩu thành công.' }
      axiosInstance.post.mockResolvedValue({ data: responseData })

      const payload = { email: 'user@example.com', newPassword: 'newpass123', code: '654321' }
      const result = await authService.resetPassword(payload)

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/reset-password', payload)
      expect(result).toEqual(responseData)
    })

    it('should propagate 400 error when code is invalid', async () => {
      const error = { response: { status: 400, data: { message: 'Mã xác nhận không hợp lệ' } } }
      axiosInstance.post.mockRejectedValue(error)

      await expect(
        authService.resetPassword({ email: 'x@x.com', newPassword: 'newpass', code: 'bad' })
      ).rejects.toEqual(error)
    })

    it('should return response.data', async () => {
      const data = { success: true }
      axiosInstance.post.mockResolvedValue({ data })

      const result = await authService.resetPassword({ email: 'x@x.com', newPassword: 'p', code: '111111' })

      expect(result).toEqual(data)
    })
  })
})