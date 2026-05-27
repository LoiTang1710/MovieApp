// server/test/controllers/media.controller.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import * as mediaController from '../../src/controllers/media.controller.js'
import * as mediaService from '../../src/services/media.service.js'

// 1. Mock toàn bộ các hàm trong media.service.js
vi.mock('../../src/services/media.service.js', () => ({
  getImagesPopular: vi.fn(),
  getMediaDetail: vi.fn(),
  getDetailEpisodes: vi.fn(),
  getMediasPopular: vi.fn(),
  getMediasTrailer: vi.fn(),
  getMediasReleased: vi.fn(),
  getMediasTopRated: vi.fn(),
  getMediasAnime: vi.fn(),
}))

// 2. Tạo hàm hỗ trợ giả lập đối tượng Response (res) của Express
const mockResponse = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('Media Controller', () => {
  // Xóa lịch sử gọi mock trước mỗi bài test để không bị trùng lặp
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPopulars', () => {
    it('should return popular medias successfully', async () => {
      // Chuẩn bị dữ liệu giả lập (Arrange)
      const req = {} // Không có params hay query
      const res = mockResponse()
      const next = vi.fn() // Hàm next của middleware (dành cho catchAsync)
      const mockData = [
        { id: 1, title: 'Phim Hot 1' },
        { id: 2, title: 'Phim Hot 2' },
      ]

      // Giả lập service trả về mockData
      mediaService.getMediasPopular.mockResolvedValue(mockData)

      // Thực thi hàm controller (Act)
      await mediaController.getPopulars(req, res, next)

      // Kiểm tra kết quả (Assert)
      expect(mediaService.getMediasPopular).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK) // Kiểm tra trả về status 200
      expect(res.json).toHaveBeenCalledWith(mockData) // Kiểm tra trả về đúng data
    })
  })

  describe('getDetail', () => {
    it('should return media detail based on id and type', async () => {
      // Chuẩn bị req có chứa params và query
      const req = {
        params: { id: '123' },
        query: { type: 'movie' },
      }
      const res = mockResponse()
      const next = vi.fn()
      const mockData = { id: '123', title: 'Chi tiết phim', type: 'movie' }

      mediaService.getMediaDetail.mockResolvedValue(mockData)

      await mediaController.getDetail(req, res, next)

      // Đảm bảo service được gọi với đúng tham số lấy từ req
      expect(mediaService.getMediaDetail).toHaveBeenCalledWith('123', 'movie')
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.json).toHaveBeenCalledWith(mockData)
    })
  })

  describe('getEpisodes', () => {
    it('should return episodes with default season 1 if not provided', async () => {
      const req = {
        params: { id: '456' },
        query: {}, // Cố tình để trống query để test default value
      }
      const res = mockResponse()
      const next = vi.fn()
      const mockData = [{ episode: 1, name: 'Tập 1' }]

      mediaService.getDetailEpisodes.mockResolvedValue(mockData)

      await mediaController.getEpisodes(req, res, next)

      // Kiểm tra xem controller có truyền đúng giá trị mặc định (season = 1) vào service không
      expect(mediaService.getDetailEpisodes).toHaveBeenCalledWith('456', 1)
      expect(res.status).toHaveBeenCalledWith(200) // Dựa theo code của bạn đang fix cứng 200
      expect(res.json).toHaveBeenCalledWith(mockData)
    })
  })
})
