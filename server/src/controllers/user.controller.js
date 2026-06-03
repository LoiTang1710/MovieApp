
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { AppError } from '../utils/appError.js'
import { catchAsync } from '../utils/catchAsync.js'
import prisma from '../config/database.config.js'


export const getUserProfile = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      dateOfBirth: true,
      gender: true,
      avatarUrl: true,
      role: true,
      createdAt: true
    }
  })

  if (!user) {
    throw new AppError('Người dùng không tồn tại', StatusCodes.NOT_FOUND)
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: user
  })
})

export const updateUserProfile = catchAsync(async (req, res) => {
  const { fullName, phone, dateOfBirth, gender } = req.body
  const updateData = {}

  if (fullName !== undefined) updateData.fullName = fullName
  if (phone !== undefined) updateData.phone = phone
  if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth)
  if (gender !== undefined) updateData.gender = gender

  // Handle avatar upload if file exists
  if (req.file) {
    updateData.avatarUrl = `/uploads/${req.file.filename}`

  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      dateOfBirth: true,
      gender: true,
      avatarUrl: true
    }
  })

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Cập nhật thông tin thành công',
    data: updatedUser
  })
})

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new AppError('Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới', StatusCodes.BAD_REQUEST)
  }

  if (newPassword.length < 6) {
    throw new AppError('Mật khẩu mới phải có ít nhất 6 ký tự', StatusCodes.BAD_REQUEST)
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  if (!user || !user.password) {
    throw new AppError('Tài khoản không hợp lệ hoặc đăng nhập bằng phương thức khác', StatusCodes.BAD_REQUEST)
  }

  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
  if (!isPasswordCorrect) {
    throw new AppError('Mật khẩu hiện tại không chính xác', StatusCodes.UNAUTHORIZED)
  }

  const isSameAsCurrent = await bcrypt.compare(newPassword, user.password)
  if (isSameAsCurrent) {
    throw new AppError('Mật khẩu mới phải khác mật khẩu hiện tại', StatusCodes.BAD_REQUEST)
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedNewPassword }
  })

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Đổi mật khẩu thành công'
  })
})

export const getSubscriptionHistory = catchAsync(async (req, res) => {
  // Get active subscription and payment history
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId: req.user.id,
      status: 'ACTIVE',
      endAt: { gt: new Date() }
    },
    include: { plan: true },
    orderBy: { createdAt: 'desc' }
  })

  const payments = await prisma.payment.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      providerTransactionId: true,
      amount: true,
      currency: true,
      status: true,
      paidAt: true,
      createdAt: true
    }
  })

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      currentPlan: activeSubscription ? {
        code: activeSubscription.plan.code,
        name: activeSubscription.plan.name,
        price: activeSubscription.plan.price,
        endAt: activeSubscription.endAt
      } : null,
      history: payments
    }
  })
})
