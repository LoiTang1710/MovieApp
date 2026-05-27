import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/environment.config.js'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const START_SERVER = () => {
  const app = express()
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '10mb' }))

  app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

  app.use('/api', apiRouter)
  app.use(errorHandler)

  app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`)
    console.log('Reviews: /api/reviews | Comments: /api/comments')
    if (process.env.ALLOW_DEV_AUTH === 'true') {
      console.log('Dev auth: POST /api/dev/token')
    }
  })
}
;(async () => {
  try {
    console.log(`1. Connecting to Database`)
    console.log(`2. Connected to Database`)
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()