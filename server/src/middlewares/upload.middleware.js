import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '../../uploads/avatars')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

const fileFilter = (_req, file, cb) => {
  if (file.mimetype?.startsWith('image/')) cb(null, true)
  else cb(new Error('Chỉ chấp nhận file ảnh'), false)
}

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})
