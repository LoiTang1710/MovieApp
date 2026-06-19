// server/test/middlewares/error.middleware.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import { errorHandler } from '../../src/middlewares/error.middleware.js'
import { AppError } from '../../src/utils/AppError.js'

// ─── Helper: create a mock Express response ───────────────────────────────────
const mockResponse = () => {
  const res = {}
  res.headersSent = false
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('errorHandler Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error noise during tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  // ─────────────────────────────────────────────
  // AppError handling
  // ─────────────────────────────────────────────
  describe('when error is an AppError', () => {
    it('should respond with the AppError statusCode and message', () => {
      const err = new AppError('Vui lòng nhập email và mật khẩu', StatusCodes.BAD_REQUEST)
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Vui lòng nhập email và mật khẩu',
        })
      )
    })

    it('should include success: false in the AppError response', () => {
      const err = new AppError('Not found', StatusCodes.NOT_FOUND)
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      const payload = res.json.mock.calls[0][0]
      expect(payload.success).toBe(false)
    })

    it('should include the error code field from AppError', () => {
      const err = new AppError('Bad request', StatusCodes.BAD_REQUEST, 'VALIDATION_FAILED')
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      const payload = res.json.mock.calls[0][0]
      expect(payload.code).toBe('VALIDATION_FAILED')
    })

    it('should respond with 401 for UNAUTHORIZED AppError', () => {
      const err = new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    })

    it('should respond with 403 for FORBIDDEN AppError', () => {
      const err = new AppError('Forbidden', StatusCodes.FORBIDDEN)
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
    })

    it('should respond with 409 for CONFLICT AppError', () => {
      const err = new AppError('Email đã tồn tại', StatusCodes.CONFLICT)
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CONFLICT)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Email đã tồn tại' })
      )
    })

    it('should not call next when AppError is handled', () => {
      const err = new AppError('Bad', StatusCodes.BAD_REQUEST)
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(next).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // Generic / unexpected error handling
  // ─────────────────────────────────────────────
  describe('when error is a generic Error', () => {
    it('should respond with 500 INTERNAL_SERVER_ERROR', () => {
      const err = new Error('Something broke')
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    })

    it('should include success: false and INTERNAL_ERROR code', () => {
      const err = new Error('DB connection lost')
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Đã xảy ra lỗi máy chủ nội bộ.',
        code: 'INTERNAL_ERROR',
      })
    })

    it('should log the error to console.error', () => {
      const err = new Error('Unexpected crash')
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(console.error).toHaveBeenCalled()
    })

    it('should not call next when generic error is handled', () => {
      const err = new Error('Generic')
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(next).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // Headers already sent
  // ─────────────────────────────────────────────
  describe('when headers are already sent', () => {
    it('should delegate to next(err) without sending another response', () => {
      const err = new Error('Late error')
      const req = {}
      const res = mockResponse()
      res.headersSent = true
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(next).toHaveBeenCalledWith(err)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    it('should delegate AppError to next when headers are sent', () => {
      const err = new AppError('Too late', StatusCodes.BAD_REQUEST)
      const req = {}
      const res = mockResponse()
      res.headersSent = true
      const next = vi.fn()

      errorHandler(err, req, res, next)

      expect(next).toHaveBeenCalledWith(err)
      expect(res.json).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // AppError default code
  // ─────────────────────────────────────────────
  describe('AppError default code', () => {
    it('should use BAD_REQUEST as the default code when none is provided', () => {
      const err = new AppError('Validation failed', StatusCodes.BAD_REQUEST)
      const req = {}
      const res = mockResponse()
      const next = vi.fn()

      errorHandler(err, req, res, next)

      const payload = res.json.mock.calls[0][0]
      expect(payload.code).toBe('BAD_REQUEST')
    })
  })
})