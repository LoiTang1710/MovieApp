import express from 'express'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

// GET /api/stats
Router.route('/').get((req, res) => {
  res.status(StatusCodes.OK).json({
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  })
})

export default Router
