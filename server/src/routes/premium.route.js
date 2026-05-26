import express from 'express'
import {
  createSubscription,
  getPremiumPlans,
} from '../controllers/premium.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const Router = express.Router()

Router.route('/plans').get(getPremiumPlans)
Router.route('/subscriptions').post(verifyToken, createSubscription)

export default Router
