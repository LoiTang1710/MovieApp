import express from 'express'
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getSubscriptionHistory
} from '../controllers/user.controller.js'
import { verifyUserSession } from '../middlewares/userAuth.middleware.js'
import { uploadAvatar } from '../middlewares/upload.middleware.js' // Assuming upload middleware exists

const Router = express.Router()

// All routes require user authentication
Router.use(verifyUserSession)

Router.get('/profile', getUserProfile)
// Using multer for avatar upload, assuming 'avatar' is the field name
Router.put('/profile', uploadAvatar.single('avatar'), updateUserProfile)

Router.post('/change-password', changePassword)
Router.get('/subscription-history', getSubscriptionHistory)

export default Router
