import { StatusCodes } from 'http-status-codes'
import {
  createPendingSubscription,
  getActivePremiumPlans,
} from '../services/premium.service.js'
import { catchAsync } from '../utils/catchAsync.js'

export const getPremiumPlans = catchAsync(async (req, res) => {
  const plans = await getActivePremiumPlans()
  res.status(StatusCodes.OK).json(plans)
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
