import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'

export const uploadAvatarImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Vui lòng chọn ảnh' })
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`
  const url = `${baseUrl}/uploads/avatars/${req.file.filename}`

  res.status(StatusCodes.OK).json({
    message: 'Tải ảnh thành công',
    data: { url },
  })
})
