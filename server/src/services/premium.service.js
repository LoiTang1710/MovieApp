import prisma from "../config/database.config.js"


export const getActivePremiumPlans = async () => {
  const plans = await prisma.premiumPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  return plans.map(serializePlan)
}

export const createPendingSubscription = async ({
  planId,
  userId,
  paymentProvider,
}) => {
  const plan = await prisma.premiumPlan.findFirst({
    where: {
      id: planId,
      isActive: true,
    },
  })

  if (!plan) {
    return null
  }

  return prisma.$transaction(async (tx) => {
    let subscription = await tx.subscription.findFirst({
      where: {
        planId: plan.id,
        userId,
        status: 'PENDING',
      },
      include: {
        plan: true,
      },
    })
    let subscriptionCreated = false

    if (!subscription) {
      subscription = await tx.subscription.create({
        data: {
          planId: plan.id,
          userId,
        },
        include: {
          plan: true,
        },
      })
      subscriptionCreated = true
    }

    let payment = await tx.payment.findFirst({
      where: {
        subscriptionId: subscription.id,
        provider: paymentProvider,
        status: 'PENDING',
      },
    })
    let paymentCreated = false

    if (!payment) {
      payment = await tx.payment.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          provider: paymentProvider,
          amount: plan.price,
          currency: plan.currency,
        },
      })
      paymentCreated = true
    }

    return {
      created: subscriptionCreated || paymentCreated,
      subscription: serializeSubscription(subscription),
      payment: serializePayment(payment),
    }
  })
}

const serializePlan = (plan) => ({
  ...plan,
  price: Number(plan.price),
})

const serializeSubscription = (subscription) => ({
  ...subscription,
  plan: serializePlan(subscription.plan),
})

const serializePayment = (payment) => ({
  ...payment,
  amount: Number(payment.amount),
})
