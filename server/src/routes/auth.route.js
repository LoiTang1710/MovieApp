import express from 'express'
import {
  login,
  register,
  sendVerificationCode,
  resetPassword,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller.js'
import { verifyUserSession } from '../middlewares/userAuth.middleware.js'

const Router = express.Router()

Router.post('/login', login)
Router.post('/register', register)
Router.post('/send-verification-code', sendVerificationCode)
Router.post('/reset-password', resetPassword)
Router.post('/logout', verifyUserSession, logout)
Router.get('/me', verifyUserSession, getCurrentUser)

export default Router
