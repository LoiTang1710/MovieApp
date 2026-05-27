import express from 'express'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { optionalVerifyToken } from '../middlewares/optionalAuth.middleware.js'
import {
  createComment,
  createReply,
  listComments,
  toggleLike,
} from '../controllers/comment.controller.js'

const router = express.Router()

router.get('/', optionalVerifyToken, listComments)
router.post('/', verifyToken, createComment)
router.post('/:parentId/replies', verifyToken, createReply)
router.post('/:id/like', verifyToken, toggleLike)

export default router
