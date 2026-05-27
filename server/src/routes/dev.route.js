import express from 'express'
import { getDevToken } from '../controllers/dev.controller.js'

const router = express.Router()

router.post('/token', getDevToken)

export default router
