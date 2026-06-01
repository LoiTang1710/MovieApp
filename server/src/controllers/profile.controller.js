import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'
import * as profileService from '../services/profile.service.js'

const VALID_TYPES = ['KID', 'ADULT']

export const getProfiles = catchAsync(async (req, res) => {
  const profiles = await profileService.getProfilesByUserId(req.user.id)

  res.status(StatusCodes.OK).json({
    success: true,
    data: profiles,
  })
})

export const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfileById(req.params.id, req.user.id)

  res.status(StatusCodes.OK).json({
    success: true,
    data: profile,
  })
})

export const createProfile = catchAsync(async (req, res) => {
  const { name, type } = req.body

  if (!name || !name.trim()) {
    throw new AppError('Vui lòng nhập tên hồ sơ', StatusCodes.BAD_REQUEST)
  }
  if (name.trim().length > 50) {
    throw new AppError('Tên hồ sơ không được vượt quá 50 ký tự', StatusCodes.BAD_REQUEST)
  }
  if (type && !VALID_TYPES.includes(type)) {
    throw new AppError('Loại hồ sơ không hợp lệ', StatusCodes.BAD_REQUEST)
  }

  const profile = await profileService.createProfile(req.user.id, { name: name.trim(), type })

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: profile,
  })
})

export const updateProfile = catchAsync(async (req, res) => {
  const { name, type } = req.body

  if (!name || !name.trim()) {
    throw new AppError('Vui lòng nhập tên hồ sơ', StatusCodes.BAD_REQUEST)
  }
  if (name.trim().length > 50) {
    throw new AppError('Tên hồ sơ không được vượt quá 50 ký tự', StatusCodes.BAD_REQUEST)
  }
  if (type && !VALID_TYPES.includes(type)) {
    throw new AppError('Loại hồ sơ không hợp lệ', StatusCodes.BAD_REQUEST)
  }

  const profile = await profileService.updateProfile(req.params.id, req.user.id, { name: name.trim(), type })

  res.status(StatusCodes.OK).json({
    success: true,
    data: profile,
  })
})

export const deleteProfile = catchAsync(async (req, res) => {
  await profileService.deleteProfile(req.params.id, req.user.id)

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Xóa hồ sơ thành công',
  })
})
