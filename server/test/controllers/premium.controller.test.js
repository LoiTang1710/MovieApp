import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import * as premiumController from '../../src/controllers/premium.controller.js'
import * as premiumService from '../../src/services/premium.service.js'

vi.mock('../../src/services/premium.service.js', () => ({
  createPendingSubscription: vi.fn(),
  getActivePremiumPlans: vi.fn(),
}))

const mockResponse = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('Premium Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns active premium plans', async () => {
    const plans = [{ id: 'monthly', price: 375000 }]
    const res = mockResponse()

    premiumService.getActivePremiumPlans.mockResolvedValue(plans)

    await premiumController.getPremiumPlans({}, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith(plans)
  })

  it('rejects unsupported payment providers', async () => {
    const res = mockResponse()

    await premiumController.createSubscription(
      {
        body: { planId: 'monthly', paymentProvider: 'CASH' },
        user: { id: 'user-1' },
      },
      res,
      vi.fn(),
    )

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(premiumService.createPendingSubscription).not.toHaveBeenCalled()
  })

  it('creates a pending payment for the selected provider', async () => {
    const result = {
      created: true,
      subscription: { id: 'subscription-1' },
      payment: { id: 'payment-1', provider: 'MOMO', amount: 375000 },
    }
    const res = mockResponse()

    premiumService.createPendingSubscription.mockResolvedValue(result)

    await premiumController.createSubscription(
      {
        body: { planId: 'monthly', paymentProvider: 'MOMO' },
        user: { id: 'user-1' },
      },
      res,
      vi.fn(),
    )

    expect(premiumService.createPendingSubscription).toHaveBeenCalledWith({
      planId: 'monthly',
      userId: 'user-1',
      paymentProvider: 'MOMO',
    })
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
    expect(res.json).toHaveBeenCalledWith({
      subscription: result.subscription,
      payment: result.payment,
    })
  })

  it('reuses an existing pending payment', async () => {
    const result = {
      created: false,
      subscription: { id: 'subscription-1' },
      payment: { id: 'payment-1', provider: 'VIETQR', amount: 375000 },
    }
    const res = mockResponse()

    premiumService.createPendingSubscription.mockResolvedValue(result)

    await premiumController.createSubscription(
      {
        body: { planId: 'monthly', paymentProvider: 'VIETQR' },
        user: { sub: 'user-1' },
      },
      res,
      vi.fn(),
    )

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({
      subscription: result.subscription,
      payment: result.payment,
    })
  })
})
