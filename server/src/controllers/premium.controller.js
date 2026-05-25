import { StatusCodes } from 'http-status-codes'
import { getActivePremiumPlans } from '../services/premium.service.js'
import { catchAsync } from '../utils/catchAsync.js'

export const getPremiumPlans = catchAsync(async (req, res) => {
  const plans = await getActivePremiumPlans()
  res.status(StatusCodes.OK).json(plans)
})
