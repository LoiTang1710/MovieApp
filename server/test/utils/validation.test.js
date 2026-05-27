// // server/test/utils/validation.test.js
// import { describe, it, expect } from 'vitest'
// import {
//   validateEmail,
//   validatePassword,
//   hashPassword,
// } from '../../src/utils/validation.js'

// describe('Validation Utils', () => {
//   describe('validateEmail', () => {
//     it('should validate correct email format', () => {
//       expect(validateEmail('test@example.com')).toBe(true)
//       expect(validateEmail('user.name@domain.co.uk')).toBe(true)
//     })

//     it('should reject invalid email format', () => {
//       expect(validateEmail('invalid-email')).toBe(false)
//       expect(validateEmail('test@')).toBe(false)
//       expect(validateEmail('')).toBe(false)
//     })
//   })

//   describe('validatePassword', () => {
//     it('should validate strong password', () => {
//       expect(validatePassword('StrongPass123!')).toBe(true)
//     })

//     it('should reject weak password', () => {
//       expect(validatePassword('123')).toBe(false)
//       expect(validatePassword('password')).toBe(false)
//     })

//     it('should have minimum 8 characters', () => {
//       expect(validatePassword('Short1!')).toBe(false)
//       expect(validatePassword('LongEnough123!')).toBe(true)
//     })
//   })

//   describe('hashPassword', () => {
//     it('should hash password and return different value', async () => {
//       const password = 'TestPassword123!'
//       const hash = await hashPassword(password)

//       expect(hash).not.toBe(password)
//       expect(hash.length).toBeGreaterThan(20)
//     })

//     it('should produce different hashes for same password', async () => {
//       const password = 'TestPassword123!'
//       const hash1 = await hashPassword(password)
//       const hash2 = await hashPassword(password)

//       expect(hash1).not.toBe(hash2)
//     })
//   })
// })
