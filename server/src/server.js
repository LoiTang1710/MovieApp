import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { env } from './config/environment.config.js'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createApp = () => {
  const app = express()
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '10mb' }))
  app.use(cookieParser())
  app.use(
    session({
      secret: env.SESSION_SECRET || 'fallback-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        sameSite: 'lax',
      },
    })
  )
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
  app.use('/api', apiRouter)
  app.use(errorHandler)
  return app
}

const app = createApp()

const START_SERVER = () => {
  const server = app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`)
    console.log('Reviews: /api/reviews | Comments: /api/comments')
    if (env.ALLOW_DEV_AUTH === 'true') {
      console.log('Dev auth: POST /api/dev/token')
    }
  })
  
  // Set a timeout for the server to start
  server.setTimeout(30000)
}

;(async () => {
  try {
    console.log('1. Connecting to Database')
    console.log('2. Connected to Database')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

export default app
