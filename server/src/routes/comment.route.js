import express from 'express'
import { verifyUserSession, optionalVerifyUserSession } from '../middlewares/userAuth.middleware.js'
import {
  createComment,
  createReply,
  listComments,
  toggleLike,
} from '../controllers/comment.controller.js'

const router = express.Router()

// GET / – liệt kê bình luận (khách xem được, user đã login thì có thể thấy trạng thái like của mình)
router.get('/', optionalVerifyUserSession, listComments)

// POST / – tạo bình luận mới (bắt buộc đăng nhập)
router.post('/', verifyUserSession, createComment)

// POST /:parentId/replies – trả lời bình luận (bắt buộc đăng nhập)
router.post('/:parentId/replies', verifyUserSession, createReply)

// POST /:id/like – toggle like (bắt buộc đăng nhập)
router.post('/:id/like', verifyUserSession, toggleLike)

export default router
