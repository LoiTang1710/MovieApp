// server/test/middlewares/userAuth.middleware.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import {
  verifyUserSession,
  optionalVerifyUserSession,
  authorizeRoles,
} from '../../src/middlewares/userAuth.middleware.js'

// ─── Helper: create a mock Express response ───────────────────────────────────
const mockResponse = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('userAuth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // verifyUserSession
  // ─────────────────────────────────────────────
  describe('verifyUserSession', () => {
    it('should call next and set req.user when session.user exists', () => {
      const sessionUser = { id: 'u1', role: 'USER' }
      const req = { session: { user: sessionUser } }
      const res = mockResponse()
      const next = vi.fn()

      verifyUserSession(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(req.user).toEqual(sessionUser)
      expect(res.status).not.toHaveBeenCalled()
    })

    it('should return 401 when session is missing', () => {
      const req = { session: {} }
      const res = mockResponse()
      const next = vi.fn()

      verifyUserSession(req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.',
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 when session itself is undefined', () => {
      const req = { session: undefined }
      const res = mockResponse()
      const next = vi.fn()

      verifyUserSession(req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 when session.user is null', () => {
      const req = { session: { user: null } }
      const res = mockResponse()
      const next = vi.fn()

      verifyUserSession(req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(next).not.toHaveBeenCalled()
    })

    it('should sync req.user from session.user so controllers read the same source', () => {
      const sessionUser = { id: 'admin1', role: 'ADMIN' }
      const req = { session: { user: sessionUser } }
      const res = mockResponse()
      const next = vi.fn()

      verifyUserSession(req, res, next)

      expect(req.user).toBe(sessionUser) // same reference
    })
  })

  // ─────────────────────────────────────────────
  // optionalVerifyUserSession
  // ─────────────────────────────────────────────
  describe('optionalVerifyUserSession', () => {
    it('should call next and set req.user when session.user exists', () => {
      const sessionUser = { id: 'u2', role: 'USER' }
      const req = { session: { user: sessionUser } }
      const res = mockResponse()
      const next = vi.fn()

      optionalVerifyUserSession(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(req.user).toEqual(sessionUser)
    })

    it('should call next without setting req.user when session is absent', () => {
      const req = { session: {} }
      const res = mockResponse()
      const next = vi.fn()

      optionalVerifyUserSession(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(req.user).toBeUndefined()
      expect(res.status).not.toHaveBeenCalled()
    })

    it('should call next without error even when session is undefined', () => {
      const req = { session: undefined }
      const res = mockResponse()
      const next = vi.fn()

      optionalVerifyUserSession(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
    })

    it('should never block a request regardless of session state', () => {
      const scenarios = [
        { session: undefined },
        { session: {} },
        { session: { user: null } },
        { session: { user: { id: 'x', role: 'USER' } } },
      ]

      for (const session of scenarios) {
        const req = { session: session.session }
        const res = mockResponse()
        const next = vi.fn()

        optionalVerifyUserSession(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(res.status).not.toHaveBeenCalled()
      }
    })
  })

  // ─────────────────────────────────────────────
  // authorizeRoles
  // ─────────────────────────────────────────────
  describe('authorizeRoles', () => {
    it('should call next when user role is in the allowed list', () => {
      const req = { user: { id: 'a1', role: 'ADMIN' }, session: {} }
      const res = mockResponse()
      const next = vi.fn()

      authorizeRoles('ADMIN')(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
    })

    it('should call next when user role matches one of multiple allowed roles', () => {
      const req = { user: { id: 'u1', role: 'USER' }, session: {} }
      const res = mockResponse()
      const next = vi.fn()

      authorizeRoles('ADMIN', 'USER')(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should return 403 when user role is not allowed', () => {
      const req = { user: { id: 'u1', role: 'USER' }, session: {} }
      const res = mockResponse()
      const next = vi.fn()

      authorizeRoles('ADMIN')(req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này.',
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 403 when req.user is not set but session.user has wrong role', () => {
      const req = { user: undefined, session: { user: { id: 'u1', role: 'USER' } } }
      const res = mockResponse()
      const next = vi.fn()

      authorizeRoles('ADMIN')(req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
      expect(next).not.toHaveBeenCalled()
    })

    it('should fall back to session.user when req.user is not set', () => {
      const req = { user: undefined, session: { user: { id: 'a1', role: 'ADMIN' } } }
      const res = mockResponse()
      const next = vi.fn()

      authorizeRoles('ADMIN')(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should return 403 when neither req.user nor session.user exists', () => {
      const req = { user: undefined, session: {} }
      const res = mockResponse()
      const next = vi.fn()

      authorizeRoles('ADMIN')(req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return a middleware function (factory pattern)', () => {
      const middleware = authorizeRoles('ADMIN')
      expect(typeof middleware).toBe('function')
    })

    it('should work with an empty allowedRoles list (deny all)', () => {
      const req = { user: { id: 'u1', role: 'USER' }, session: {} }
      const res = mockResponse()
      const next = vi.fn()

      authorizeRoles()(req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
      expect(next).not.toHaveBeenCalled()
    })
  })
})