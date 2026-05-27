import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { env } from './config/environment.config.js'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createApp = () => {
  const app = express()
  
  app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
  }))
  
  app.use(express.json())

  app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set true if HTTPS is configured
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  }))

  app.use('/api', apiRouter)
  app.use(errorHandler)
  return app
}

const app = createApp()

const START_SERVER = () => {
  app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`)
    console.log('Reviews: /api/reviews | Comments: /api/comments')
    if (env.ALLOW_DEV_AUTH === 'true') {
      console.log('Dev auth: POST /api/dev/token')
    }
  })
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
