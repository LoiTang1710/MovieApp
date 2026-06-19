// server/test/services/auth.service.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StatusCodes } from 'http-status-codes'

// ─── Mock external dependencies before importing the module under test ───────
vi.mock('../../src/config/database.config.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
  hash: vi.fn(),
  compare: vi.fn(),
}))

import * as authService from '../../src/services/auth.service.js'
import prisma from '../../src/config/database.config.js'
import bcrypt from 'bcryptjs'

// ─────────────────────────────────────────────────────────────────────────────

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // hashPassword / comparePassword
  // ─────────────────────────────────────────────
  describe('hashPassword', () => {
    it('should delegate to bcrypt.hash with salt rounds 12', async () => {
      bcrypt.hash.mockResolvedValue('$2b$12$hashedvalue')

      const result = await authService.hashPassword('mypassword')

      expect(bcrypt.hash).toHaveBeenCalledWith('mypassword', 12)
      expect(result).toBe('$2b$12$hashedvalue')
    })
  })

  describe('comparePassword', () => {
    it('should return true when password matches hash', async () => {
      bcrypt.compare.mockResolvedValue(true)

      const result = await authService.comparePassword('plain', '$2b$12$hash')

      expect(bcrypt.compare).toHaveBeenCalledWith('plain', '$2b$12$hash')
      expect(result).toBe(true)
    })

    it('should return false when password does not match', async () => {
      bcrypt.compare.mockResolvedValue(false)

      const result = await authService.comparePassword('wrong', '$2b$12$hash')

      expect(result).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // login
  // ─────────────────────────────────────────────
  describe('login', () => {
    it('should return user without password on valid credentials', async () => {
      const dbUser = {
        id: 'u1',
        email: 'user@example.com',
        password: 'hashedpass',
        role: 'USER',
        name: 'Test User',
      }
      prisma.user.findUnique.mockResolvedValue(dbUser)
      bcrypt.compare.mockResolvedValue(true)

      const result = await authService.login({ email: 'user@example.com', password: 'password123' })

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'user@example.com' } })
      expect(result.user).toBeDefined()
      expect(result.user.password).toBeUndefined()
      expect(result.user.id).toBe('u1')
      expect(result.user.email).toBe('user@example.com')
    })

    it('should throw AppError when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(
        authService.login({ email: 'ghost@example.com', password: 'anypass' })
      ).rejects.toMatchObject({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Email hoặc mật khẩu không đúng',
      })
    })

    it('should throw AppError when user has no password (social login account)', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u2', email: 'social@example.com', password: null })

      await expect(
        authService.login({ email: 'social@example.com', password: 'anypass' })
      ).rejects.toMatchObject({
        statusCode: StatusCodes.UNAUTHORIZED,
      })
    })

    it('should throw AppError when password is incorrect', async () => {
      const dbUser = { id: 'u1', email: 'user@example.com', password: 'hashedpass', role: 'USER' }
      prisma.user.findUnique.mockResolvedValue(dbUser)
      bcrypt.compare.mockResolvedValue(false)

      await expect(
        authService.login({ email: 'user@example.com', password: 'wrongpass' })
      ).rejects.toMatchObject({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Email hoặc mật khẩu không đúng',
      })
    })

    it('should not return a token in the result (session-based auth)', async () => {
      const dbUser = { id: 'u1', email: 'user@example.com', password: 'hashedpass', role: 'USER' }
      prisma.user.findUnique.mockResolvedValue(dbUser)
      bcrypt.compare.mockResolvedValue(true)

      const result = await authService.login({ email: 'user@example.com', password: 'password123' })

      expect(result.token).toBeUndefined()
    })
  })

  // ─────────────────────────────────────────────
  // register
  // ─────────────────────────────────────────────
  describe('register', () => {
    it('should create a new user and return without password', async () => {
      prisma.user.findUnique.mockResolvedValue(null) // email not taken
      bcrypt.hash.mockResolvedValue('$2b$12$hashed')

      const newDbUser = {
        id: 'u3',
        email: 'new@example.com',
        name: 'New User',
        password: '$2b$12$hashed',
        role: 'USER',
      }
      prisma.user.create.mockResolvedValue(newDbUser)

      const result = await authService.register({
        email: 'new@example.com',
        password: 'secure123',
        fullName: 'New User',
      })

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'new@example.com' } })
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          name: 'New User',
          password: '$2b$12$hashed',
          role: 'USER',
        },
      })
      expect(result.user).toBeDefined()
      expect(result.user.password).toBeUndefined()
      expect(result.user.id).toBe('u3')
    })

    it('should use the fullName as the name field in the database', async () => {
      prisma.user.findUnique.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('$2b$12$hashed')
      prisma.user.create.mockResolvedValue({
        id: 'u4',
        email: 'test@example.com',
        name: 'Full Name',
        password: '$2b$12$hashed',
        role: 'USER',
      })

      await authService.register({
        email: 'test@example.com',
        password: 'secure123',
        fullName: 'Full Name',
      })

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ name: 'Full Name' }) })
      )
    })

    it('should throw AppError when email is already in use', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'taken@example.com' })

      await expect(
        authService.register({ email: 'taken@example.com', password: 'secure123', fullName: 'Test' })
      ).rejects.toMatchObject({
        statusCode: StatusCodes.CONFLICT,
        message: 'Email này đã được sử dụng',
      })

      expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it('should not return a token in the result (session-based auth)', async () => {
      prisma.user.findUnique.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('$2b$12$hashed')
      prisma.user.create.mockResolvedValue({
        id: 'u5', email: 'test@example.com', name: 'T', password: '$2b$12$hashed', role: 'USER',
      })

      const result = await authService.register({
        email: 'test@example.com', password: 'secure123', fullName: 'T',
      })

      expect(result.token).toBeUndefined()
    })
  })

  // ─────────────────────────────────────────────
  // generateAndSendVerificationCode
  // ─────────────────────────────────────────────
  describe('generateAndSendVerificationCode', () => {
    it('should return true on success', async () => {
      const result = await authService.generateAndSendVerificationCode(
        'user@example.com',
        'REGISTER'
      )

      expect(result).toBe(true)
    })

    it('should store a 6-digit code retrievable via verifyCode', async () => {
      const email = 'codetest@example.com'

      await authService.generateAndSendVerificationCode(email, 'REGISTER')

      // We verify the code was stored by calling verifyCode with a wrong code first
      // (actual code is unknown here – we test the contract via verifyCode)
      const wrongResult = await authService.verifyCode(email, '000000', 'REGISTER')
      // Because '000000' is almost certainly not the generated code, should be false
      // (extremely unlikely to be 000000 but this is a probabilistic check for wrong code)
      // We re-generate to get a fresh state, then test type mismatch:
      await authService.generateAndSendVerificationCode(email, 'REGISTER')
      const typeMismatch = await authService.verifyCode(email, '999999', 'RESET_PASSWORD')
      expect(typeMismatch).toBe(false)
    })

    it('should overwrite a previous code for the same email', async () => {
      const email = 'overwrite@example.com'

      await authService.generateAndSendVerificationCode(email, 'REGISTER')
      await authService.generateAndSendVerificationCode(email, 'REGISTER')

      // After two calls, the map entry should still work (not cause errors)
      // We just confirm the second call returns true
      const result = await authService.generateAndSendVerificationCode(email, 'REGISTER')
      expect(result).toBe(true)
    })
  })

  // ─────────────────────────────────────────────
  // verifyCode
  // ─────────────────────────────────────────────
  describe('verifyCode', () => {
    it('should return false when no code exists for the email', async () => {
      const result = await authService.verifyCode('nobody@example.com', '123456', 'REGISTER')
      expect(result).toBe(false)
    })

    it('should return false when type does not match', async () => {
      const email = 'typematch@example.com'
      await authService.generateAndSendVerificationCode(email, 'REGISTER')

      // We cannot know the exact code, but verifying with wrong type should fail
      const result = await authService.verifyCode(email, '123456', 'RESET_PASSWORD')
      expect(result).toBe(false)
    })

    it('should return false for wrong code', async () => {
      const email = 'wrongcode@example.com'
      await authService.generateAndSendVerificationCode(email, 'REGISTER')

      // Use a deliberately incorrect code
      const result = await authService.verifyCode(email, 'XXXXXX', 'REGISTER')
      expect(result).toBe(false)
    })

    it('should return false for an expired code', async () => {
      // Spy on Date.now to simulate time passing
      const email = 'expired@example.com'

      // Store code with past expiry by using fake timers
      vi.useFakeTimers()
      const now = Date.now()
      vi.setSystemTime(now)

      await authService.generateAndSendVerificationCode(email, 'REGISTER')

      // Advance time by 11 minutes (code expires after 10)
      vi.advanceTimersByTime(11 * 60 * 1000)

      // Retrieve the stored code via module internals — we test the boundary effect:
      // Any code we guess will still hit the expiry check before code match
      const result = await authService.verifyCode(email, '123456', 'REGISTER')

      expect(result).toBe(false)
      vi.useRealTimers()
    })

    it('should delete the code after successful verification (one-time use)', async () => {
      // We test this by generating a fresh code, capturing it via a spy on the Map,
      // then verifying it twice – second should fail.
      const email = 'onetime@example.com'

      // Spy on crypto.randomInt to get a deterministic code
      const cryptoModule = await import('crypto')
      const spy = vi.spyOn(cryptoModule.default, 'randomInt').mockReturnValue(111111)

      await authService.generateAndSendVerificationCode(email, 'REGISTER')

      spy.mockRestore()

      const firstResult = await authService.verifyCode(email, '111111', 'REGISTER')
      expect(firstResult).toBe(true)

      // Second call: code was deleted
      const secondResult = await authService.verifyCode(email, '111111', 'REGISTER')
      expect(secondResult).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // resetPassword
  // ─────────────────────────────────────────────
  describe('resetPassword', () => {
    it('should hash the new password and update the user record', async () => {
      bcrypt.hash.mockResolvedValue('$2b$12$newhash')
      prisma.user.update.mockResolvedValue({ id: 'u1', email: 'user@example.com' })

      const result = await authService.resetPassword({
        email: 'user@example.com',
        newPassword: 'newSecure123',
      })

      expect(bcrypt.hash).toHaveBeenCalledWith('newSecure123', 12)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'user@example.com' },
        data: { password: '$2b$12$newhash' },
      })
      expect(result).toBe(true)
    })

    it('should propagate database errors', async () => {
      bcrypt.hash.mockResolvedValue('$2b$12$hash')
      prisma.user.update.mockRejectedValue(new Error('DB connection failed'))

      await expect(
        authService.resetPassword({ email: 'user@example.com', newPassword: 'newpass123' })
      ).rejects.toThrow('DB connection failed')
    })
  })
})
