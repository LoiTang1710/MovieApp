import express from 'express'
import * as AuthController from '../controllers/auth.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/send-otp', AuthController.sendOtp)
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/forgot-password', AuthController.forgotPassword)
router.get('/me', isAuthenticated, AuthController.getMe)
router.post('/logout', isAuthenticated, AuthController.logout)

export default router
