import express from 'express'
import {
  login,
  register,
  sendVerificationCode,
  resetPassword,
} from '../controllers/auth.controller.js'

const Router = express.Router()

Router.post('/login', login)
Router.post('/register', register)
Router.post('/send-verification-code', sendVerificationCode)
Router.post('/reset-password', resetPassword)

export default Router
