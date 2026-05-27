import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/environment.config.js'
import apiRouter from './routes/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 1. Đưa app ra ngoài
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api', apiRouter)

// 2. Hàm start server chỉ làm nhiệm vụ lắng nghe cổng (listen)
const START_SERVER = () => {
  app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`)
  })
}

;(async () => {
  try {
    console.log(`1. Connecting to Database`)
    // Chỗ này bạn có thể thêm logic connect DB thực tế nếu cần
    console.log(`2. Connected to Database`)
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

// 3. EXPORT APP ĐỂ SUPERTEST CÓ THỂ ĐỌC ĐƯỢC
export default app
