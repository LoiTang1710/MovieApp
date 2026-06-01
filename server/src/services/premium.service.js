import prisma from "../config/database.config.js"


export const getActivePremiumPlans = async () => {
  const plans = await prisma.premiumPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  return plans.map(serializePlan)
}

export const getCurrentPremiumSubscription = async ({ userId }) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      endAt: {
        gt: new Date(),
      },
    },
    include: {
      plan: true,
    },
    orderBy: {
      endAt: 'desc',
    },
  })

  return subscription ? serializeSubscription(subscription) : null
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

export const simulateSuccessfulPayment = async ({ paymentId, userId }) =>
  prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: {
        id: paymentId,
        userId,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    })

    if (!payment?.subscription) {
      return null
    }

    if (payment.status === 'SUCCEEDED') {
      return {
        payment: serializePayment(payment),
        subscription: serializeSubscription(payment.subscription),
      }
    }

    if (payment.status !== 'PENDING') {
      return {
        invalidStatus: true,
        payment: serializePayment(payment),
        subscription: serializeSubscription(payment.subscription),
      }
    }

    const paidAt = new Date()
    const endAt = new Date(paidAt)
    endAt.setDate(endAt.getDate() + payment.subscription.plan.durationDays)

    const [updatedPayment, updatedSubscription] = await Promise.all([
      tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCEEDED',
          paidAt,
          providerTransactionId: `DEV-${payment.id}`,
        },
      }),
      tx.subscription.update({
        where: { id: payment.subscription.id },
        data: {
          status: 'ACTIVE',
          startAt: paidAt,
          endAt,
        },
        include: {
          plan: true,
        },
      }),
    ])

    return {
      payment: serializePayment(updatedPayment),
      subscription: serializeSubscription(updatedSubscription),
    }
  })

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
