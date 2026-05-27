// // server/test/api/auth.test.js
// import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
// import request from 'supertest'
// import app from '../../src/server.js'

// describe('Authentication API', () => {
//   const testUser = {
//     email: 'test@example.com',
//     password: 'TestPass123!',
//     name: 'Test User',
//   }

//   // Test đăng ký
//   it('should register a new user successfully', async () => {
//     const response = await request(app)
//       .post('/api/auth/register')
//       .send(testUser)
//       .expect(201)

//     expect(response.body).toHaveProperty('token')
//     expect(response.body.user.email).toBe(testUser.email)
//   })

//   // Test đăng nhập
//   it('should login with valid credentials', async () => {
//     const response = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: testUser.email,
//         password: testUser.password,
//       })
//       .expect(200)

//     expect(response.body).toHaveProperty('token')
//     expect(response.body.user).toBeDefined()
//   })

//   // Test lỗi validation
//   it('should fail login with invalid email', async () => {
//     const response = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: 'invalid-email',
//         password: testUser.password,
//       })
//       .expect(400)

//     expect(response.body).toHaveProperty('error')
//   })

//   // Test missing fields
//   it('should return 400 when email is missing', async () => {
//     const response = await request(app)
//       .post('/api/auth/register')
//       .send({ password: 'test123' })
//       .expect(400)

//     expect(response.body.error).toMatch(/email/i)
//   })
// })
