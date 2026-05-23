import { prisma } from '../config/database.config.js'

export const getActivePremiumPlans = async () => {
  const plans = await prisma.premiumPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  return plans.map((plan) => ({
    ...plan,
    price: Number(plan.price),
  }))
}
