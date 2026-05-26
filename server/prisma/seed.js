import { prisma } from '../src/config/database.config.js'

const premiumPlans = [
  {
    code: 'PREMIUM_MONTHLY',
    name: 'Premium Tháng',
    price: 375000,
    currency: 'VND',
    durationDays: 30,
    isActive: true,
  },
  {
    code: 'PREMIUM_YEARLY',
    name: 'Premium Năm',
    price: 2999999,
    currency: 'VND',
    durationDays: 365,
    isActive: true,
  },
]

const seedPremiumPlans = async () => {
  await Promise.all(
    premiumPlans.map(({ code, ...data }) =>
      prisma.premiumPlan.upsert({
        where: { code },
        update: data,
        create: { code, ...data },
      }),
    ),
  )
}

try {
  await seedPremiumPlans()
  console.log('Seeded premium plans successfully.')
} catch (error) {
  console.error('Failed to seed premium plans.', error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
