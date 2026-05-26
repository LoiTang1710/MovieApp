import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'
import { hashPassword } from '../services/auth.service.js'
import {
  adminMovieService,
  adminUserService,
  adminPromotionService,
  adminStatsService,
} from '../services/admin.service.js'

const handleError = (res, error) => {
  const status = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  if (error.code === 'P2025') {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy dữ liệu' })
  }
  if (error.code === 'P2002') {
    return res.status(StatusCodes.CONFLICT).json({ message: 'Dữ liệu đã tồn tại' })
  }
  return res.status(status).json({ message: error.message || 'Lỗi máy chủ' })
}

export const manageMovies = {
  list: catchAsync(async (req, res) => {
    const data = await adminMovieService.list(req.query)
    res.status(StatusCodes.OK).json({ message: 'Lấy danh sách phim thành công', data })
  }),
  create: catchAsync(async (req, res) => {
    const movie = await adminMovieService.create(req.body)
    res.status(StatusCodes.CREATED).json({ message: 'Thêm phim mới thành công', data: movie })
  }),
  update: catchAsync(async (req, res) => {
    try {
      const movie = await adminMovieService.update(req.params.id, req.body)
      res.status(StatusCodes.OK).json({ message: 'Cập nhật phim thành công', data: movie })
    } catch (e) {
      handleError(res, e)
    }
  }),
  remove: catchAsync(async (req, res) => {
    try {
      await adminMovieService.remove(req.params.id)
      res.status(StatusCodes.OK).json({ message: 'Xóa phim thành công' })
    } catch (e) {
      handleError(res, e)
    }
  }),
}

export const manageUsers = {
  list: catchAsync(async (req, res) => {
    const data = await adminUserService.list(req.query)
    res.status(StatusCodes.OK).json({ message: 'Lấy danh sách người dùng', data })
  }),
  create: catchAsync(async (req, res) => {
    try {
      const user = await adminUserService.create(req.body, hashPassword)
      res.status(StatusCodes.CREATED).json({ message: 'Tạo người dùng mới thành công', data: user })
    } catch (e) {
      handleError(res, e)
    }
  }),
  update: catchAsync(async (req, res) => {
    try {
      const user = await adminUserService.update(req.params.id, req.body, hashPassword)
      res.status(StatusCodes.OK).json({ message: 'Cập nhật người dùng thành công', data: user })
    } catch (e) {
      handleError(res, e)
    }
  }),
  remove: catchAsync(async (req, res) => {
    try {
      await adminUserService.remove(req.params.id)
      res.status(StatusCodes.OK).json({ message: 'Xóa người dùng thành công' })
    } catch (e) {
      handleError(res, e)
    }
  }),
}

export const managePromotions = {
  list: catchAsync(async (req, res) => {
    const data = await adminPromotionService.list(req.query)
    res.status(StatusCodes.OK).json({ message: 'Lấy danh sách khuyến mãi', data })
  }),
  create: catchAsync(async (req, res) => {
    try {
      const promo = await adminPromotionService.create(req.body)
      res.status(StatusCodes.CREATED).json({ message: 'Thêm khuyến mãi mới', data: promo })
    } catch (e) {
      handleError(res, e)
    }
  }),
  update: catchAsync(async (req, res) => {
    try {
      const promo = await adminPromotionService.update(req.params.id, req.body)
      res.status(StatusCodes.OK).json({ message: 'Cập nhật khuyến mãi thành công', data: promo })
    } catch (e) {
      handleError(res, e)
    }
  }),
  remove: catchAsync(async (req, res) => {
    try {
      await adminPromotionService.remove(req.params.id)
      res.status(StatusCodes.OK).json({ message: 'Hủy khuyến mãi thành công' })
    } catch (e) {
      handleError(res, e)
    }
  }),
}

export const manageStats = {
  getOverview: catchAsync(async (req, res) => {
    const dashboardData = await adminStatsService.getOverview(req.query)
    res.status(StatusCodes.OK).json({
      message: 'Lấy dữ liệu tổng quan thành công',
      data: dashboardData,
    })
  }),
  getViewsReport: catchAsync(async (req, res) => {
    const { type = 'by_movie' } = req.query
    const data = await adminStatsService.getViewsReport(type)
    res.status(StatusCodes.OK).json({
      message: `Lấy báo cáo lượt xem thành công`,
      data,
    })
  }),
  exportReport: catchAsync(async (req, res) => {
    const csv = await adminStatsService.exportReport()
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="movieapp-report.csv"')
    res.status(StatusCodes.OK).send('\uFEFF' + csv)
  }),
}
