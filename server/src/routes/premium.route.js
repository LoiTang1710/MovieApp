import express from 'express'
import {
  confirmDevPayment,
  createSubscription,
  getMyPremiumSubscription,
  getPremiumPlans,
} from '../controllers/premium.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const Router = express.Router()

Router.route('/plans').get(getPremiumPlans)
Router.route('/me').get(verifyToken, getMyPremiumSubscription)
Router.route('/subscriptions').post(verifyToken, createSubscription)
Router.route('/payments/:paymentId/simulate-success').post(
  verifyToken,
  confirmDevPayment,
)

export default Router
