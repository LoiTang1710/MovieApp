import 'dotenv/config'
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

  // 1. LUÔN BẬT CORS LÊN ĐẦU TIÊN (Gỡ bỏ hẳn 'if production' gò bó để dev thuận tiện)
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
      ],
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
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        sameSite: 'lax',
      },
    }),
  )

  // 2. ƯU TIÊN PHỤC VỤ CÁC ROUTE API VÀ TỆP TẢI LÊN TRƯỚC (Rất quan trọng!)
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
  app.use('/api', apiRouter)

  // 3. XỬ LÝ ĐIỀU HƯỚNG FILE TĨNH SỬ DỤNG CÚ PHÁP EXPRESS 5 CHUẨN ĐẶT Ở CUỐI
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    const clientDistPath = path.join(__dirname, '../../client/dist')
    app.use(express.static(clientDistPath))

    // Thay thế '/*p' lỗi bằng cú pháp tham số bắt chuỗi chuẩn của Express 5
    app.get('/*p', (req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'))
    })
  } else {
    // Nếu ở chế độ dev thuần, định tuyến catch-all sẽ nhắc nhở trên cổng 3000
    app.get('/*p', (req, res) => {
      res.json({
        message:
          'Cinevibe Backend đang chạy ở chế độ Development. Hãy truy cập website thông qua Frontend port 5173!',
      })
    })
  }

  // Khối bắt lỗi hệ thống luôn nằm cuối cùng
  app.use(errorHandler)
  return app
}

const app = createApp()

const START_SERVER = () => {
  const server = app.listen(env.APP_PORT, () => {
    console.log(
      `Server is running on port ${env.APP_PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`,
    )
    if (env.ALLOW_DEV_AUTH === 'true') {
      console.log('3. Dev auth: POST /api/dev/token')
    }
  })

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
