import { prisma } from '../config/database.config.js'

export const getActivePremiumPlans = async () => {
  const plans = await prisma.premiumPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  return plans.map(serializePlan)
}

export const createPendingSubscription = async ({ planId, userId }) => {
  const plan = await prisma.premiumPlan.findFirst({
    where: {
      id: planId,
      isActive: true,
    },
  })

  if (!plan) {
    return null
  }

  const pendingSubscription = await prisma.subscription.findFirst({
    where: {
      planId: plan.id,
      userId,
      status: 'PENDING',
    },
    include: {
      plan: true,
    },
  })

  if (pendingSubscription) {
    return {
      created: false,
      subscription: serializeSubscription(pendingSubscription),
    }
  }

  const subscription = await prisma.subscription.create({
    data: {
      planId: plan.id,
      userId,
    },
    include: {
      plan: true,
    },
  })

  return {
    created: true,
    subscription: serializeSubscription(subscription),
  }
}

const serializePlan = (plan) => ({
  ...plan,
  price: Number(plan.price),
})

const serializeSubscription = (subscription) => ({
  ...subscription,
  plan: serializePlan(subscription.plan),
})
