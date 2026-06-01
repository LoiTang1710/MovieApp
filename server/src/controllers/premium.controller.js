import { StatusCodes } from 'http-status-codes'
import {
  createPendingSubscription,
  getActivePremiumPlans,
  getCurrentPremiumSubscription,
  simulateSuccessfulPayment,
} from '../services/premium.service.js'
import { env } from '../config/environment.config.js'
import { catchAsync } from '../utils/catchAsync.js'

export const getPremiumPlans = catchAsync(async (req, res) => {
  const plans = await getActivePremiumPlans()
  res.status(StatusCodes.OK).json(plans)
})

export const getMyPremiumSubscription = catchAsync(async (req, res) => {
  const userId = req.user?.id || req.user?.sub
  const subscription = await getCurrentPremiumSubscription({ userId })

  res.status(StatusCodes.OK).json({ subscription })
})

export const createSubscription = catchAsync(async (req, res) => {
  const { planId, paymentProvider } = req.body
  const userId = req.user?.id || req.user?.sub

  if (!planId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Vui long chon goi premium.',
    })
  }

  if (!['MOMO', 'VIETQR'].includes(paymentProvider)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Phuong thuc thanh toan khong hop le.',
    })
  }

  if (!userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Khong tim thay nguoi dung dang nhap.',
    })
  }

  const result = await createPendingSubscription({
    planId,
    userId,
    paymentProvider,
  })

  if (!result) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: 'Goi premium khong ton tai hoac da ngung cung cap.',
    })
  }

  const statusCode = result.created ? StatusCodes.CREATED : StatusCodes.OK
  res.status(statusCode).json({
    subscription: result.subscription,
    payment: result.payment,
  })
})

export const confirmDevPayment = catchAsync(async (req, res) => {
  if (env.ALLOW_DEV_AUTH !== 'true') {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'Mo phong thanh toan chi duoc bat trong moi truong dev.',
    })
  }

  const userId = req.user?.id || req.user?.sub
  const result = await simulateSuccessfulPayment({
    paymentId: req.params.paymentId,
    userId,
  })

  if (!result) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: 'Khong tim thay giao dich thanh toan.',
    })
  }

  if (result.invalidStatus) {
    return res.status(StatusCodes.CONFLICT).json({
      message: 'Chi co the xac nhan giao dich dang cho xu ly.',
    })
  }

  res.status(StatusCodes.OK).json(result)
})
