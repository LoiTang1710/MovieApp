import express from 'express'
import { getPremiumPlans } from '../controllers/premium.controller.js'

const Router = express.Router()

Router.route('/plans').get(getPremiumPlans)

export default Router
