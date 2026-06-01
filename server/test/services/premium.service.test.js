import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { prisma, tx } = vi.hoisted(() => {
  const transactionClient = {
    payment: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  }

  return {
    tx: transactionClient,
    prisma: {
      premiumPlan: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      subscription: {
        findFirst: vi.fn(),
      },
      $transaction: vi.fn((callback) => callback(transactionClient)),
    },
  }
})

vi.mock('../../src/config/database.config.js', () => ({
  default: prisma,
}))

import {
  createPendingSubscription,
  getActivePremiumPlans,
  getCurrentPremiumSubscription,
  simulateSuccessfulPayment,
} from '../../src/services/premium.service.js'

const plan = {
  id: 'plan-monthly',
  code: 'PREMIUM_MONTHLY',
  name: 'Premium Thang',
  price: '375000.00',
  currency: 'VND',
  durationDays: 30,
}

const subscription = {
  id: 'subscription-1',
  userId: 'user-1',
  planId: plan.id,
  status: 'PENDING',
  plan,
}

const payment = {
  id: 'payment-1',
  userId: 'user-1',
  subscriptionId: subscription.id,
  provider: 'MOMO',
  amount: '375000.00',
  currency: 'VND',
  status: 'PENDING',
}

describe('Premium Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    prisma.$transaction.mockImplementation((callback) => callback(tx))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns active plans with numeric prices', async () => {
    prisma.premiumPlan.findMany.mockResolvedValue([plan])

    const result = await getActivePremiumPlans()

    expect(prisma.premiumPlan.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    })
    expect(result).toEqual([{ ...plan, price: 375000 }])
  })

  it('returns the current active subscription with a numeric plan price', async () => {
    prisma.subscription.findFirst.mockResolvedValue({
      ...subscription,
      status: 'ACTIVE',
    })

    const result = await getCurrentPremiumSubscription({ userId: 'user-1' })

    expect(prisma.subscription.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        status: 'ACTIVE',
        endAt: { gt: expect.any(Date) },
      },
      include: { plan: true },
      orderBy: { endAt: 'desc' },
    })
    expect(result.plan.price).toBe(375000)
  })

  it('returns null when the selected plan is unavailable', async () => {
    prisma.premiumPlan.findFirst.mockResolvedValue(null)

    const result = await createPendingSubscription({
      planId: plan.id,
      userId: 'user-1',
      paymentProvider: 'MOMO',
    })

    expect(result).toBeNull()
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('creates a pending subscription and payment', async () => {
    prisma.premiumPlan.findFirst.mockResolvedValue(plan)
    tx.subscription.findFirst.mockResolvedValue(null)
    tx.subscription.create.mockResolvedValue(subscription)
    tx.payment.findFirst.mockResolvedValue(null)
    tx.payment.create.mockResolvedValue(payment)

    const result = await createPendingSubscription({
      planId: plan.id,
      userId: 'user-1',
      paymentProvider: 'MOMO',
    })

    expect(tx.subscription.create).toHaveBeenCalledWith({
      data: {
        planId: plan.id,
        userId: 'user-1',
      },
      include: { plan: true },
    })
    expect(tx.payment.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        subscriptionId: subscription.id,
        provider: 'MOMO',
        amount: plan.price,
        currency: 'VND',
      },
    })
    expect(result).toEqual({
      created: true,
      subscription: { ...subscription, plan: { ...plan, price: 375000 } },
      payment: { ...payment, amount: 375000 },
    })
  })

  it('reuses an existing pending subscription and payment', async () => {
    prisma.premiumPlan.findFirst.mockResolvedValue(plan)
    tx.subscription.findFirst.mockResolvedValue(subscription)
    tx.payment.findFirst.mockResolvedValue(payment)

    const result = await createPendingSubscription({
      planId: plan.id,
      userId: 'user-1',
      paymentProvider: 'MOMO',
    })

    expect(tx.subscription.create).not.toHaveBeenCalled()
    expect(tx.payment.create).not.toHaveBeenCalled()
    expect(result.created).toBe(false)
  })

  it('returns null when a payment does not belong to the user', async () => {
    tx.payment.findFirst.mockResolvedValue(null)

    const result = await simulateSuccessfulPayment({
      paymentId: payment.id,
      userId: 'other-user',
    })

    expect(result).toBeNull()
    expect(tx.payment.update).not.toHaveBeenCalled()
    expect(tx.subscription.update).not.toHaveBeenCalled()
  })

  it('returns an existing successful payment without updating it again', async () => {
    tx.payment.findFirst.mockResolvedValue({
      ...payment,
      status: 'SUCCEEDED',
      subscription,
    })

    const result = await simulateSuccessfulPayment({
      paymentId: payment.id,
      userId: 'user-1',
    })

    expect(result.payment.status).toBe('SUCCEEDED')
    expect(tx.payment.update).not.toHaveBeenCalled()
    expect(tx.subscription.update).not.toHaveBeenCalled()
  })

  it('rejects a payment that is no longer pending', async () => {
    tx.payment.findFirst.mockResolvedValue({
      ...payment,
      status: 'FAILED',
      subscription,
    })

    const result = await simulateSuccessfulPayment({
      paymentId: payment.id,
      userId: 'user-1',
    })

    expect(result.invalidStatus).toBe(true)
    expect(tx.payment.update).not.toHaveBeenCalled()
    expect(tx.subscription.update).not.toHaveBeenCalled()
  })

  it('marks a pending payment as succeeded and activates its subscription', async () => {
    const paidAt = new Date('2026-06-01T10:00:00.000Z')
    const endAt = new Date('2026-07-01T10:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(paidAt)
    tx.payment.findFirst.mockResolvedValue({
      ...payment,
      subscription,
    })
    tx.payment.update.mockResolvedValue({
      ...payment,
      status: 'SUCCEEDED',
      paidAt,
      providerTransactionId: `DEV-${payment.id}`,
    })
    tx.subscription.update.mockResolvedValue({
      ...subscription,
      status: 'ACTIVE',
      startAt: paidAt,
      endAt,
    })

    const result = await simulateSuccessfulPayment({
      paymentId: payment.id,
      userId: 'user-1',
    })

    expect(tx.payment.update).toHaveBeenCalledWith({
      where: { id: payment.id },
      data: {
        status: 'SUCCEEDED',
        paidAt,
        providerTransactionId: `DEV-${payment.id}`,
      },
    })
    expect(tx.subscription.update).toHaveBeenCalledWith({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        startAt: paidAt,
        endAt,
      },
      include: { plan: true },
    })
    expect(result.payment.status).toBe('SUCCEEDED')
    expect(result.subscription.status).toBe('ACTIVE')
  })
})
