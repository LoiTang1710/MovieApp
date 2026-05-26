import express from 'express'
import { isAuthenticated, verifyAdmin } from '../middlewares/auth.middleware.js'
import {
  manageMovies,
  manageUsers,
  managePromotions,
  manageStats
} from '../controllers/admin.controller.js'

const Router = express.Router()

// Áp dụng middleware verifyAdmin cho tất cả các route bên dưới
// Phải chạy isAuthenticated trước để lấy thông tin user từ session
Router.use(isAuthenticated, verifyAdmin)

// 1. Quản lý phim
Router.route('/movies')
  .get(manageMovies.list)
  .post(manageMovies.create) // Thêm phim mới (cần dùng multer cho upload file)

Router.route('/movies/:id')
  .put(manageMovies.update)
  .delete(manageMovies.remove)

Router.post('/upload/avatar', uploadAvatar.single('avatar'), uploadAvatarImage)

// 2. Quản lý người dùng
Router.route('/users')
  .get(manageUsers.list)
  .post(manageUsers.create)

Router.route('/users/:id')
  .put(manageUsers.update)
  .delete(manageUsers.remove)

// 3. Quản lý khuyến mãi
Router.route('/promotions')
  .get(managePromotions.list)
  .post(managePromotions.create)

Router.route('/promotions/:id')
  .put(managePromotions.update)
  .delete(managePromotions.remove)

// 4. Quản lý thống kê
Router.get('/stats/overview', manageStats.getOverview) // Người dùng mới, doanh thu, phim phổ biến
Router.get('/stats/views', manageStats.getViewsReport)   // Lượt xem theo phim/ngày
Router.get('/stats/export', manageStats.exportReport)   // Xuất báo cáo (CSV/Excel)

export default Router