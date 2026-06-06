import { beforeEach, describe, it, vi } from 'vitest'
import * as authController from '../../src/controllers/auth.controller.js'
import * as authService from '../../src/services/auth.service.js'
import { StatusCodes } from 'http-status-codes'
import { expect } from 'chai'
import { AppError } from '../../src/utils/AppError.js'
vi.mock('../../src/services/auth.service.js')

describe('Authorization', () => {
  let mockReq
  let mockRes
  let mockNext

  beforeEach(() => {
    vi.clearAllMocks()
    mockReq = {
      body: {},
      session: {
        destroy: vi.fn((cb) => cb(null)),
      },
      clearCookie: vi.fn(),
    }
    mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn(),
      clearCookie: vi.fn(),
    }
    mockNext = vi.fn()
  })

  // ==========================================
  // TEST ĐĂNG NHẬP (LOGIN)
  // ==========================================
  describe('login', () => {
    it('Nên ném lỗi 400 nếu thiếu email hoặc mật khẩu', async () => {
      mockReq.body = { email: 'test@example.com' } // Thiếu password

      await authController.login(mockReq, mockRes, mockNext)

      // Vì dùng catchAsync, lỗi sẽ được đẩy vào hàm next()
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError))
      const error = mockNext.mock.calls[0][0]
      expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(error.message).toBe('Vui lòng nhập email và mật khẩu')
    })
  })
})
