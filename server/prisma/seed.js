import prisma from '../src/config/database.config.js'
import { hashPassword } from '../src/services/auth.service.js'

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

const promotions = [
  {
    code: 'WELCOME50',
    name: 'Chào mừng thành viên mới',
    description: 'Giảm 50% gói Premium tháng đầu',
    discountPercent: 50,
    maxUses: 1000,
    usedCount: 120,
    status: 'ACTIVE',
    startAt: new Date('2025-01-01'),
    endAt: new Date('2026-12-31'),
  },
  {
    code: 'TET2026',
    name: 'Khuyến mãi Tết 2026',
    description: 'Giảm 30% tất cả gói Premium',
    discountPercent: 30,
    maxUses: 500,
    usedCount: 45,
    status: 'ACTIVE',
    startAt: new Date('2026-01-15'),
    endAt: new Date('2026-02-28'),
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

const seedAdminUser = async () => {
  const password = await hashPassword('admin123')
  await prisma.user.upsert({
    where: { email: 'admin@cinevibe.com' },
    update: {
      password,
      role: 'ADMIN',
      fullName: 'Nguyễn Văn Admin',
      phone: '0901234567',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
    },
    create: {
      email: 'admin@cinevibe.com',
      password,
      role: 'ADMIN',
      fullName: 'Nguyễn Văn Admin',
      phone: '0901234567',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
      profiles: { create: { name: 'Admin', type: 'ADULT' } },
    },
  })

  const userPassword = await hashPassword('user123')
  await prisma.user.upsert({
    where: { email: 'user@cinevibe.com' },
    update: {
      password,
      fullName: 'Trần Thị Lan',
      phone: '0912345678',
      dateOfBirth: new Date('1998-08-20'),
      gender: 'FEMALE',
    },
    create: {
      email: 'user@cinevibe.com',
      password: userPassword,
      role: 'USER',
      fullName: 'Trần Thị Lan',
      phone: '0912345678',
      dateOfBirth: new Date('1998-08-20'),
      gender: 'FEMALE',
      profiles: { create: { name: 'Người xem', type: 'ADULT' } },
    },
  })

  const password2 = await hashPassword('user123')
  await prisma.user.upsert({
    where: { email: 'minh.nguyen@email.com' },
    update: {},
    create: {
      email: 'minh.nguyen@email.com',
      password: password2,
      role: 'USER',
      fullName: 'Nguyễn Hoàng Minh',
      phone: '0923456789',
      dateOfBirth: new Date('1995-03-10'),
      gender: 'MALE',
    },
  })
}

const seedPromotions = async () => {
  for (const promo of promotions) {
    await prisma.promotion.upsert({
      where: { code: promo.code },
      update: promo,
      create: promo,
    })
  }
}

const seedTestUsers = async () => {
  const devPassword = await hashPassword('dev123')
  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: { email: 'user@test.com', password: devPassword, role: 'USER' },
  })

  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { email: 'admin@test.com', password: devPassword, role: 'ADMIN' },
  })

  console.log(
    'Seeded test users: user@test.com, admin@test.com (password: dev123)',
  )
}

try {
  await seedPremiumPlans()
  await seedAdminUser()
  await seedMovies() // <--- Đã sửa thành hàm mới
  await seedPromotions()
  await seedTestUsers()
  console.log('Seed completed: admin, users, movies, promotions.')
  console.log('Admin login: admin@cinevibe.com / admin123')
} catch (error) {
  console.error('Seed failed.', error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
