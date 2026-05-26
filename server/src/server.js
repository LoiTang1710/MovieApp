import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/environment.config.js'
import apiRouter from './routes/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const START_SERVER = () => {
  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '10mb' }))

  app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

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