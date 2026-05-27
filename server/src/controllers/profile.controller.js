import {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getAvatars,
} from '../services/profile.service.js'
import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../utils/catchAsync.js'

export const getAll = catchAsync(async (req, res) => {
  const data = await getProfiles()
  res.status(StatusCodes.OK).json(data)
})

export const getOne = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = await getProfile(id)
  res.status(StatusCodes.OK).json(data)
})

export const create = catchAsync(async (req, res) => {
  const data = await createProfile(req.body)
  res.status(StatusCodes.CREATED).json(data)
})

export const update = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = await updateProfile(id, req.body)
  res.status(StatusCodes.OK).json(data)
})

export const remove = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = await deleteProfile(id)
  res.status(StatusCodes.OK).json(data)
})

export const avatars = catchAsync(async (req, res) => {
  const data = await getAvatars()
  res.status(StatusCodes.OK).json(data)
})
