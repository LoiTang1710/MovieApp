import express from 'express'
import {
  verifyUserSession,
  authorizeRoles,
} from '../middlewares/userAuth.middleware.js'
import { uploadAvatar } from '../middlewares/upload.middleware.js'
import { uploadAvatarImage } from '../controllers/upload.controller.js'
import {
  manageMovies,
  manageUsers,
  managePromotions,
  manageStats,
  manageComments,
} from '../controllers/admin.controller.js'

const Router = express.Router()

// Áp dụng middleware phân quyền dựa trên session cho tất cả các route bên dưới
Router.use(verifyUserSession, authorizeRoles('ADMIN'))

// 1. Quản lý phim
Router.route('/movies').get(manageMovies.list).post(manageMovies.create) // Thêm phim mới (cần dùng multer cho upload file)
Router.get('/movies/tmdb/info', manageMovies.fetchTmdbInfo)
Router.route('/movies/:id').put(manageMovies.update).delete(manageMovies.remove)

Router.post('/upload/avatar', uploadAvatar.single('avatar'), uploadAvatarImage)

// 2. Quản lý người dùng
Router.route('/users').get(manageUsers.list).post(manageUsers.create)

Router.route('/users/:id').put(manageUsers.update).delete(manageUsers.remove)

// 3. Quản lý khuyến mãi
Router.route('/promotions')
  .get(managePromotions.list)
  .post(managePromotions.create)

Router.route('/promotions/:id')
  .put(managePromotions.update)
  .delete(managePromotions.remove)

// 4. Kiểm duyệt bình luận
Router.route('/comments/:id').delete(manageComments.remove)

// 5. Quản lý thống kê
Router.get('/stats/overview', manageStats.getOverview) // Người dùng mới, doanh thu, phim phổ biến
Router.get('/stats/views', manageStats.getViewsReport) // Lượt xem theo phim/ngày
Router.get('/stats/export', manageStats.exportReport) // Xuất báo cáo (CSV/Excel)

export default Router
