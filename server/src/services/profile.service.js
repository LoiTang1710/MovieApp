import { StatusCodes } from 'http-status-codes'
import prisma from '../config/database.config.js'
import { AppError } from '../utils/AppError.js'

const MAX_PROFILES = 5

export const getProfilesByUserId = async (userId) => {
  const profiles = await prisma.profile.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
  return profiles
}

export const getProfileById = async (id, userId) => {
  const profile = await prisma.profile.findUnique({ where: { id } })
  if (!profile || profile.userId !== userId) {
    throw new AppError('Hồ sơ không tồn tại', StatusCodes.NOT_FOUND)
  }
  return profile
}

export const createProfile = async (userId, { name, type }) => {
  const count = await prisma.profile.count({ where: { userId } })
  if (count >= MAX_PROFILES) {
    throw new AppError(`Bạn chỉ có thể tạo tối đa ${MAX_PROFILES} hồ sơ`, StatusCodes.BAD_REQUEST)
  }

  const profile = await prisma.profile.create({
    data: {
      name,
      type: type || 'ADULT',
      userId,
    },
  })
  return profile
}

export const updateProfile = async (id, userId, { name, type }) => {
  await getProfileById(id, userId)

  const profile = await prisma.profile.update({
    where: { id },
    data: { name, type },
  })
  return profile
}

export const deleteProfile = async (id, userId) => {
  await getProfileById(id, userId)
  await prisma.profile.delete({ where: { id } })
}
