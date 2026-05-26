import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { env } from './config/environment.config.js'
import apiRouter from './routes/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const START_SERVER = () => {
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

  app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`)
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